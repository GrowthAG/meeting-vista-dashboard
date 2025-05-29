
import React, { useEffect, useState } from "react";
import { Meeting } from "@/types/meeting";
import { fetchMeetings, getStatistics, searchMeetings } from "@/lib/meeting-service";
import SearchFilters from "@/components/dashboard/SearchFilters";
import MeetingsList from "@/components/dashboard/MeetingsList";
import StatsCards from "@/components/dashboard/StatsCards";
import { toast } from "sonner";

const Index = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, thisMonth: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se já está logado
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const fetchedMeetings = await fetchMeetings();
      // Sort by date descending (most recent first)
      fetchedMeetings.sort((a, b) => 
        new Date(b.data_reuniao).getTime() - new Date(a.data_reuniao).getTime()
      );
      setMeetings(fetchedMeetings);
      
      const meetingStats = await getStatistics();
      setStats(meetingStats);
    } catch (error) {
      console.error("Erro ao carregar reuniões:", error);
      toast.error("Falha ao carregar reuniões. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      
      // Adiciona um intervalo para atualização automática a cada 30 segundos
      const intervalId = setInterval(loadData, 30000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  const handleSearch = async (query: string, organizer: string, dateFrom: string, dateTo: string) => {
    try {
      setLoading(true);
      const results = await searchMeetings(query, organizer, dateFrom, dateTo);
      results.sort((a, b) => 
        new Date(b.data_reuniao).getTime() - new Date(a.data_reuniao).getTime()
      );
      setMeetings(results);
    } catch (error) {
      console.error("Erro na busca:", error);
      toast.error("Falha na busca. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    toast.success("Logout realizado com sucesso!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Acesso ao Painel de Reuniões
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Faça login para visualizar as reuniões
            </p>
          </div>
          <LoginForm onLogin={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Reuniões</h1>
          <p className="text-muted-foreground">
            Visualize e analise seus dados de reuniões
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {loading ? "Carregando reuniões..." : `${meetings.length} reuniões encontradas`}
        </h2>
      </div>

      <MeetingsList meetings={meetings} loading={loading} />
    </div>
  );
};

// Componente de Login
const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verificar credenciais
    if (username === "revhackers" && password === "SenhaHostinger@321#") {
      localStorage.setItem('isAuthenticated', 'true');
      toast.success("Login realizado com sucesso!");
      onLogin();
    } else {
      toast.error("Credenciais inválidas!");
    }
    
    setLoading(false);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="username" className="sr-only">
            Usuário
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </form>
  );
};

export default Index;
