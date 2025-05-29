
import { Meeting } from "@/types/meeting";
import { mockMeetings } from "./mock-meetings";
import { toast } from "sonner";

// Estas URLs serão automaticamente configuradas pela integração do Lovable com Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Variável para armazenar as reuniões em memória (fallback)
let inMemoryMeetings: Meeting[] = [...mockMeetings];

// Função para buscar todas as reuniões do Supabase
export const fetchMeetings = async (): Promise<Meeting[]> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/meetings?select=*&order=data_reuniao.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Reuniões carregadas do Supabase:', data.length);
      return data;
    } else {
      console.log('Erro na resposta do Supabase:', response.status, response.statusText);
      console.log("Usando dados em memória devido a falha na API do Supabase");
      return inMemoryMeetings;
    }
  } catch (error) {
    console.error("Erro ao buscar reuniões do Supabase:", error);
    return inMemoryMeetings;
  }
};

// Função para buscar uma reunião específica por ID
export const fetchMeetingById = async (id: string): Promise<Meeting | undefined> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/meetings?id=eq.${id}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data[0];
    }
    
    return inMemoryMeetings.find(meeting => meeting.id === id);
  } catch (error) {
    console.error(`Erro ao buscar reunião com ID ${id}:`, error);
    return inMemoryMeetings.find(meeting => meeting.id === id);
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
    let supabaseQuery = `${SUPABASE_URL}/rest/v1/meetings?select=*`;
    
    // Adicionar filtros à query do Supabase
    if (query) {
      supabaseQuery += `&or=(resumo.ilike.*${query}*,transcricao.ilike.*${query}*)`;
    }
    if (organizer) {
      supabaseQuery += `&organizador.ilike.*${organizer}*`;
    }
    if (dateFrom) {
      supabaseQuery += `&data_reuniao.gte.${dateFrom}`;
    }
    if (dateTo) {
      supabaseQuery += `&data_reuniao.lte.${dateTo}`;
    }
    
    supabaseQuery += `&order=data_reuniao.desc`;
    
    const response = await fetch(supabaseQuery, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // Fallback para filtro local com dados em memória
    return filterMeetingsLocally(inMemoryMeetings, query, organizer, dateFrom, dateTo);
  } catch (error) {
    console.error("Erro ao pesquisar reuniões:", error);
    return filterMeetingsLocally(inMemoryMeetings, query, organizer, dateFrom, dateTo);
  }
};

// Função para filtrar reuniões localmente (fallback)
const filterMeetingsLocally = (
  meetings: Meeting[], 
  query: string,
  organizer: string,
  dateFrom: string,
  dateTo: string
): Meeting[] => {
  return meetings.filter(meeting => {
    const matchesQuery = !query || 
      meeting.resumo.toLowerCase().includes(query.toLowerCase()) || 
      meeting.transcricao.toLowerCase().includes(query.toLowerCase());
    
    const matchesOrganizer = !organizer || 
      meeting.organizador.toLowerCase().includes(organizer.toLowerCase());
    
    const matchesDateFrom = !dateFrom || 
      new Date(meeting.data_reuniao) >= new Date(dateFrom);
    
    const matchesDateTo = !dateTo || 
      new Date(meeting.data_reuniao) <= new Date(dateTo);
    
    return matchesQuery && matchesOrganizer && matchesDateFrom && matchesDateTo;
  });
};

// Função para obter estatísticas
export const getStatistics = async () => {
  try {
    // Buscar estatísticas do Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/meetings?select=data_reuniao`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const meetings = await response.json();
      console.log('Estatísticas calculadas com', meetings.length, 'reuniões');
      return calculateStatisticsLocally(meetings);
    }
    
    return calculateStatisticsLocally(inMemoryMeetings);
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return calculateStatisticsLocally(inMemoryMeetings);
  }
};

// Função para calcular estatísticas localmente
const calculateStatisticsLocally = (meetings: Meeting[]) => {
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
