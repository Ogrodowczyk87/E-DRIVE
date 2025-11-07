import React from 'react'

const stats = [
  { label: 'Environments', value: '140+' },
  { label: 'Cost Reduction', value: '32%' },
  { label: 'Average Deployment Time', value: '9 days' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-[0.3em] mb-4">
          intelligent cloud management
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight">
          One console for your entire multi-cloud infrastructure
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
          CirroStack automates provisioning, monitors costs, and secures resources across AWS, Azure, and GCP in one
          place. Focus on your product while we handle the rest.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="#contact"
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-colors"
          >
            Try for free
          </a>
          <a
            href="#features"
            className="px-8 py-4 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:border-indigo-200 hover:text-indigo-600 transition-colors"
          >
            View platform
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white/80 backdrop-blur rounded-xl border border-slate-100 p-6 shadow-sm">
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm uppercase tracking-wide text-slate-500 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
