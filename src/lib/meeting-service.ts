
import { Meeting } from "@/types/meeting";

const API_URL = "/api/meetings";

// Função para buscar todas as reuniões
export const fetchMeetings = async (): Promise<Meeting[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar reuniões:", error);
    return [];
  }
};

// Função para buscar uma reunião específica por ID
export const fetchMeetingById = async (id: string): Promise<Meeting | undefined> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
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
    // Constrói a URL com parâmetros de consulta
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (organizer) params.append("organizer", organizer);
    if (dateFrom) params.append("dateFrom", dateFrom);
    if (dateTo) params.append("dateTo", dateTo);
    
    const url = `${API_URL}/search?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao pesquisar reuniões:", error);
    return [];
  }
};

// Função para obter estatísticas
export const getStatistics = async () => {
  try {
    const response = await fetch(`${API_URL}/statistics`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return {
      total: 0,
      thisWeek: 0,
      thisMonth: 0
    };
  }
};

// Função para receber novos dados do webhook
export const receiveWebhookData = async (data: Omit<Meeting, "id">): Promise<Meeting | null> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao processar dados do webhook: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro ao processar dados do webhook:", error);
    return null;
  }
};
