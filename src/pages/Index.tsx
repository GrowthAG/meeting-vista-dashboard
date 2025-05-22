
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

  useEffect(() => {
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
        console.error("Error loading meetings:", error);
        toast.error("Failed to load meetings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = async (query: string, organizer: string, dateFrom: string, dateTo: string) => {
    try {
      setLoading(true);
      const results = await searchMeetings(query, organizer, dateFrom, dateTo);
      results.sort((a, b) => 
        new Date(b.data_reuniao).getTime() - new Date(a.data_reuniao).getTime()
      );
      setMeetings(results);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Meetings Dashboard</h1>
        <p className="text-muted-foreground">
          View and analyze your meeting data
        </p>
      </div>

      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {loading ? "Loading meetings..." : `${meetings.length} meetings found`}
        </h2>
      </div>

      <MeetingsList meetings={meetings} loading={loading} />
    </div>
  );
};

export default Index;
