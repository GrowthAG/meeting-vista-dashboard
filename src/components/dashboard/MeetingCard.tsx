
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Meeting } from "@/types/meeting";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="flex-1 p-6">
        <div className="flex justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            {formatDate(meeting.data_reuniao)} • {meeting.horario_reuniao}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mt-2 truncate">
          Organizer: {meeting.organizador}
        </h3>
        
        <div className="mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-sm text-muted-foreground">
                {meeting.convidados.length} participants
                {meeting.convidados.length > 0 && ": "}
                {meeting.convidados.slice(0, 2).join(", ")}
                {meeting.convidados.length > 2 && "..."}
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {meeting.convidados.join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mt-4 text-sm line-clamp-3">
          <span className="font-medium">Summary: </span>
          {meeting.resumo}
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
          <span className="font-medium">Transcript: </span>
          {meeting.transcricao}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4 pt-4">
        <Button asChild variant="outline" size="sm">
          <Link to={`/meeting/${meeting.id}`}>View Details</Link>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(meeting.link_gravacao, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Recording
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;
