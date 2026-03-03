'use client';
import { useState, useEffect } from 'react';

export default function DashboardElite() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gestao/estatisticas')
      .then(res => res.json())
      .then(d => { setDados(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-[10px]">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-400 font-sans p-8 overflow-hidden relative">
      
      {/* Aura de fundo para o efeito Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <main className="max-w-[1500px] mx-auto relative z-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">Visão Geral</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[5px]">Admin • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl p-2 pr-6 border border-white/5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">AC</div>
            <span className="text-xs font-black text-white uppercase tracking-wider">Arthur César</span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Cards de KPI */}
          {dados?.kpis?.map((kpi, i) => (
            <div key={i} className="col-span-3 bg-[#0f172a]/40 backdrop-blur-md border border-white/5 p-8 rounded-[35px] hover:border-blue-500/30 transition-all group">
              <div className="flex justify-between mb-6">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</span>
                <span className={`text-[10px] font-bold text-${kpi.color}-400 bg-${kpi.color}-500/5 px-2 py-1 rounded-md`}>{kpi.grow}</span>
              </div>
              <h3 className="text-4xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">{kpi.val}</h3>
            </div>
          ))}

          {/* Gráfico de Performance Semanal */}
          <section className="col-span-8 bg-[#0f172a]/20 border border-white/5 p-10 rounded-[45px] backdrop-blur-sm">
            <h3 className="text-xs font-black text-white uppercase tracking-[4px] mb-12">Performance de Inscrições</h3>
            <div className="h-64 flex items-end gap-6 px-4">
              {dados?.grafico?.map((g, i) => (
                <div key={i} className="flex-1 group relative flex flex-col justify-end">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600/5 via-blue-600/20 to-blue-500 rounded-2xl transition-all duration-700 group-hover:to-white shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    style={{ height: `${(g.qtd / (Math.max(...dados.grafico.map(x => x.qtd)) || 1)) * 100}%` }}
                  />
                  <span className="text-[10px] font-black text-slate-600 uppercase mt-4 text-center group-hover:text-white transition-colors">{g.dia}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Card Lateral e Status */}
          <div className="col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[45px] group hover:bg-blue-600 transition-all duration-500 shadow-2xl cursor-pointer active:scale-95">
              <span className="text-3xl block mb-4 transform group-hover:rotate-12 transition-transform">✨</span>
              <h4 className="text-xl font-black text-slate-900 group-hover:text-white uppercase tracking-tighter">Novo Evento</h4>
              <p className="text-[10px] font-bold text-slate-500 group-hover:text-blue-100 uppercase tracking-widest mt-1">Iniciar Workflow →</p>
            </div>

            <div className="bg-[#0f172a]/60 border border-white/5 p-10 rounded-[45px] backdrop-blur-2xl">
               <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[4px] mb-8 text-center italic">Status do Banco</h3>
               <div className="flex flex-col items-center gap-6">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg font-black text-white">75%</span>
                  </div>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-[2px]">Sincronizado</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}