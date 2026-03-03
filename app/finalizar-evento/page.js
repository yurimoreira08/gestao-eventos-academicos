'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FinalizarEventoIntegrado() {
  const router = useRouter();
  const [bloqueado, setBloqueado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [relatorios, setRelatorios] = useState([]);

  // 1. Busca os relatórios e status do backend ao carregar a tela
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/eventos/finalizar?id=123'); // ID de exemplo
      const data = await res.json();
      setRelatorios(data.relatorios);
      if (data.evento?.status === 'BLOQUEADO') setBloqueado(true);
    }
    fetchData();
  }, []);

  // 2. Função que dispara o bloqueio no PostgreSQL
  const handleEncerrar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/eventos/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId: 123 }),
      });

      if (res.ok) {
        setBloqueado(true);
      }
    } catch (error) {
      console.error("Erro ao integrar com o backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-300 font-sans p-10 selection:bg-blue-500/30">
      
      {/* Header com Nome do Usuário */}
      <header className="max-w-[1400px] mx-auto mb-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xs font-bold">...</div>
          <div>
            <h1 className="text-xl font-black text-white leading-none">Finalizar e Relatórios</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[3px] mt-1">Gestão de Encerramento • SportConnect</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#111827] p-2 pr-6 border border-white/5 rounded-2xl">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg">AC</div>
          <span className="text-sm font-bold text-white">Arthur César</span>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-10">
        
        {/* Coluna de Controle de Dados */}
        <div className="col-span-7 space-y-10">
          <section className="bg-[#111827]/60 backdrop-blur-xl border border-white/5 p-10 rounded-[40px] shadow-2xl">
            <div className="flex items-center gap-5 mb-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                bloqueado ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'
              }`}>
                {bloqueado ? '🛡️' : '🔒'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Status de Integridade</h2>
                <p className="text-xs text-slate-500">Controle de Integridade dos dados acadêmicos.</p>
              </div>
            </div>

            <div className="bg-black/30 p-8 rounded-[32px] border border-white/5 mb-10">
              <p className="text-sm leading-relaxed text-slate-400">
                {bloqueado 
                  ? "Este evento está selado. Nenhuma alteração em participantes ou notas pode ser realizada no banco." 
                  : "Ação Crítica: Ao encerrar, os 320 registros de participantes e as 15 sessões do evento serão bloqueados permanentemente para edição no banco de dados."}
              </p>
            </div>

            <button 
              onClick={handleEncerrar}
              disabled={bloqueado || loading}
              className={`w-full py-6 rounded-2xl font-black text-[10px] tracking-[4px] transition-all shadow-xl active:scale-[0.97] ${
                loading ? 'bg-blue-800 animate-pulse' :
                bloqueado ? 'bg-slate-800 text-slate-500 border border-white/5' : 
                'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {loading ? 'PROCESSANDO...' : bloqueado ? 'EVENTO BLOQUEADO PARA EDIÇÃO' : 'ENCERRAR EVENTO E BLOQUEAR DADOS'}
            </button>
          </section>

          {/* Galeria de Documentação */}
          <section className="bg-[#111827]/40 border border-white/5 p-10 rounded-[40px]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Documentação Visual</h3>
                <p className="text-[10px] text-slate-500">Relatórios e Fotos Finais</p>
              </div>
              <button className="text-[10px] font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 transition-all">
                + ADICIONAR ARQUIVO
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-black/20 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-black/20 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="aspect-square rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-blue-500 hover:border-blue-500/50 transition-all cursor-pointer">
                <span className="text-2xl">📄</span>
                <span className="text-[9px] font-bold uppercase tracking-tighter">Resumo.pdf</span>
              </div>
            </div>
          </section>
        </div>

        {/* Coluna de Exportação e Ação Final */}
        <div className="col-span-5 space-y-10">
          <section className="bg-[#111827]/40 border border-white/5 p-10 rounded-[40px]">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-8">Downloads e Exportação</h3>
            <div className="space-y-4">
              {relatorios.map((rel) => (
                <div key={rel.id} className="group p-5 bg-black/30 border border-white/5 rounded-3xl flex items-center justify-between hover:bg-blue-600 transition-all cursor-pointer shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#080d17] rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                      {rel.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white transition-colors">{rel.title}</p>
                      <p className="text-[10px] text-slate-500 group-hover:text-white/70 font-black uppercase tracking-tighter">{rel.desc}</p>
                    </div>
                  </div>
                  <a href={rel.url} className="w-10 h-10 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-all shadow-md">
                    📥
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Card de Certificados */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[40px] shadow-[0_25px_60px_rgba(37,99,235,0.3)] text-center relative overflow-hidden active:scale-[0.98] transition-all">
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-4xl mb-6">🏆</span>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight leading-tight">Pronto para a Emissão?</h3>
              <p className="text-[11px] text-blue-100/70 mb-10 font-medium max-w-[240px] mx-auto">Todos os certificados serão gerados e enviados por e-mail automaticamente.</p>
              
              <button 
                onClick={() => router.push('/gerar-certificados')}
                className="w-full bg-white text-blue-600 hover:text-blue-700 py-5 rounded-2xl font-black text-[10px] tracking-[2px] shadow-2xl transition-all"
              >
                GERAR TODOS OS CERTIFICADOS
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}