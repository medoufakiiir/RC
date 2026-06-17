const express = require('express');
const prisma = require('../db');
const { getSystemPrompt } = require('../chatbot/system-prompt');

const router = express.Router();

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

const tools = [
  {
    type: 'function',
    function: {
      name: 'book_appointment',
      description: 'Save appointment request when ALL required info is collected.',
      parameters: {
        type: 'object',
        properties: {
          parent_name:    { type: 'string', description: 'Full name of parent/guardian' },
          child_name:     { type: 'string', description: 'Name of the child' },
          child_age:      { type: 'string', description: 'Age of the child' },
          service:        { type: 'string', description: 'Therapy service interested in' },
          phone:          { type: 'string', description: 'Contact phone/WhatsApp number' },
          preferred_time: { type: 'string', description: 'Preferred appointment time/days' },
          notes:          { type: 'string', description: 'Additional notes or concerns' },
          language:       { type: 'string', enum: ['ar', 'en'], description: 'Conversation language' },
        },
        required: ['parent_name', 'child_name', 'child_age', 'service', 'phone'],
      },
    },
  },
];

function detectLanguage(messages) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
  const arabicChars = (lastUserMsg.match(/[؀-ۿ]/g) ?? []).length;
  const latinChars  = (lastUserMsg.match(/[a-zA-Z]/g) ?? []).length;
  if (arabicChars > 0 && latinChars === 0) return 'ar';
  if (latinChars > 0 && arabicChars === 0) return 'en';
  return 'mixed';
}

async function upsertSession({ sessionId, language, pageUrl, userAgent, isNew }) {
  if (!sessionId) return;
  try {
    if (isNew) {
      await prisma.chatbotSession.upsert({
        where: { sessionId },
        update: { lastSeen: new Date(), status: 'active' },
        create: { sessionId, language, pageUrl: pageUrl ?? '', userAgent: userAgent ?? '', status: 'active' },
      });
    } else {
      await prisma.chatbotSession.update({ where: { sessionId }, data: { lastSeen: new Date() } }).catch(() => {});
    }
  } catch (e) { console.error('[upsertSession]', e.message); }
}

async function saveMsg({ sessionId, role, content, language }) {
  if (!sessionId) return;
  try {
    await prisma.chatbotMessage.create({ data: { sessionId, role, content, language } });
  } catch (e) { console.error('[saveMsg]', e.message); }
}

async function saveAppointment(data, sessionId) {
  try {
    await prisma.chatbotAppointment.create({
      data: {
        sessionId:     sessionId ?? null,
        parentName:    data.parent_name,
        childName:     data.child_name,
        childAge:      data.child_age,
        service:       data.service,
        phone:         data.phone,
        preferredTime: data.preferred_time ?? null,
        notes:         data.notes ?? null,
        language:      data.language ?? 'ar',
        status:        'pending',
        source:        'chatbot',
      },
    });
    return true;
  } catch (e) { console.error('[saveAppointment]', e.message); return false; }
}

async function callDeepSeek(messages, useTools = true) {
  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${DEEPSEEK_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 1024,
      ...(useTools && { tools, tool_choice: 'auto' }),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[DeepSeek Error]', res.status, err);
    throw new Error(`DeepSeek API error: ${res.status}`);
  }
  return res.json();
}

router.post('/', async (req, res) => {
  try {
    const { messages, session_id, page_url, user_agent, is_new_session } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages' });
    }
    if (!DEEPSEEK_KEY) {
      return res.status(500).json({ error: 'Chatbot not configured' });
    }

    const language = detectLanguage(messages);
    await upsertSession({ sessionId: session_id, language, pageUrl: page_url, userAgent: user_agent, isNew: is_new_session });

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) await saveMsg({ sessionId: session_id, role: 'user', content: lastUserMsg.content, language });

    // Build DeepSeek messages with system prompt
    const deepseekMessages = [
      { role: 'system', content: getSystemPrompt() },
      ...messages,
    ];

    const response = await callDeepSeek(deepseekMessages);
    const choice = response.choices?.[0]?.message;

    if (!choice) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    // Handle tool calls (appointment booking)
    if (choice.tool_calls?.length > 0) {
      const toolCall = choice.tool_calls[0];
      if (toolCall.function.name === 'book_appointment') {
        const args = JSON.parse(toolCall.function.arguments);
        const saved = await saveAppointment(args, session_id);

        const followUp = await callDeepSeek([
          ...deepseekMessages,
          choice,
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: saved
              ? 'Appointment saved successfully.'
              : 'Failed to save. Please ask the user to try again or contact us directly.',
          },
        ], false);

        const replyText = followUp.choices?.[0]?.message?.content ?? '';
        if (replyText) await saveMsg({ sessionId: session_id, role: 'assistant', content: replyText, language });

        // Return in Anthropic-like format for frontend compatibility
        return res.json({
          content: [{ type: 'text', text: replyText }],
        });
      }
    }

    const replyText = choice.content ?? '';
    if (replyText) await saveMsg({ sessionId: session_id, role: 'assistant', content: replyText, language });

    // Return in Anthropic-like format for frontend compatibility
    res.json({
      content: [{ type: 'text', text: replyText }],
    });
  } catch (error) {
    console.error('[Chat API Error]', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
