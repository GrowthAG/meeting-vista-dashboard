
import { Meeting } from "@/types/meeting";

// Generate 20 mock meetings for development
export const mockMeetings: Meeting[] = Array.from({ length: 20 }, (_, i) => ({
  id: `meeting-${i + 1}`,
  organizador: `user${i + 1}@example.com`,
  convidados: [
    `participant1@example.com`,
    `participant2@example.com`,
    `participant3@example.com`,
    ...(i % 2 === 0 ? [`participant4@example.com`, `participant5@example.com`] : []),
    ...(i % 3 === 0 ? [`participant6@example.com`, `participant7@example.com`] : []),
  ],
  data_reuniao: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  horario_reuniao: `${Math.floor(Math.random() * 12) + 9}:${
    Math.floor(Math.random() * 60) < 10 ? "00" : Math.floor(Math.random() * 60)
  }`,
  link_gravacao: `https://example.com/recordings/meeting-${i + 1}`,
  transcricao:
    `This is a sample transcription for meeting ${i + 1}. It includes various discussions about project progress, ` +
    `upcoming deadlines, and team responsibilities. There were also conversations about resource allocation ` +
    `and marketing strategies for the upcoming quarter. The team discussed potential blockers and solutions.`,
  resumo:
    `Meeting summary ${i + 1}: The team reviewed project progress, identified key blockers, and assigned ` +
    `action items to team members. Next steps were defined with clear deadlines.`,
}));
