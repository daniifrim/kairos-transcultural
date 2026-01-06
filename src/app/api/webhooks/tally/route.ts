import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface TallyField {
  key: string
  label: string
  type: string
  value: string | boolean | string[] | null
}

interface TallyWebhookPayload {
  eventId: string
  eventType: string
  createdAt: string
  data: {
    responseId: string
    submissionId: string
    respondentId: string
    formId: string
    formName: string
    createdAt: string
    fields: TallyField[]
  }
}

async function findBestMatch(tallyName: string, participants: { id: string; name: string }[]) {
  if (participants.length === 0) return null

  const prompt = `You are a name matching assistant. Given a name from a form submission and a list of existing participants, find the best match.

Form submission name: "${tallyName}"

Existing participants:
${participants.map((p, i) => `${i + 1}. "${p.name}" (ID: ${p.id})`).join('\n')}

Instructions:
- Compare the names accounting for different orderings (first name/last name swap)
- Account for minor spelling variations, typos, or diacritics differences
- Romanian names may have diacritics (ă, â, î, ș, ț) that might be missing in one version
- Return ONLY the ID of the best matching participant, or "NO_MATCH" if no reasonable match exists
- A match should have at least 70% similarity in the names

Response format: Just the ID or "NO_MATCH", nothing else.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://kairostranscultural.ifrim.tech',
        'X-Title': 'Kairos Transcultural',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0,
      }),
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', await response.text())
      return null
    }

    const data = await response.json()
    const matchId = data.choices[0]?.message?.content?.trim()

    if (matchId && matchId !== 'NO_MATCH') {
      const participant = participants.find(p => p.id === matchId)
      return participant || null
    }

    return null
  } catch (error) {
    console.error('Error calling OpenRouter:', error)
    return null
  }
}

function extractFieldValue(fields: TallyField[], label: string): string {
  const field = fields.find(f => f.label.toLowerCase().includes(label.toLowerCase()))
  if (!field) return ''
  if (typeof field.value === 'string') return field.value
  if (Array.isArray(field.value)) return field.value.join(', ')
  return String(field.value || '')
}

export async function POST(request: Request) {
  try {
    const payload: TallyWebhookPayload = await request.json()
    const { fields } = payload.data

    // Extract form data
    const tallyData = {
      name: extractFieldValue(fields, 'nume'),
      age: extractFieldValue(fields, 'vârst'),
      gender: extractFieldValue(fields, 'sex'),
      phone: extractFieldValue(fields, 'telefon'),
      email: extractFieldValue(fields, 'email'),
      passport: extractFieldValue(fields, 'pașaport'),
      plane_ticket_url: extractFieldValue(fields, 'bilet'),
      church: extractFieldValue(fields, 'biseric'),
      country: extractFieldValue(fields, 'țar'),
      previous_kairos: extractFieldValue(fields, 'kairos').toLowerCase().includes('da'),
      allergies: extractFieldValue(fields, 'alergii'),
      other_info: extractFieldValue(fields, 'alte informații'),
      submitted_at: payload.data.createdAt,
    }

    // Get active cohort
    const { data: activeCohort } = await supabase
      .from('cohorts')
      .select('id')
      .eq('is_active', true)
      .single()

    if (!activeCohort) {
      console.error('No active cohort found')
      return NextResponse.json({ error: 'No active cohort' }, { status: 400 })
    }

    // Get all participants from active cohort who haven't completed the form
    const { data: participants } = await supabase
      .from('participants')
      .select('id, name')
      .eq('cohort_id', activeCohort.id)
      .eq('form_completed', false)

    // Try to find a match using AI
    const match = await findBestMatch(tallyData.name, participants || [])

    if (match) {
      // Update existing participant
      await supabase
        .from('participants')
        .update({
          form_completed: true,
          tally_data: tallyData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', match.id)

      console.log(`Matched Tally submission to participant: ${match.name} (${match.id})`)
      return NextResponse.json({ success: true, matched: true, participantId: match.id })
    } else {
      // Create new participant record (unmatched submission)
      const { data: newParticipant } = await supabase
        .from('participants')
        .insert({
          cohort_id: activeCohort.id,
          name: tallyData.name,
          contact: tallyData.email || tallyData.phone,
          status: 'expressed_interest',
          form_completed: true,
          tally_data: tallyData,
          added_by: null,
        })
        .select()
        .single()

      console.log(`Created new participant from Tally submission: ${tallyData.name}`)
      return NextResponse.json({ success: true, matched: false, participantId: newParticipant?.id })
    }
  } catch (error) {
    console.error('Tally webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
