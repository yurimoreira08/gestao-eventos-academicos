'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Ícones para dar um ar mais profissional ao seu projeto de ADS
import { 
  LayoutDashboard, 
  PlusCircle, 
  ShieldCheck, 
  Award, 
  Bell, 
  Home, 
  Calendar, 
  User 
} from 'lucide-react';

export default function MenuPrincipal() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Bate na API de estatísticas que conecta ao Supabase
        const res = await fetch('/api/gestao/estatisticas');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Erro ao carregar dados do banco de dados");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Mapeamento das rotas integradas do seu grupo (Arthur, Yuri e as suas)
  const acoes = [
    { id: 1, titulo: 'Dashboard Elite', icon: <LayoutDashboard size={32} />, color: 'blue', route: '/dashboard' },
    { id: 2, titulo: 'Criar Evento', icon: <PlusCircle size={32} />, color: 'emerald', route: '/eventos' },
    { id: 3, titulo: 'Avaliar Trabalhos', icon: <ShieldCheck size={32} />, color: 'amber', route: '/avaliar-submissao' },
    { id: 4, titulo: 'Gerar Certificados', icon: <Award size={32} />, color: 'purple', route: '/gerar-certificados' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d17] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-300 font-sans overflow-x-hidden">
      {/* Efeito de iluminação de fundo (Glow) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 max-w-[1400px] mx-auto p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-blue-500/20 flex items-center justify-center bg-blue-600 text-white font-bold text-xl shadow-lg">
            LA
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Olá, Lorrany!</h1>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase italic">IFPI - Campus Picos</p>
          </div>
        </div>
        <button className="p-3 bg-[#111827]/50 border border-slate-800/50 rounded-2xl hover:bg-slate-800 transition-all relative">
          <Bell size={20} className="text-slate-400" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </button>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-8 pb-32">
        {/* Grid de Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {acoes.map((acao) => (
            <button
              key={acao.id}
              onClick={() => router.push(acao.route)}
              className="group p-8 rounded-[32px] border border-slate-800/50 backdrop-blur-xl bg-[#111827]/30 flex flex-col items-start transition-all hover:-translate-y-2 hover:border-blue-500/30 shadow-2xl shadow-black/40"
            >
              <div className="mb-6 text-blue-500 group-hover:scale-110 group-hover:text-blue-400 transition-all">
                {acao.icon}
              </div>
              <h3 className="text-white font-bold text-lg">{acao.titulo}</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">Acessar Sistema</p>
            </button>
          ))}
        </div>

        {/* Card de Resumo do Banco (Dados do Supabase) */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-[32px] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">📊</div>
              <div>
                <h3 className="text-white font-bold text-xl">Resumo Operacional</h3>
                <p className="text-sm text-slate-500">
                  {data?.kpis[0]?.val || 0} inscritos e {data?.kpis[1]?.val || 0} pagamentos confirmados hoje.
                </p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
            >
              Ver Analytics Completo
            </button>
          </div>
        </section>

        {/* Link para o Feed de Usuário */}
        <section className="bg-[#111827]/40 border border-slate-800/50 p-8 rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-slate-800/30 transition-all"
                 onClick={() => router.push('/eventos-disponiveis')}>
          <div className="flex items-center gap-4">
            <Calendar className="text-blue-500" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Visualizar Feed Público</h2>
          </div>
          <span className="text-slate-700 group-hover:text-white group-hover:translate-x-2 transition-all">→</span>
        </section>
      </main>

      {/* Footer Nav Centralizado Estilo Mobile App */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[500px] px-8 z-50">
        <nav className="bg-[#111827]/80 backdrop-blur-2xl border border-white/10 p-3 rounded-full flex justify-around shadow-2xl shadow-black">
          <button 
            onClick={() => router.push('/menu')}
            className="flex flex-col items-center gap-1 text-blue-500 font-bold text-[10px] transition-all"
          >
            <Home size={20} />
            <span>Início</span>
          </button>
          <button 
            onClick={() => router.push('/eventos-disponiveis')}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-white font-bold text-[10px] transition-all"
          >
            <Calendar size={20} />
            <span>Eventos</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-white font-bold text-[10px] transition-all">
            <User size={20} />
            <span>Perfil</span>
          </button>
        </nav>
      </footer>
    </div>
  );
}