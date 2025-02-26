"use client";

import {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {CalendarIcon, ChevronsUpDown} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {cn} from "@/lib/utils";
import {toast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";


import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {WorldCountries} from "@/data/world-countries"
import {InsertTrip, SelectTrip} from "@/db/schema";
import {optimisticallyUpdateTripState} from "@/app/(dashboard)/travel-history/lib/utils";
import {tripCountryIsNotTheSameAsPreviousOrFollowingTrip} from "@/lib/validation";
import { DateUtils } from "@/lib/date-utils";

const EARLIEST_DATE = new Date("2015-01-01")



type CountryOption = {
  key: string;
  name: string;
}

export function TravelHistoryForm({userId, travelHistory, setTravelHistory}: { userId: number, travelHistory: SelectTrip[], setTravelHistory: React.Dispatch<React.SetStateAction<SelectTrip[]>> }) {

  const FormSchema = z
    .object({
      country: z
        .string()
        .min(1, "Please select a country."),
      arrivalDate: z
        .date({
          required_error: "Arrival date is required.",
          invalid_type_error: "Invalid date format.",
        })
        .refine((date) => date >= EARLIEST_DATE, {
          message: "Arrival date cannot be before 2015.",
        })
        .refine((date) => date <= new Date(), {
          message: "Arrival date cannot be in the future.",
        })
        .refine(
          (date) => !travelHistory.some((trip) => trip.arrivalDate === DateUtils.formatDateAsYMD(date)),
          {
            message: "Arrival date has already been used in travel history.",
          }
        )
      ,
      departureDate: z
        .date({
          required_error: "Departure date is required.",
          invalid_type_error: "Invalid date format.",
        })
        .optional(),
    })
    .refine((data) => !data.departureDate || data.departureDate > data.arrivalDate, {
      message: "Departure date must be after arrival date.",
      path: ["departureDate"],
    })
    .refine((data) => tripCountryIsNotTheSameAsPreviousOrFollowingTrip(data, travelHistory), {
      message: "Adjacent trips cannot be to the same country",
      path: ["country"],
    })
  ;
  // someone cant have the same country as the adjacent arrivalDate
  // Transform country data on mount
  useEffect(() => {
    const options = Object.entries(WorldCountries).map(([key, country]) => ({
      key,
      name: country.name
    }));
    setCountryOptions(options);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    console.log(`Form submitted: ${data.country}, ${data.arrivalDate}, ${DateUtils.formatDateAsYMD(data.arrivalDate)}`);
    if (!data.country || !data.arrivalDate) {
      console.log("Invalid arguments");
      return;
    }
    const newTrip: InsertTrip = {
      userId: userId,
      country: data.country,
      arrivalDate: DateUtils.formatDateAsYMD(data.arrivalDate),
      departureDate: null,
    }
    try {
      const response = await fetch(`/api/travel-history`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newTrip),
      });
      if (!response.ok) {
        throw new Error(`Error updating travel-history: ${response.statusText}`);
      }
      optimisticallyUpdateTripState(newTrip, setTravelHistory)
      toast({
        title: "Success!",
        description: "Your travel history has been updated successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error(`Failed to update travel-history:`, error);
      toast({
        title: "Error",
        description: "Failed to update your travel history. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isArrivalDateOpen, setIsArrivalDateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Trip</Button>
        </DialogTrigger>
        <DialogContent className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="country"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Country</FormLabel>
                    <Popover open={isCountriesOpen} onOpenChange={setIsCountriesOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isCountriesOpen}
                            className={cn(
                              "w-[200px] justify-between cursor-pointer",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? WorldCountries[field.value as keyof typeof WorldCountries].name
                              : "Select country"}
                            <ChevronsUpDown className="opacity-50"/>
                          </Button>
                        </FormControl>
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
                                    form.setValue("country", country.key);
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
                    </Popover>
                    <FormDescription>
                      The country you arrived in.
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrivalDate"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Arrival Date</FormLabel>
                    <Popover open={isArrivalDateOpen} onOpenChange={setIsArrivalDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              DateUtils.formatDateAsUkReadableString(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          onDayClick={() => setIsArrivalDateOpen(false)}
                          mode="single"
                          fromDate={EARLIEST_DATE}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < EARLIEST_DATE
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date you arrived in the country.
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>


    </>
  );
}

export default TravelHistoryForm;