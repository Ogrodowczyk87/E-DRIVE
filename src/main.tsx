import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "react-hot-toast";
import { GoogleAuthProvider } from './hooks/useGoogleAuth'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Konfiguracja React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleAuthProvider>
        <App />
        <Toaster />
      </GoogleAuthProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
)
