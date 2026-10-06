import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { SendHorizonalIcon, ImageIcon, RadarIcon, CloudAlertIcon, TornadoIcon, CloudAlert, EarthIcon } from "lucide-react";
import { QueryClient, useIsMutating, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { RefObject, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { toast } from "sonner"
import PostThreadAuthor from "./PostThreadAuthor";
import { convertToBase64, getUserData } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProfilePicture from "./ProfilePicture";
import { Label } from "./ui/label";
import { buttonVariants } from "@/components/ui/button"
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { HoverCardContent } from "./ui/hover-card";

// TODO

export default function MapControls({ toggleStates, setToggleStates }) {

  function getClass(toggleStates, layerName) {
    if (toggleStates[layerName] === false) {
      return "text-foreground/25"
    }
    return "text-foreground"
  }

  const handleToggle = (key) => {
    console.log(`Toggling ${key}`);
    setToggleStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <div className="flex h-12 flex-nowrap z-10 bg-background sticky top-0 w-full p-3 gap-3 items-center shadow-sm mx-auto">
      {/* radar toggle */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className={getClass(toggleStates, "radar")} onClick={() => handleToggle("radar")}>
            <RadarIcon/>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div>
            <h4 className="text-sm font-semibold">Radar</h4>
            <p className="text-sm">
            The Radar Base Reflectivity Map Service's data is provided by Mutil-Radar-Multi-Sensor (MRMS) algorithm. This map service is quality controlled at the 1km x 1km CONUS Radar Base Reflectivity. The map service provides weather radar information for all the composite Weather Service Doppler Radars (WSR 88D).
            </p>
            <span className="text-xs text-muted-foreground">Visit <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity/MapServer">the NOAA API page</a> for more information.</span>
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className={getClass(toggleStates, "cyclones")} onClick={() => handleToggle("cyclones")}>
            <TornadoIcon />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div>
            <h4 className="text-sm font-semibold">Tropical Cyclones</h4>
            <p className="text-sm">
            The National Hurricane Center and Central Pacific Center Tropical Weather Web Service is a web service that contains the tropical cyclone data for possible storms throughout the United States and its territories. This web service visually displays potential impact of tropical cyclones on coastal communities. The provided wind, probability of flooding, surge inundation layers, watch warnings and tidal masks offers critical information for emergency preparedness and response efforts. This includes helping residents, emergency managers, and policymakers understand the potential severity of coastal flooding and take appropriate precautions. 
            </p>
            <span className="text-xs text-muted-foreground">Visit <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer">the NOAA API page</a> for more information.</span>
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className={getClass(toggleStates, "warnings")} onClick={() => handleToggle("warnings")}>
            <CloudAlert />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div>
            <h4 className="text-sm font-semibold">Watches and Warnings</h4>
            <p className="text-sm">
            <p><strong>Watch</strong>: A watch is used when the risk of a hazardous weather or hydrologic event has increased significantly, but its occurrence, location, and/or timing is still uncertain. It is intended to provide enough lead time so that those who need to set their plans in motion can do so.</p>

            <p><strong>Warning</strong>: A warning is issued when a hazardous weather or hydrologic event is occurring, is imminent, or has a very high probability of occurring. A warning is used for conditions posing a threat to life or property.</p>

            <p><strong>Advisory</strong>: The expected weather condition has a pretty good chance of occurring, even a likely chance of occurring, but typically an advisory is used for less severe type of weather conditions. A Wind Advisory might be issued or a Freezing Rain Advisory issued instead of a High Wind Warning or an ice Storm Warning.</p>
            </p>
            <span className="text-xs text-muted-foreground">Visit <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://mapservices.weather.noaa.gov/eventdriven/rest/services/WWA/watch_warn_adv/MapServer">the NOAA API page</a> for more information.</span>
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className={getClass(toggleStates, "goes")} onClick={() => handleToggle("goes")}>
            <EarthIcon />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div>
            <h4 className="text-sm font-semibold">GOES East Imagery</h4>
            <p className="text-sm">
              From NOAA: <em>The Geostationary Operational Environmental Satellite (GOES) – R Series is the nation’s most advanced fleet of geostationary weather satellites. The GOES-R Series significantly improves the detection and observation of environmental phenomena that directly affect public safety, protection of property and our nation’s economic health and prosperity. </em>
            </p>
            <span className="text-xs text-muted-foreground">Visit <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://mesonet.agron.iastate.edu/ogc/">the Iowa Environmental Mesonet</a> for more information.</span>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}