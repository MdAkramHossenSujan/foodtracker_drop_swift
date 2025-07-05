import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000/`
});

const useSecureAxios = () => {
  const { logOut,user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request interceptor: refresh token and set Authorization header
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user) {
          // Force refresh the token to avoid expiry issues
          const token = await user.getIdToken(true);
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle 401/403 errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        if (status === 403) {
          navigate('/forbidden');
        } else if (status === 401) {
          try {
            await logOut();
          } catch (e) {
            console.error('Logout failed:', e);
          }
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount or when dependencies change
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate,user]);

  return axiosSecure;
};

export default useSecureAxios;
