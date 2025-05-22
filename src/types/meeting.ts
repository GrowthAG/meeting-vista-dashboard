
export interface Meeting {
  id: string;
  organizador: string;
  convidados: string[];
  data_reuniao: string;
  horario_reuniao: string;
  link_gravacao: string;
  transcricao: string;
  resumo: string;
}
