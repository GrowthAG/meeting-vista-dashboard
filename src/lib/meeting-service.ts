
import { Meeting } from "@/types/meeting";
import { mockMeetings } from "./mock-meetings";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = window.location.origin;
const API_URL = `${API_BASE_URL}/api/meetings`;

// Variável para armazenar as reuniões em memória (solução temporária)
let inMemoryMeetings: Meeting[] = [...mockMeetings];

// Função para buscar todas as reuniões
export const fetchMeetings = async (): Promise<Meeting[]> => {
  try {
    // Tenta buscar do endpoint real
    const response = await fetch(API_URL);
    
    // Verifica se a resposta é válida
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    }
    
    console.log("Usando dados em memória devido a falha na API");
    return inMemoryMeetings;
  } catch (error) {
    console.error("Erro ao buscar reuniões:", error);
    return inMemoryMeetings;
  }
};

// Função para buscar uma reunião específica por ID
export const fetchMeetingById = async (id: string): Promise<Meeting | undefined> => {
  try {
    // Tenta buscar do endpoint real
    const response = await fetch(`${API_URL}/${id}`);
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      }
    }
    
    // Fallback para dados em memória
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
    // Constrói a URL com parâmetros de consulta
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (organizer) params.append("organizer", organizer);
    if (dateFrom) params.append("dateFrom", dateFrom);
    if (dateTo) params.append("dateTo", dateTo);
    
    const url = `${API_URL}/search?${params.toString()}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      }
    }
    
    // Fallback para filtro local com dados em memória
    return filterMeetingsLocally(inMemoryMeetings, query, organizer, dateFrom, dateTo);
  } catch (error) {
    console.error("Erro ao pesquisar reuniões:", error);
    return filterMeetingsLocally(inMemoryMeetings, query, organizer, dateFrom, dateTo);
  }
};

// Função para filtrar reuniões localmente
const filterMeetingsLocally = (
  meetings: Meeting[], 
  query: string,
  organizer: string,
  dateFrom: string,
  dateTo: string
): Meeting[] => {
  return meetings.filter(meeting => {
    // Filtro por texto de busca
    const matchesQuery = !query || 
      meeting.resumo.toLowerCase().includes(query.toLowerCase()) || 
      meeting.transcricao.toLowerCase().includes(query.toLowerCase());
    
    // Filtro por organizador
    const matchesOrganizer = !organizer || 
      meeting.organizador.toLowerCase().includes(organizer.toLowerCase());
    
    // Filtro por data inicial
    const matchesDateFrom = !dateFrom || 
      new Date(meeting.data_reuniao) >= new Date(dateFrom);
    
    // Filtro por data final
    const matchesDateTo = !dateTo || 
      new Date(meeting.data_reuniao) <= new Date(dateTo);
    
    return matchesQuery && matchesOrganizer && matchesDateFrom && matchesDateTo;
  });
};

// Função para obter estatísticas
export const getStatistics = async () => {
  try {
    // Tenta buscar do endpoint real
    const response = await fetch(`${API_URL}/statistics`);
    
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      }
    }
    
    // Fallback para calcular estatísticas localmente
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

// Função para receber novos dados do webhook
export const receiveWebhookData = async (data: Omit<Meeting, "id">): Promise<Meeting | null> => {
  try {
    // Primeiro tenta enviar para o endpoint real
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const newMeeting = await response.json();
        return newMeeting;
      }
    }
    
    // Se falhar, armazena em memória (solução temporária)
    const newMeeting: Meeting = {
      id: uuidv4(),
      ...data
    };
    
    inMemoryMeetings.push(newMeeting);
    toast.success("Nova reunião recebida!");
    return newMeeting;
  } catch (error) {
    console.error("Erro ao processar dados do webhook:", error);
    
    // Mesmo com erro, armazena em memória
    const newMeeting: Meeting = {
      id: uuidv4(),
      ...data
    };
    
    inMemoryMeetings.push(newMeeting);
    toast.success("Nova reunião recebida!");
    return newMeeting;
  }
};

