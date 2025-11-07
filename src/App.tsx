import React from 'react'
// import Hero from './components/Hero'
import { Navbar } from './components/common/Navbar'


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* <Hero /> */}
        <h2 className="text-2xl font-bold text-center mt-10">Welcome to E-Drive</h2>
        <p className="text-center mt-4">Your one-stop solution for all your file storage needs.</p>
      </main>
   
    </div>
  )
}
