import React from 'react'
import { Navbar } from './components/common/Navbar'
import { GoogleLoginButton } from './components/auth/GoogleLoginButton'
import { useGoogleAuth } from './hooks/useGoogleAuth'

export default function App() {
  const { user } = useGoogleAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
      {user ? ( 
        <div>
          <h2 className="text-2xl font-bold text-center mt-10">Welcome {user?.name}</h2>
          <p className="text-center mt-4">Your one-stop solution for all your file storage needs.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className='text-lg text-gray-500'>Please log in to access your files.</p>
          <GoogleLoginButton />
        </div>
      )}
      </main>  
    </div>
  )
}
