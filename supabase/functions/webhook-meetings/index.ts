
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Webhook recebido:', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    console.log('Supabase URL:', supabaseUrl)
    console.log('Service Role Key disponível:', !!supabaseKey)
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const meetingData = await req.json()
    console.log('Dados recebidos:', meetingData)

    // Validate required fields
    const requiredFields = ['organizador', 'convidados', 'data_reuniao', 'horario_reuniao']
    for (const field of requiredFields) {
      if (!meetingData[field]) {
        console.error(`Campo obrigatório ausente: ${field}`)
        return new Response(
          JSON.stringify({ error: `Campo obrigatório ausente: ${field}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Generate UUID for the meeting
    const meetingId = crypto.randomUUID()
    console.log('ID da reunião gerado:', meetingId)

    // Prepare data for insertion
    const meetingRecord = {
      id: meetingId,
      organizador: meetingData.organizador,
      convidados: Array.isArray(meetingData.convidados) ? meetingData.convidados : [meetingData.convidados],
      data_reuniao: meetingData.data_reuniao,
      horario_reuniao: meetingData.horario_reuniao,
      link_gravacao: meetingData.link_gravacao || '',
      transcricao: meetingData.transcricao || '',
      resumo: meetingData.resumo || '',
      created_at: new Date().toISOString()
    }

    console.log('Dados preparados para inserção:', meetingRecord)

    // Insert into database
    const { data, error } = await supabase
      .from('meetings')
      .insert([meetingRecord])
      .select()

    if (error) {
      console.error('Erro ao inserir reunião:', error)
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar reunião no banco de dados', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Reunião inserida com sucesso:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reunião salva com sucesso',
        data: data[0]
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erro na função webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
