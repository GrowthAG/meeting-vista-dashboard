
import React, { useEffect, useState } from "react";
import { Meeting } from "@/types/meeting";
import { fetchMeetings, getStatistics, searchMeetings } from "@/lib/meeting-service";
import SearchFilters from "@/components/dashboard/SearchFilters";
import MeetingsList from "@/components/dashboard/MeetingsList";
import StatsCards from "@/components/dashboard/StatsCards";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DashboardContent = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, thisMonth: 0 });
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const fetchedMeetings = await fetchMeetings();
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
    if (user && isAdmin) {
      loadData();
      
      const intervalId = setInterval(loadData, 30000);
      return () => clearInterval(intervalId);
    }
  }, [user, isAdmin]);

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

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <LoginForm />;
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
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="mt-4 md:mt-0"
        >
          Logout
        </Button>
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

const Index = () => {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
};

export default Index;
