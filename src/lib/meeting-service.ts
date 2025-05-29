
import { Meeting } from "@/types/meeting";
import { supabase } from "@/integrations/supabase/client";

// Função para buscar todas as reuniões do Supabase
export const fetchMeetings = async (): Promise<Meeting[]> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('data_reuniao', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar reuniões:', error);
      throw error;
    }
    
    console.log('Reuniões carregadas do Supabase:', data.length);
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar reuniões do Supabase:", error);
    throw error;
  }
};

// Função para buscar uma reunião específica por ID
export const fetchMeetingById = async (id: string): Promise<Meeting | undefined> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar reunião com ID ${id}:`, error);
      return undefined;
    }
    
    return data;
  } catch (error) {
    console.error(`Erro ao buscar reunião com ID ${id}:`, error);
    return undefined;
  }
};

// Função para pesquisar reuniões com filtros
export const searchMeetings = async (
  query: string,
  organizer: string,
  dateFrom: string,
  dateTo: string
): Promise<Meeting[]> => {
  try {
    let supabaseQuery = supabase.from('meetings').select('*');
    
    // Adicionar filtros
    if (query) {
      supabaseQuery = supabaseQuery.or(`resumo.ilike.%${query}%,transcricao.ilike.%${query}%`);
    }
    if (organizer) {
      supabaseQuery = supabaseQuery.ilike('organizador', `%${organizer}%`);
    }
    if (dateFrom) {
      supabaseQuery = supabaseQuery.gte('data_reuniao', dateFrom);
    }
    if (dateTo) {
      supabaseQuery = supabaseQuery.lte('data_reuniao', dateTo);
    }
    
    const { data, error } = await supabaseQuery.order('data_reuniao', { ascending: false });
    
    if (error) {
      console.error("Erro ao pesquisar reuniões:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao pesquisar reuniões:", error);
    throw error;
  }
};

// Função para obter estatísticas
export const getStatistics = async () => {
  try {
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select('data_reuniao');
    
    if (error) {
      console.error("Erro ao obter estatísticas:", error);
      throw error;
    }
    
    console.log('Estatísticas calculadas com', meetings?.length || 0, 'reuniões');
    return calculateStatisticsLocally(meetings || []);
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    throw error;
  }
};

// Função para calcular estatísticas localmente
const calculateStatisticsLocally = (meetings: any[]) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const thisWeek = meetings.filter(meeting => 
    new Date(meeting.data_reuniao) >= startOfWeek
  ).length;
  
  const thisMonth = meetings.filter(meeting => 
    new Date(meeting.data_reuniao) >= startOfMonth
  ).length;
  
  return {
    total: meetings.length,
    thisWeek,
    thisMonth
  };
};
