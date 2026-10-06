import { useEffect, useState } from "react"
import axios from "axios";
import { useQuery } from "react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CloudIcon, CloudSunIcon, SunIcon, TriangleAlertIcon, WindIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export default function WeatherWarnings() {
  const lat = localStorage.getItem("latitude");
  const long = localStorage.getItem('longitude');
  const [warningData, setWarningData] = useState(null);

  useEffect(() => {
    // get weather and forecast data cached in localStorage
    try {
      const lsWarning = localStorage.getItem('warningData');
      setWarningData(lsWarning ? JSON.parse(lsWarning) : null);

    }
    catch (e) {
      console.log("No warnings found... we'll try to get them");
    }
  }, []);

  async function getWarnings() {
    const response = await axios.get(`https://api.weather.gov/alerts/active?point=${lat},${long}`)
    return response;
  }

  const warningQuery = useQuery({
    queryKey: ["warningData"],
    queryFn: getWarnings,
    onSuccess: (warnings) => {
      localStorage.setItem("warningData", JSON.stringify(warnings.data.features));
      setWarningData(warnings.data.features);
      console.log(warnings.data);
    },
    staleTime: 600000,
  });


  if (warningQuery.isLoading) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Watches and Warnings</CardTitle>
            <CardDescription>In your area!</CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center">
            <TriangleAlertIcon className="animate-spin" />
          </CardContent>

          <CardFooter>
            Please wait...
          </CardFooter>
        </Card>
      </div>
    );
  }
  else if (warningQuery.error) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Watches and Warnings</CardTitle>
            <CardDescription>Something has gone horribly wrong.</CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center">
            <TriangleAlertIcon className="" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Watches and Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {warningData && warningData.length > 0 ?
            <>
              <ScrollArea className="h-64 md:w-72 lg:w-96">
                <div className="flex flex-col gap-3">
                {warningData.map((warning) =>
                  <div className="flex flex-col border border-destructive rounded-md p-3 bg-destructive text-destructive-foreground gap-3">
                    <TriangleAlertIcon className="h-5 w-5" />
                    <p className="text-xs font-semibold">{warning.properties.headline}</p>
                    <p className="text-xs overflow-scroll whitespace-pre-line">{warning.properties.description}</p>
                  </div>
                )}
                </div>
              </ScrollArea>
            </> : <p>No warnings in your area. Hurray!</p>}
        </CardContent>
      </Card>
    </div>

  )
}