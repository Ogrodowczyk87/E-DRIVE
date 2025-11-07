import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
      </main>
   
    </div>
  )
}
