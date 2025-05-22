
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  onSearch: (query: string, organizer: string, dateFrom: string, dateTo: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const handleSearch = () => {
    onSearch(
      query,
      organizer,
      dateFrom ? format(dateFrom, "yyyy-MM-dd") : "",
      dateTo ? format(dateTo, "yyyy-MM-dd") : ""
    );
  };

  const handleReset = () => {
    setQuery("");
    setOrganizer("");
    setDateFrom(undefined);
    setDateTo(undefined);
    onSearch("", "", "", "");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search in summary or transcript..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Filter by organizer email..."
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : <span>From date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : <span>To date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2 justify-end sm:ml-auto">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
