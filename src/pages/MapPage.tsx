import MapView from "@/components/MapView";

export default function MapPage() {
  return (
    <div className="w-full min-w-full">
      {/* 4rem is TopBar, 3rem is MapControls */}
      <MapView className="h-[calc(100vh-4rem-3rem)]"/>
    </div>
  )
}