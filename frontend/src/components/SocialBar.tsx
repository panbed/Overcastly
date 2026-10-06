import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { MapPinIcon, PlusIcon } from "lucide-react";
import { Slider } from "./ui/slider";
import { convertDegreesToMiles, convertMilesToDegrees } from "@/lib/utils";
import { SocialSearch } from "./SocialSearch";
import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";

// TODO

export default function SocialBar() {
  const queryClient = useQueryClient();
  const [lsDistance, setLsDistance] = useState(localStorage.getItem("distance"));

  function setDistance(e) {
    console.log(e[0])
    const distance = convertMilesToDegrees(e[0]);
    localStorage.setItem("distance", distance)
    queryClient.invalidateQueries(["postsData"]);
  }

  useEffect(() => {
    setLsDistance(convertDegreesToMiles(localStorage.getItem("distance")));
  }, [localStorage.getItem("distance")])

  return (
    <div className="flex flex-nowrap z-10 bg-background sticky top-[4rem] w-full ps-5 pe-5 pb-3 gap-3 items-center shadow-sm mx-auto">
      <div className="flex flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <SocialSearch />
        </div>

        <div className="flex items-center gap-2">
          <p className="hidden md:block text-xs">{lsDistance} mi</p>
          <Slider 
            defaultValue={[convertDegreesToMiles(localStorage.getItem("distance"))]}
            min={1}
            max={275}
            step={5}
            className="w-32"
            onValueCommit={setDistance}
          /> 
        </div>
      </div>
    </div>
  );
}