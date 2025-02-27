"use client";

import { useEffect, useState, useMemo } from "react";
import {  SelectTrip } from "@/db/schema";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, XIcon } from "lucide-react";
import { CountryOption, DaysSpentTravellingForPeriods, EnrichedTrip, WorldCountryKey } from "@/types/travel";
import { TravelHistoryService } from "@/services/TravelHistoryService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { WorldCountries } from "@/data/world-countries";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DateUtils } from "@/lib/date-utils";
import DaysSpentTravellingOverview from "@/app/(dashboard)/travel-history/DaysSpentTravellingOverview";


export function TravelHistoryList({ travelHistory, setTravelHistory }: { travelHistory: SelectTrip[], setTravelHistory: React.Dispatch<React.SetStateAction<SelectTrip[]>> }) {
  const travelHistoryService = new TravelHistoryService();

  if (!travelHistory) {
    return null
  }

  async function handleDelete(arrivalDate: string) {
    setIsLoading(true)
    if (arrivalDate == null) {
      console.error("Invalid arrivalDate");
      return;
    }
    try {
      const response = await fetch(`/api/travel-history`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrivalDate }),
      });
      if (!response.ok) {
        throw new Error(`Error updating travel-history: ${response.statusText}`);
      }
      setTravelHistory((previousTrips: SelectTrip[]) => {
        return previousTrips.filter(trip => trip.arrivalDate !== arrivalDate);
      });
      toast({
        title: "Success!",
        description: "Trip removed.",
      });
    } catch (error) {
      console.error(`Failed to update travel-history:`, error);
      toast({
        title: "Error",
        description: "Damn we couldnt delete that one... try again maybe?",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }


  const [enrichedTravelHistory, setEnrichedTravelHistory] = useState<EnrichedTrip[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ key: WorldCountryKey; name: string }[]>([]);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [homeCountry, setHomeCountry] = useState<CountryOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const options = Object.entries(WorldCountries).map(([key, country]) => ({
      key: key as WorldCountryKey,
      name: country.name
    }));
    setCountryOptions(options);
  }, []);

  useEffect(() => {
    setEnrichedTravelHistory(travelHistoryService.enrichTripsWithCountryAndDurationData(travelHistory));
  }, [travelHistory]);


  const daysSpentTravelling: DaysSpentTravellingForPeriods = useMemo(() => {
    if (!enrichedTravelHistory) return null;
    const today = DateUtils.getFloorOfDate(new Date)
    const tripsCutoffAt12Months = travelHistoryService.cutoffTripsAtGivenPeriod(today, { months: 12 }, enrichedTravelHistory);
    const tripsCutoffAt180Days = travelHistoryService.cutoffTripsAtGivenPeriod(today, { days: 180 }, enrichedTravelHistory);

    const twelveMonthsAgoInDays = DateUtils.calculateAbsoluteDateDifferenceInDays(today, DateUtils.addYearsToDate(today, -1));
    const travelHistoryForPastTwelveMonths = travelHistoryService.calculateDaysSpentTravelling(twelveMonthsAgoInDays-1, tripsCutoffAt12Months, homeCountry?.key);
    const travelHistoryForPast180Days = travelHistoryService.calculateDaysSpentTravelling(180, tripsCutoffAt180Days, homeCountry?.key);
    return {
      travelHistoryForPastTwelveMonths,
      travelHistoryForPast180Days
    }
  }, [enrichedTravelHistory, homeCountry?.key]);

  if (daysSpentTravelling == null) return null;
  return (
    <div className="flex flex-col">
      <Popover open={isCountriesOpen} onOpenChange={setIsCountriesOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isCountriesOpen}
            className={cn(
              "w-[200px] justify-between cursor-pointer",
              !homeCountry && "text-muted-foreground"
            )}
          >
            {homeCountry
              ? homeCountry.name
              : "Select home country"}
            <ChevronsUpDown className="opacity-50"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." className="h-9"/>
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryOptions.map((country) => (
                  <CommandItem
                    className='cursor-pointer'
                    value={country.name.toLowerCase()}
                    key={country.key}
                    onSelect={() => {
                      setHomeCountry({ key: country.key as WorldCountryKey, name: country.name })
                      setIsCountriesOpen(false);
                    }}
                  >
                    {country.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        <span className='text-sm text-muted-foreground p-1'>Your home country or a country you would like to compare against.</span>
        <span className='text-sm text-muted-foreground p-1 mb-5'>If your first trip is within the last 12 months we assume you were living here previously.</span>
      </Popover>
      <DaysSpentTravellingOverview daysSpentTravelling={daysSpentTravelling} homeCountry={homeCountry} />
      <div
        className="flex flex-col w-full mt-5  h-[500px] border-t-2 border-white py-5 no-scrollbar overflow-auto items-start space-y-2  pt-5">
        {
          enrichedTravelHistory.map((trip: EnrichedTrip, index) => {
            return (
              <div key={trip.arrivalDate} className="flex flex-row justify-between  w-full">
                <Dialog>
                  <div className=" rounded-md p-2  -h items-start flex flex-col min-w-[200px]">
                    <h3 className="flex justify-between w-full">
                      {trip.countryName} {index === 0 && <span className="text-green-500 text-xs ml-10">current</span>}
                    </h3>
                    <span className="text-sm ">Arrival date: {trip.arrivalDate} </span>
                    {/*<span className="text-sm ">Departure: {3} days</span>*/}
                    {trip.duration && <span className="text-sm ">Duration: {trip.duration} days </span>}
                  </div>
                  <DialogTrigger>
                    <XIcon className="hover:text-red-600"/>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete trip</DialogTitle>
                      <div className=" rounded-md p-2  -h items-start flex flex-col min-w-[200px]">
                        <h3>
                          {trip.country}
                        </h3>
                        <span className="text-sm ">Arrival date: {trip.arrivalDate} </span>
                        {/*<span className="text-sm ">Departure: {3} days</span>*/}
                        {/*<span className="text-sm ">Duration: {3} days </span>*/}
                      </div>
                    </DialogHeader>
                    <Button disabled={isLoading} onClick={() => handleDelete(trip.arrivalDate)}>Delete</Button>
                  </DialogContent>
                </Dialog>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default TravelHistoryList;
