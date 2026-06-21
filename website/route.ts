import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSystemPrompt } from '@/lib/chatbot/system-prompt'
import { saveAppointment } from '@/lib/chatbot/save-appointment'
import type { AppointmentData } from '@/types/chatbot'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Tool definition for appointment booking
const tools: Anthropic.Tool[] = [
  {
    name: 'book_appointment',
    description:
      'Save a new appointment request to the database. Call this ONLY when ALL required information has been collected from the conversation.',
    input_schema: {
      type: 'object' as const,
      properties: {
        parent_name: {
          type: 'string',
          description: 'Full name of the parent or guardian',
        },
        child_name: {
          type: 'string',
          description: 'First name of the child',
        },
        child_age: {
          type: 'string',
          description: 'Age of the child (e.g., "3 years", "18 months")',
        },
        service: {
          type: 'string',
          description:
            'Therapy service the family is interested in (Speech Therapy, OT, PT, ABA, or Developmental Assessment)',
        },
        phone: {
          type: 'string',
          description: 'Contact phone or WhatsApp number',
        },
        preferred_time: {
          type: 'string',
          description: 'Preferred days or time slots for the appointment',
        },
        notes: {
          type: 'string',
          description: 'Any additional notes, concerns, or context provided by the parent',
        },
        language: {
          type: 'string',
          enum: ['ar', 'en'],
          description: 'Language used in the conversation',
        },
      },
      required: ['parent_name', 'child_name', 'child_age', 'service', 'phone'],
    },
  },
]

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // First Claude call
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: getSystemPrompt(),
      tools,
      messages,
    })

    // Handle tool use (appointment booking)
    if (response.stop_reason === 'tool_use') {
      const toolUseBlock = response.content.find(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      )

      if (toolUseBlock && toolUseBlock.name === 'book_appointment') {
        const appointmentData = toolUseBlock.input as AppointmentData
        const saved = await saveAppointment(appointmentData)

        // Continue conversation with tool result
        const continueResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: getSystemPrompt(),
          tools,
          messages: [
            ...messages,
            { role: 'assistant' as const, content: response.content },
            {
              role: 'user' as const,
              content: [
                {
                  type: 'tool_result' as const,
                  tool_use_id: toolUseBlock.id,
                  content: saved
                    ? 'Appointment request saved successfully in the system.'
                    : 'Failed to save appointment. Please ask the user to try again or contact us directly.',
                },
              ],
            },
          ],
        })

        return NextResponse.json(continueResponse)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Chat API Error]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
