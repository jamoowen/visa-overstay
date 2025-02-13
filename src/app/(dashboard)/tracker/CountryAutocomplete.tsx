"use client";

import {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {CalendarIcon, ChevronsUpDown} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {format} from "date-fns"
import {enGB} from 'date-fns/locale/en-GB'
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
import {Input} from "@/components/ui/input";
import {Calendar} from "@/components/ui/calendar";

const EARLIEST_DATE = new Date("2015-01-01")

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


export function ComboboxForm() {
  const [countries, setCountries] = useState<string[]>([]);
  const [open, setOpen] = useState(false)

  const FormSchema = z
    .object({
      country: z
        .string()
        .min(1, "Please select a country.")
        .refine((value) => countries.includes(value), {
          message: "Selected country is not valid.",
        }),
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
        }),

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
    });

  // Fetch country list on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/data/world-countries.json");
        const data: { countries: string[] } = await response.json();
        // Convert to { label, value } format

        setCountries(data.countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(`Form submitted: ${data.country}, ${data.departureDate}, ${data.departureDate}`);
    toast({
      title: "You submitted the following country:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="country"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel>Country</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? countries.find((country) => country === field.value)
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
                          {countries.map((country) => (
                            <CommandItem
                              value={country}
                              key={country}
                              onSelect={() => {
                                form.setValue("country", country);
                                setOpen(false);
                              }}
                            >
                              {country}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the country that will be used in the dashboard.
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
                <Popover>
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
                        formatDate(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
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
          <FormField
            control={form.control}
            name="departureDate"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel>(Optional) Departure Date</FormLabel>
                <Popover>
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
                          formatDate(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
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
                  Leave blank if you have yet to leave the country.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}

export default ComboboxForm;
