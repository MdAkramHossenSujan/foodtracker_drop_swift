import { StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router";
import { router } from './route/Routes.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import 'aos/dist/aos.css';
import Aos from 'aos';
import { Toaster } from 'react-hot-toast';
import {  QueryClient, QueryClientProvider } from '@tanstack/react-query';

  Aos.init({
    duration: 500,      // animation duration
    offset: 100,         // offset (in px) from the original trigger point
    easing: 'ease-in-out',
    once: true,          // animation only once on scroll
  });
  const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
    <AuthProvider>
       <RouterProvider router={router} />
       <Toaster/>
     </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
