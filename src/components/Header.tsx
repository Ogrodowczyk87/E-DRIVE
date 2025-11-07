import React from 'react'

const navLinks = [
  { href: '#services', label: 'Solutions' },
  { href: '#features', label: 'Platform' },
  { href: '#portfolio', label: 'Deployments' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-semibold tracking-tight text-slate-900">CirroStack</div>
        <nav className="space-x-6 hidden md:flex text-sm font-medium text-slate-600">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="hover:text-indigo-600 transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden md:inline-flex px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 transition-colors"
        >
          Book demo
        </a>
        <button className="md:hidden text-sm font-semibold text-slate-700" aria-label="Open menu">
          Menu
        </button>
      </div>
    </header>
  )
}
