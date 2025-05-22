
import { Meeting } from "@/types/meeting";
import { mockMeetings } from "./mock-data";

// In a real app, this would connect to your webhook endpoint or database
export const fetchMeetings = async (): Promise<Meeting[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockMeetings;
};

export const fetchMeetingById = async (id: string): Promise<Meeting | undefined> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockMeetings.find((meeting) => meeting.id === id);
};

export const searchMeetings = async (
  query: string,
  organizer: string,
  dateFrom: string,
  dateTo: string
): Promise<Meeting[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return mockMeetings.filter((meeting) => {
    const matchesQuery =
      !query ||
      meeting.resumo.toLowerCase().includes(query.toLowerCase()) ||
      meeting.transcricao.toLowerCase().includes(query.toLowerCase());
      
    const matchesOrganizer = !organizer || meeting.organizador === organizer;
    
    const meetingDate = new Date(meeting.data_reuniao);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    
    const matchesDateFrom = !fromDate || meetingDate >= fromDate;
    const matchesDateTo = !toDate || meetingDate <= toDate;
    
    return matchesQuery && matchesOrganizer && matchesDateFrom && matchesDateTo;
  });
};

export const getStatistics = async () => {
  const allMeetings = await fetchMeetings();
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const meetingsThisWeek = allMeetings.filter(
    (meeting) => new Date(meeting.data_reuniao) >= startOfWeek
  );
  
  const meetingsThisMonth = allMeetings.filter(
    (meeting) => new Date(meeting.data_reuniao) >= startOfMonth
  );
  
  return {
    total: allMeetings.length,
    thisWeek: meetingsThisWeek.length,
    thisMonth: meetingsThisMonth.length,
  };
};
