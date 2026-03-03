'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuPrincipal() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Erro ao carregar dados do Fedora Server");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const acoes = [
    { id: 1, titulo: 'Meus Eventos', icon: '📅', color: 'blue', route: '/meus-eventos' },
    { id: 2, titulo: 'Criar Evento', icon: '✨', color: 'emerald', route: '/criar-evento' },
    { id: 3, titulo: 'Validar Inscrições', icon: '🛡️', color: 'amber', route: '/validar' },
    { id: 4, titulo: 'Gerar Certificados', icon: '🎓', color: 'purple', route: '/gerar-certificado' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d17] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-300 font-sans">
      {/* Background Atmosférico */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 max-w-[1400px] mx-auto p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img className="w-12 h-12 rounded-2xl border-2 border-blue-500/20 p-0.5" src="https://i.pravatar.cc/150?u=arthur" alt="Avatar" />
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Olá, {data?.usuario || 'Organizador'}!</h1>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Painel de Controle</p>
          </div>
        </div>
        <button className="p-3 bg-[#111827]/50 border border-slate-800/50 rounded-2xl hover:bg-slate-800 transition-all relative">
          <span>🔔</span>
          {data?.estatisticas.inscricoesPendentes > 0 && (
            <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </button>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-8 pb-32">
        {/* Grid de Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {acoes.map((acao) => (
            <button
              key={acao.id}
              onClick={() => router.push(acao.route)}
              className="group p-8 rounded-[32px] border border-slate-800/50 backdrop-blur-xl bg-[#111827]/30 flex flex-col items-start transition-all hover:-translate-y-1 hover:border-blue-500/30 shadow-2xl shadow-black/40"
            >
              <span className="text-4xl mb-6 group-hover:scale-110 transition-transform">{acao.icon}</span>
              <h3 className="text-white font-bold text-lg">{acao.titulo}</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">Acessar Painel</p>
            </button>
          ))}
        </div>

        {/* Card de Relatórios Integrado */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-[32px] border border-white/5 p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">📊</div>
              <div>
                <h3 className="text-white font-bold text-xl">Relatórios Gerais</h3>
                <p className="text-sm text-slate-500">{data?.estatisticas.totalCertificados} certificados emitidos até agora.</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">Ver Detalhes</button>
          </div>
        </section>

        {/* Próximos Eventos do Backend */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Próximos Eventos</h2>
          </div>

          <div className="space-y-4">
            {data?.proximosEventos.map((evento) => (
              <div key={evento.id} className="group p-5 bg-[#111827]/40 border border-slate-800/50 rounded-3xl flex items-center gap-6 hover:bg-slate-800/30 transition-all cursor-pointer">
                <div className="bg-blue-600/10 border border-blue-500/20 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <span className="text-[10px] font-black">{evento.mes}</span>
                  <span className="text-2xl font-black">{evento.data}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{evento.titulo}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">📍 {evento.local} • <span className="text-emerald-500 font-bold">{evento.status}</span></p>
                </div>
                <span className="text-slate-700 group-hover:text-white transition-colors">→</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Nav */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[500px] px-8 z-50">
        <nav className="bg-[#111827]/80 backdrop-blur-2xl border border-white/10 p-3 rounded-full flex justify-around shadow-2xl shadow-black">
          <button className="flex flex-col items-center gap-1 text-blue-500 font-bold text-[10px]"><span>🏠</span>Início</button>
          <button className="flex flex-col items-center gap-1 text-slate-500 font-bold text-[10px]"><span>📅</span>Eventos</button>
          <button className="flex flex-col items-center gap-1 text-slate-500 font-bold text-[10px]"><span>👤</span>Perfil</button>
        </nav>
      </footer>
    </div>
  );
}