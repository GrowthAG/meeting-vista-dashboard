
import React from "react";
import MeetingCard from "./MeetingCard";
import { Meeting } from "@/types/meeting";

interface MeetingsListProps {
  meetings: Meeting[];
  loading: boolean;
}

const MeetingsList: React.FC<MeetingsListProps> = ({ meetings, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 bg-gray-100 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">Nenhuma reunião encontrada</h3>
        <p className="text-sm text-gray-400">Tente mudar seus filtros de busca</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
};

export default MeetingsList;
