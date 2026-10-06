import Map from 'ol/Map';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS';
import View from 'ol/View.js';
import { OSM, TileArcGISRest, Vector } from 'ol/source';
import { useEffect } from 'react';
import { useState } from 'react';

import 'ol/ol.css'
import { Switch } from "@/components/ui/switch";
import MapControls from './MapControls';
import Circle from 'ol/geom/Circle.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style.js';
import axios from 'axios';
import { useQuery } from 'react-query';
import VectorSource from 'ol/source/Vector';
import { useNavigate } from 'react-router-dom';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Calendar1Icon } from 'lucide-react';
import { dateFromObjectId } from '@/lib/utils';

export default function MapView({ className }: any) {
  const [toggleStates, setToggleStates] = useState({ radar: true, cyclones: true, warnings: true, goes: false, pins: true });
  const navigate = useNavigate();

  const handleToggle = (key) => {
    console.log(`Toggling ${key}`); // <-- This should log on every toggle
    setToggleStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  useEffect(() => {
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: `${import.meta.env.VITE_BACKEND_URL}/api/getpins`
      }),
      style: new Style({
        image: new Icon({ 
          anchor: [0.5, 1],
          src: "/pin.svg",
          width: 25,
        })
      }),
      visible: toggleStates.pins,
    });

    const map: Map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new TileWMS({
            url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes_east.cgi?',
            params: {'LAYERS': 'fulldisk_ch13', 'TILED': true},
            serverType: 'geoserver',
            // Countries have transparency, so do not fade tiles:
            transition: 0,
          }),
          opacity: 0.5,
          visible: toggleStates.goes,
        }),
        new TileLayer({
          source: new TileArcGISRest({
            url: "https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer",
          }),
          visible: toggleStates.cyclones,
          opacity: 0.25,
        }),
        new TileLayer({
          source: new TileArcGISRest({
            url: "https://mapservices.weather.noaa.gov/eventdriven/rest/services/WWA/watch_warn_adv/MapServer",
          }),
          visible: toggleStates.warnings,
          opacity: 0.5,
        }),
        new TileLayer({
          source: new TileArcGISRest({
            url: 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity/MapServer',
          }),
          visible: toggleStates.radar,
        }),
        vectorLayer,
      ],
      target: "map",
      view: new View({
        center: [-11097148, 4509099],
        zoom: 5,
        extent: [-16097148, 509099, -1097148, 7569099],
      }),
    });

    const info = document.getElementById("info");
    const infoTitle = document.getElementById("info-title")
    const infoBody = document.getElementById("info-body")
    const infoDate = document.getElementById("info-date")
    let currentFeature;
    const displayFeatureInfo = function (pixel, target) {
      const feature = target.closest('.ol-control')
        ? undefined
        : map.forEachFeatureAtPixel(pixel, function (feature) {
            return feature;
          });
      if (feature) {
        document.body.style.cursor = "pointer";
        info.style.left = pixel[0] + 'px';
        info.style.top = pixel[1] + 'px';
        if (feature !== currentFeature) {
          info.style.visibility = 'visible';
          infoBody.innerText = feature.get('body');
          const id = feature.get('id');
          const dateString = `${dateFromObjectId(id).toLocaleTimeString()} · ${dateFromObjectId(id).toDateString()} `;
          infoDate.innerText = dateString;
          infoTitle.innerText = feature.get('title');
        }
      } else {
        info.style.visibility = 'hidden';
        document.body.style.cursor = "default";
      }
      currentFeature = feature;
    };

    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        info.style.visibility = 'hidden';
        currentFeature = undefined;
        document.body.style.cursor = "default";
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel, evt.originalEvent.target);
    });

    map.on('click', function (evt) {
      displayFeatureInfo(evt.pixel, evt.originalEvent.target);
      console.log("clicked on thing");
      document.body.style.cursor = "default";
      if (currentFeature) {
        navigate(`/posts/${currentFeature.values_.id}`);
      }
    });
    

    map.getTargetElement().addEventListener('pointerleave', function () {
      currentFeature = undefined;
      info.style.visibility = 'hidden';
      document.body.style.cursor = "default";
    });

    return () => map.dispose();
  }, [toggleStates, navigate]);

  return (
    <div>
      <MapControls toggleStates={toggleStates} setToggleStates={setToggleStates} />
      <div id="map" className={className}>
        <HoverCard open={true}>
          <HoverCardContent className="absolute z-50 left-1/2 translate-x-1/4 inline-block invisible" id="info">
            <div className="space-y-1">
              <h4 className='text-sm font-semibold' id="info-title">Title</h4>
              <p className="text-sm" id="info-body">Body</p>
              <div className="flex items-center pt-2">
                <Calendar1Icon className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground" id="info-date">
                  Joined Date
                </span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )
}