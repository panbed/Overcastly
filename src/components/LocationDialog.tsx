import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { MapPinIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LocationForm from "./LocationForm";

export default function LocationDialog() {
  const [locationMetadata, setLocationMetadata] = useState(null);

  useEffect(() => {
    const metadata = localStorage.getItem('locationMetadata');
    if (metadata) {
      try {
        const parsedMetadata = JSON.parse(metadata);
        setLocationMetadata(parsedMetadata);
      }
      catch (error) {
        console.log("Unable to parse location metadata.");
      }
      
    }
  }, []);

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost">
          <MapPinIcon />
          {locationMetadata ? <p className="hidden md:block max-w-[32ch] truncate">{locationMetadata.name}</p> : <p>No location!</p>}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="gap-3">
          <SheetTitle>Set Location</SheetTitle>
        </SheetHeader>
        <LocationForm />
      </SheetContent>
    </Sheet>
  );
}