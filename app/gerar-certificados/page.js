'use client';

import { useState } from 'react';

export default function GerarCertificados() {
  const [busca, setBusca] = useState('');
  const [enviando, setEnviando] = useState(false);
  
  // Estado inicial dos participantes (Simulando dados do PostgreSQL)
  const [participantes, setParticipantes] = useState([
    { id: 1, nome: 'Ana Beatriz Silva', email: 'ana.beatriz@ifpi.edu.br', status: 'CONFIRMADO', selecionado: true },
    { id: 2, nome: 'Mariana Oliveira Souza', email: 'mari.souza@provedor.com.br', status: 'ENVIADO', selecionado: false },
    { id: 3, nome: 'Ricardo P. Alencar', email: 'ricardo.alencar@tech.com', status: 'CONFIRMADO', selecionado: true },
  ]);

  // Função para alternar seleção individual
  const toggleParticipante = (id) => {
    setParticipantes(prev => prev.map(p => 
      p.id === id ? { ...p, selecionado: !p.selecionado } : p
    ));
  };

  // Função para selecionar/desmarcar todos
  const toggleTodos = () => {
    const todosMarcados = participantes.every(p => p.selecionado);
    setParticipantes(prev => prev.map(p => ({ ...p, selecionado: !todosMarcados })));
  };

  // Integração com a API
  const handleGerarCertificados = async () => {
    const selecionadosIds = participantes.filter(p => p.selecionado).map(p => p.id);
    
    if (selecionadosIds.length === 0) {
      alert("Por favor, selecione ao menos um participante.");
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch('/api/certificados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantesIds: selecionadosIds,
          modeloId: 'premium-dark-v2'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Opcional: Atualizar status para ENVIADO localmente
        setParticipantes(prev => prev.map(p => 
          p.selecionado ? { ...p, status: 'ENVIADO', selecionado: false } : p
        ));
      } else {
        alert("Erro: " + data.message);
      }
    } catch (err) {
      alert("Erro de conexão com o servidor Fedora.");
    } finally {
      setEnviando(false);
    }
  };

  // Filtro de busca em tempo real
  const participantesFiltrados = participantes.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    p.email?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-300 font-sans">
      {/* Efeito de iluminação de fundo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 max-w-[1400px] mx-auto p-8 flex items-center gap-4">
        <button className="p-2.5 hover:bg-slate-800/50 rounded-xl border border-slate-800/50 transition-all text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gerar Certificados</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide">PAINEL DE EMISSÃO EM LOTE</p>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-8 pb-40 grid grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: Preview Visual */}
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-[#111827]/50 backdrop-blur-md p-2 rounded-[24px] border border-slate-800/50 shadow-2xl">
            <div className="relative bg-white rounded-[18px] p-12 min-h-[400px] flex flex-col items-center justify-center text-center shadow-inner">
              <div className="mb-6 bg-slate-100 p-4 rounded-full text-slate-400">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
              </div>
              <span className="text-[10px] tracking-[5px] font-black text-slate-400 uppercase mb-4">Certificado de Participação</span>
              <h3 className="text-4xl font-serif font-bold text-slate-800 mb-6">{"{Nome do Participante}"}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                participou com sucesso do evento <br/>
                <span className="font-bold text-slate-900">{"{Título do Evento}"}</span> <br/>
                realizado em <span className="text-slate-700">{"{Data}"}</span>.
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-[#111827]/30 border border-slate-800/50 rounded-2xl flex justify-between items-center">
            <p className="text-sm font-bold text-white">Modelo Padrão Acadêmico <span className="text-blue-500 ml-2">v2.0</span></p>
            <button className="text-xs font-bold text-blue-500 hover:underline">Editar Layout</button>
          </div>
        </section>

        {/* Lado Direito: Listagem e Busca */}
        <section className="col-span-12 lg:col-span-5 space-y-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar participante..." 
              className="w-full pl-6 pr-4 py-4 bg-[#111827]/50 border border-slate-800 rounded-2xl text-white focus:border-blue-500/50 outline-none transition-all"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="bg-[#111827]/50 border border-slate-800/50 rounded-[24px] overflow-hidden shadow-2xl">
            <div 
              className="p-5 flex items-center gap-4 bg-slate-800/20 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/40 transition-colors"
              onClick={toggleTodos}
            >
              <input 
                type="checkbox" 
                checked={participantes.length > 0 && participantes.every(p => p.selecionado)} 
                className="w-5 h-5 rounded accent-blue-600"
                readOnly
              />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Selecionar Todos ({participantes.length})</span>
            </div>

            <div className="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-slate-800/30">
              {participantesFiltrados.map((p) => (
                <div 
                  key={p.id} 
                  className="p-5 flex justify-between items-center hover:bg-blue-500/5 transition-all group cursor-pointer"
                  onClick={() => toggleParticipante(p.id)}
                >
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={p.selecionado} 
                      className="w-5 h-5 rounded accent-blue-600" 
                      readOnly
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-200 group-hover:text-white">{p.nome}</p>
                      <p className="text-[10px] text-slate-500">{p.email}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-lg border ${
                    p.status === 'ENVIADO' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Footer Action */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-[1200px] z-50">
        <div className="bg-[#111827]/80 backdrop-blur-2xl border border-white/10 p-4 rounded-[24px] shadow-2xl flex items-center justify-between">
          <div className="px-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ação Selecionada</p>
            <p className="text-white font-medium text-sm">
              {participantes.filter(p => p.selecionado).length} Certificados para processar
            </p>
          </div>
          <button 
            onClick={handleGerarCertificados}
            disabled={enviando}
            className={`px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 ${enviando ? 'opacity-50 cursor-wait' : ''}`}
          >
            {enviando ? 'PROCESSANDO EMISSÃO...' : 'DISPARAR CERTIFICADOS'}
            {!enviando && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
          </button>
        </div>
      </footer>
    </div>
  );
}