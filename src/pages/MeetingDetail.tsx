
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Meeting } from "@/types/meeting";
import { fetchMeetingById } from "@/lib/meeting-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const MeetingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeeting = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const fetchedMeeting = await fetchMeetingById(id);
        if (fetchedMeeting) {
          setMeeting(fetchedMeeting);
        } else {
          navigate("/"); // Redirect if meeting not found
        }
      } catch (error) {
        console.error("Erro ao carregar reunião:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-100 rounded w-1/4"></div>
          <div className="h-6 bg-gray-100 rounded w-1/2"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Reunião não encontrada</h1>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Painel
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Painel
      </Button>

      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Detalhes da Reunião
          </h1>
          <p className="text-muted-foreground">
            {formatDate(meeting.data_reuniao)} • {meeting.horario_reuniao}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Organizador</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{meeting.organizador}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gravação</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                onClick={() => window.open(meeting.link_gravacao, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Abrir Gravação
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Participantes ({meeting.convidados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {meeting.convidados.map((participant, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded-md">
                  {participant}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{meeting.resumo}</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Transcrição</CardTitle>
          </CardHeader>
          <Separator />
          <ScrollArea className="h-[300px] p-6">
            <p className="whitespace-pre-line">{meeting.transcricao}</p>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default MeetingDetail;
