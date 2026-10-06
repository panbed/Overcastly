import { Routes, Route, BrowserRouter, Navigate, Outlet} from 'react-router-dom';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from 'react';

import './App.css';

import Dashboard from './components/Dashboard'
// import OverviewPage from './pages/OverviewPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import SocialPage from './pages/SocialPage';
import { useEffect } from 'react';
import PostPage from './pages/PostPage';

const queryClient = new QueryClient();
import OverviewPage from './pages/OverviewPage';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'sonner';
import SettingsPage from './pages/SettingsPage';
import PageNotFound from './components/PageNotFound';

function App() {
  useEffect(() => {
    const userLatitude = localStorage.getItem('latitude');
    const userLongitude = localStorage.getItem('longitude')
    const locationMetadata = localStorage.getItem('locationMetadata');
    const distance = localStorage.getItem('distance');

    if (!userLatitude) localStorage.setItem('latitude', '28.567');
    if (!userLongitude) localStorage.setItem('longitude', '-81.208');
    if (!locationMetadata) localStorage.setItem('locationMetadata', '{"place_id":279873444,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"node","osm_id":154012096,"lat":"28.5667957","lon":"-81.2076407","class":"place","type":"village","place_rank":19,"importance":0.3935662231745403,"addresstype":"village","name":"Alafaya","display_name":"Alafaya, Orange County, Florida, 32826, United States","boundingbox":["28.5467957","28.5867957","-81.2276407","-81.1876407"]}');
    if (!distance) localStorage.setItem('distance', "1.6875")
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route index element={<OverviewPage />} />
            <Route path='map' element={<MapPage />} />
            <Route path='posts' element={<SocialPage />} />
            <Route path='posts/:id' element={<PostPage />} />
            <Route path='settings' element={<SettingsPage />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
          <Route path='login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
