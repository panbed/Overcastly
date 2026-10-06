"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import axios from "axios"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { SearchIcon } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"

// NOTE: all references to "zip" in this file dont actually mean zip and are instead just general search queries :-)

const zipSchema = z.object({
  zip: z
    .string()
    .min(1, { message: "Enter a search query!" } )
    .max(50, { message: "Your search query is too long!" } )
});

export default function LocationForm() {
  const queryClient = useQueryClient();

  const [tempLatitude, setTempLatitude] = useState(localStorage.getItem('latitude'));
  const [tempLongitude, setTempLongitude] = useState(localStorage.getItem('longitude'));
  const [tempLocationMetadata, setTempLocationMetadata] = useState(localStorage.getItem('locationMetadata'));

  const [locationResults, setLocationResults] = useState(null);


  const zipForm = useForm<z.infer<typeof zipSchema>>({
    resolver: zodResolver(zipSchema),
    defaultValues: {
      zip: "",
    }
  });

  const zipMutation = useMutation({
    mutationFn: (zipCodeInput) => {
      return axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: zipCodeInput.zip,
          countrycodes: "us",
          format: "json",
        }
      });
    },
    onSuccess: (coordinates) => {
      console.log(coordinates.data);
      setLocationResults(coordinates.data);
    },
    onError: (error) => {
      toast.warning("Unable to get coordinates from the zip code: " + error);
    }
  });

  function onOptionChange(coordinates: string) {
    const location = JSON.parse(coordinates);

    const lat = parseFloat(location.lat).toFixed(3);
    const lon = parseFloat(location.lon).toFixed(3);

    localStorage.setItem('latitude', lat);
    localStorage.setItem('longitude', lon);
    localStorage.setItem('locationMetadata', coordinates);

    console.log("Set coordinates:")
    console.log(lat);
    console.log(lon);


    setTimeout(function () {
      window.location.reload();
    }, 500)
  }

  function onZipSubmit(values: z.infer<typeof zipSchema>) {
    console.log(values);
    zipMutation.mutate(values);
  }

  return (
    <>
      <Form {...zipForm}>
        <form onSubmit={zipForm.handleSubmit(onZipSubmit)} className="flex gap-3 mt-3 mb-3">
          <FormField
            control={zipForm.control}
            name="zip"
            render={({ field }) => (
              <FormItem className="flex flex-1">
                <FormControl>
                  <Input placeholder="Search for a location..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit">
              <SearchIcon />
            </Button>
          </div>
        </form>
      </Form>

      <ScrollArea className="h-[calc(100vh-8rem)] w-full">
        {locationResults ?
          <RadioGroup onValueChange={(coordinates) => onOptionChange(coordinates)} className="flex flex-col gap-4">
            {locationResults.map((location: any) =>
              <div key={location.place_id} className="flex gap-4">
                <RadioGroupItem id={location.place_id} value={JSON.stringify(location)} className="align-middle" />
                <Label htmlFor={location.place_id} className="flex flex-col gap-1">
                  <p>{location.name}</p>
                  <p className="text-sm text-muted-foreground">{location.display_name}</p>
                </Label>
              </div>
            )}
          </RadioGroup>
          : <p className="text-sm text-muted-foreground">
            You can search and set your location here. <em>Note:</em> Selecting an option will refresh the page.
          </p>}
      </ScrollArea>
    </>
  );

}