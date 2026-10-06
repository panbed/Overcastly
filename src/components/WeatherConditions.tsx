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
import { CloudIcon, CloudSunIcon, SunIcon, WindIcon } from "lucide-react";

export default function WeatherConditions() {
  const [lat, setLat] = useState(localStorage.getItem('latitude'));
  const [long, setLong] = useState(localStorage.getItem('longitude'));
  const [weatherData, setWeatherData] = useState<JSON | null>(null);
  const [forecastData, setForecastData] = useState(null);
  const [forecastHourlyData, setForecastHourlyData] = useState(null);

  useEffect(() => {
    // get weather and forecast data cached in localStorage
    try {
      const lsWeather = localStorage.getItem('weatherData');
      const lsForecast = localStorage.getItem('forecastData');
      const lsForecastHourly = localStorage.getItem('forecastHourlyData');
      setWeatherData(lsWeather ? JSON.parse(lsWeather) : null);
      setForecastData(lsForecast ? JSON.parse(lsForecast) : null);
      setForecastHourlyData(lsForecastHourly ? JSON.parse(lsForecastHourly) : null);
    }
    catch (e) {
      console.log("Invalid weather cached in localStorage... hopefully we'll make a query to fix that");
    }
  }, []);

  async function getWeather() {
    const response = await axios.get(`https://api.weather.gov/points/${lat},${long}`)
    return response;
  }

  async function getForecast() {
    const response = await axios.get(`${weatherData["properties"]["forecast"]}`);
    return response;
  }

  async function getForecastHourly() {
    const response = await axios.get(`${weatherData["properties"]["forecastHourly"]}`);
    return response;
  }

  const weatherQuery = useQuery({
    queryKey: ["weatherData"],
    queryFn: getWeather,
    onSuccess: (weather) => {
      localStorage.setItem("weatherData", JSON.stringify(weather.data));
      setWeatherData(weather.data);
    },
    staleTime: 600000,
  });

  const forecastQuery = useQuery({
    queryKey: ["forecastQuery"],
    queryFn: getForecast,
    onSuccess: (forecast) => {
      localStorage.setItem("forecastData", JSON.stringify(forecast.data));
      setForecastData(forecast.data);
    },
    enabled: Boolean(weatherQuery.data),
    staleTime: 600000,
  });

  const forecastHourlyQuery = useQuery({
    queryKey: ["forecastHourlyQuery"],
    queryFn: getForecastHourly,
    onSuccess: (forecast) => {
      localStorage.setItem("forecastHourlyData", JSON.stringify(forecast.data));
      setForecastHourlyData(forecast.data);
    },
    enabled: Boolean(weatherQuery.data),
    staleTime: 600000,
  });

  if (forecastQuery.isLoading) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Weather</CardTitle>
            <CardDescription>In your area!</CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center">
            <SunIcon className="animate-spin"/>
          </CardContent>

          <CardFooter>
            Please wait...
          </CardFooter>
        </Card>
      </div>
    );
  }
  else if (forecastQuery.error) {
    return (
      <div>
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
          <CardDescription>Something has gone wrong!</CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <p>Uh oh!</p>
        </CardContent>

        <CardFooter>
          Error loading weather data!
        </CardFooter>
      </Card>
    </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>
                {weatherData ?
                  weatherData["properties"]["relativeLocation"]["properties"]["city"] + ", "
                  + weatherData["properties"]["relativeLocation"]["properties"]["state"] : <></>
                }
              </CardTitle>
              <CardDescription>
                {forecastData ?
                  forecastData["properties"]["periods"][0]["name"] : <></>
                }
              </CardDescription>
            </div>

            <div>
              <img
                src={forecastHourlyData ? forecastHourlyData["properties"]["periods"][0]["icon"] : ""}
                width="48"
                className="rounded-lg"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="">
          <div className="flex justify-between gap-3">
            <div className="flex justify-between flex-1">
              <div className="flex flex-col justify-center text-center">
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="scroll-m-20 text-5xl font-bold tracking-tight">
                  {forecastHourlyData ?
                    forecastHourlyData["properties"]["periods"][0]["temperature"] + "°" + forecastHourlyData["properties"]["periods"][0]["temperatureUnit"] : <></>
                  }
                </p>
              </div>
              <div className="flex flex-col justify-center text-center">
                <p className="text-sm text-muted-foreground">Rain Chance</p>
                <p className="scroll-m-20 text-5xl tracking-tight">
                  {forecastHourlyData ?
                    forecastHourlyData["properties"]["periods"][0]["probabilityOfPrecipitation"]["value"] + "%" : <></>
                  }
                </p>
              </div>
              <div className="flex flex-col justify-center text-center">
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="scroll-m-20 text-5xl tracking-tight">
                  {forecastHourlyData ?
                    forecastHourlyData["properties"]["periods"][0]["relativeHumidity"]["value"] + "%" : <></>
                  }
                </p>
              </div>

            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm">{forecastData ? forecastData["properties"]["periods"][0]["detailedForecast"] : ""}</p>
        </CardFooter>
      </Card>
    </div>

  )
}