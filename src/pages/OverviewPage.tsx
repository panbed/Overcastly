import LatestPosts from "@/components/LatestPosts";
import MapOverview from "@/components/MapOverview";
import MapView from "@/components/MapView";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import WeatherConditions from "@/components/WeatherConditions";
import WeatherWarnings from "@/components/WeatherWarnings";


export default function OverviewPage() {
  return (
    <>
      <div className="grid columns-1 justify-center items-center h-[calc(100vh-4rem-3rem)] 2xl:flex p-10 gap-5">
        {/* <div className="invisible md:visible flex flex-col gap-3 max-w-xs md:max-w-md">
          <MapOverview className="lg:w-96 md:h-[50vh] rounded-md" />
        </div> */}
        <div className="flex flex-col gap-3 max-w-xs md:max-w-md">
          <LatestPosts />
        </div>
        <div className="flex flex-col gap-3 max-w-xs md:max-w-md">
          <WeatherConditions />
          <WeatherWarnings />
        </div>
     </div>
    </>
  );
}