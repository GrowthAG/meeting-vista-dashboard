
import { Meeting } from "@/types/meeting";
import { v4 as uuidv4 } from "uuid";

export const mockMeetings: Meeting[] = [
  {
    id: uuidv4(),
    organizador: "maria.silva@empresa.com.br",
    convidados: ["joao.pereira@empresa.com.br", "ana.oliveira@empresa.com.br", "carlos.santos@empresa.com.br"],
    data_reuniao: "2025-05-20",
    horario_reuniao: "14:30",
    link_gravacao: "https://meeting-recordings.com/abc123",
    transcricao: "Maria: Boa tarde a todos. Vamos começar nossa reunião semanal de planejamento. João, você pode compartilhar as atualizações do seu time?\n\nJoão: Claro, Maria. Esta semana conseguimos finalizar a implementação do novo dashboard e estamos prontos para iniciar os testes com usuários.\n\nAna: Tenho algumas preocupações sobre o cronograma. Acho que precisamos de mais tempo para os testes antes de lançar para produção.\n\nCarlos: Concordo com a Ana. Sugiro adiarmos o lançamento em uma semana.",
    resumo: "Reunião de planejamento semanal onde o João apresentou o progresso da implementação do novo dashboard. Ana e Carlos sugeriram adiar o lançamento em uma semana para permitir mais tempo para testes com usuários. Ficou decidido que o time revisará o cronograma na próxima reunião."
  },
  {
    id: uuidv4(),
    organizador: "roberto.almeida@empresa.com.br",
    convidados: ["fernanda.costa@empresa.com.br", "lucas.martins@empresa.com.br", "patricia.ferreira@empresa.com.br"],
    data_reuniao: "2025-05-21",
    horario_reuniao: "10:00",
    link_gravacao: "https://meeting-recordings.com/def456",
    transcricao: "Roberto: Bom dia, pessoal. Hoje vamos discutir o feedback dos clientes sobre a última atualização do produto.\n\nFernanda: Os relatórios mostram que houve um aumento de 23% na satisfação dos usuários após as melhorias na interface.\n\nLucas: Isso é ótimo, mas ainda temos algumas reclamações sobre o tempo de carregamento das páginas.\n\nPatrícia: Já identifiquei os gargalos e estou trabalhando em otimizações que devem reduzir o tempo de carregamento em até 40%.",
    resumo: "O time analisou o feedback dos clientes após a última atualização do produto. Fernanda apresentou dados que mostram um aumento de 23% na satisfação dos usuários. Lucas mencionou reclamações sobre o tempo de carregamento, e Patrícia está trabalhando em otimizações para melhorar o desempenho em até 40%."
  },
  {
    id: uuidv4(),
    organizador: "eduardo.gomes@empresa.com.br",
    convidados: ["julia.lima@empresa.com.br", "rafael.costa@empresa.com.br", "camila.rodrigues@empresa.com.br", "bruno.alves@empresa.com.br"],
    data_reuniao: "2025-05-22",
    horario_reuniao: "09:15",
    link_gravacao: "https://meeting-recordings.com/ghi789",
    transcricao: "Eduardo: Vamos revisar o orçamento para o próximo trimestre.\n\nJúlia: De acordo com nossas projeções, precisaremos aumentar o investimento em marketing digital em 15%.\n\nRafael: Isso vai impactar nosso orçamento de desenvolvimento. Podemos realocar recursos?\n\nCamila: Sugiro reduzirmos os gastos com consultoria externa e focarmos em capacitar nossa equipe interna.\n\nBruno: Concordo. Também podemos adiar algumas aquisições de hardware para o trimestre seguinte.",
    resumo: "Reunião de revisão de orçamento para o próximo trimestre. Júlia propôs um aumento de 15% no investimento em marketing digital. Para compensar, Camila sugeriu reduzir gastos com consultoria externa e Bruno recomendou adiar aquisições de hardware. O time concordou em realocar recursos para priorizar o marketing sem impactar significativamente o orçamento de desenvolvimento."
  }
];

