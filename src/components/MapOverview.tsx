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

  useEffect(() => {
    const map: Map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new TileArcGISRest({
            url: "https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer",
          }),
          opacity: 0.25,
        }),
        new TileLayer({
          source: new TileArcGISRest({
            url: "https://mapservices.weather.noaa.gov/eventdriven/rest/services/WWA/watch_warn_adv/MapServer",
          }),
          opacity: 0.5,
        }),
        new TileLayer({
          source: new TileArcGISRest({
            url: 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity/MapServer',
          }),
        }),
      ],
      target: "map",
      view: new View({
        center: [-11097148, 4509099],
        zoom: 5,
        extent: [-16097148, 509099, -1097148, 7569099],
      }),
    });

    return () => map.dispose();
  }, []);

  return (
    <div className='border p-2 rounded-md'>
      <div id="map" className={className} />
    </div>
  )
}