const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const prisma = require('../db');
const { getSystemPrompt } = require('../chatbot/system-prompt');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [
  {
    name: 'book_appointment',
    description: 'Save appointment request when ALL required info is collected.',
    input_schema: {
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
      await prisma.chatbotSession.update({
        where: { sessionId },
        data: { lastSeen: new Date() },
      }).catch(() => {});
    }
  } catch (e) {
    console.error('[upsertSession]', e.message);
  }
}

async function saveMsg({ sessionId, role, content, language }) {
  if (!sessionId) return;
  try {
    await prisma.chatbotMessage.create({ data: { sessionId, role, content, language } });
  } catch (e) {
    console.error('[saveMsg]', e.message);
  }
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
  } catch (e) {
    console.error('[saveAppointment]', e.message);
    return false;
  }
}

router.post('/', async (req, res) => {
  try {
    const { messages, session_id, page_url, user_agent, is_new_session } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages' });
    }

    const language = detectLanguage(messages);

    await upsertSession({ sessionId: session_id, language, pageUrl: page_url, userAgent: user_agent, isNew: is_new_session });

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      await saveMsg({ sessionId: session_id, role: 'user', content: lastUserMsg.content, language });
    }

    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     getSystemPrompt(),
      tools,
      messages,
    });

    // Handle tool use (appointment booking)
    if (response.stop_reason === 'tool_use') {
      const toolBlock = response.content.find(b => b.type === 'tool_use');
      if (toolBlock?.name === 'book_appointment') {
        const saved = await saveAppointment(toolBlock.input, session_id);
        const continueResponse = await anthropic.messages.create({
          model:      'claude-sonnet-4-6',
          max_tokens: 1024,
          system:     getSystemPrompt(),
          tools,
          messages: [
            ...messages,
            { role: 'assistant', content: response.content },
            {
              role: 'user',
              content: [{
                type:        'tool_result',
                tool_use_id: toolBlock.id,
                content:     saved
                  ? 'Appointment saved successfully.'
                  : 'Failed to save. Please ask the user to try again or contact us directly.',
              }],
            },
          ],
        });

        const replyText = continueResponse.content
          .filter(b => b.type === 'text').map(b => b.text).join('');
        if (replyText) await saveMsg({ sessionId: session_id, role: 'assistant', content: replyText, language });

        return res.json(continueResponse);
      }
    }

    const replyText = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    if (replyText) await saveMsg({ sessionId: session_id, role: 'assistant', content: replyText, language });

    res.json(response);
  } catch (error) {
    console.error('[Chat API Error]', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
