import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { pathName } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData["token"];
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${token}`,
      }
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/authenticate`, {
        headers: headers,
      });

      setIsAuthenticated(response.status == 200);
    }
    catch (e) {
      console.log(e);
      setIsAuthenticated(false);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, [pathName]);

  if (isLoading) {
    return <></>
  }

  return isAuthenticated ? children || <Outlet /> : <Navigate to={"/login"} />;

}