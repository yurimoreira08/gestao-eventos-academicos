'use client';

import { useState } from 'react';

export default function AvaliarSubmissao() {
  const [feedback, setFeedback] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [decisao, setDecisao] = useState(null); // 'Aprovado' ou 'Reprovado'

  // Estado dos critérios com pontuação interna
  const [criterios, setCriterios] = useState([
    { id: 1, titulo: 'Originalidade', nivel: 'Excelente', pontos: 10, aberto: true },
    { id: 2, titulo: 'Metodologia', nivel: 'Bom', pontos: 8, aberto: false },
    { id: 3, titulo: 'Clareza e Organização', nivel: 'Bom', pontos: 8, aberto: false },
    { id: 4, titulo: 'Relevância e Impacto', nivel: 'Razoável', pontos: 6, aberto: false },
  ]);

  // Calcula a média das notas
  const notaFinal = criterios.reduce((acc, curr) => acc + curr.pontos, 0) / criterios.length;

  const alterarNivel = (criterioId, novoNivel, novosPontos) => {
    setCriterios(prev => prev.map(c => 
      c.id === criterioId ? { ...c, nivel: novoNivel, pontos: novosPontos } : c
    ));
  };

  const handleEnviarAvaliacao = async () => {
    if (!decisao) return alert("Selecione se o trabalho está Aprovado ou Reprovado.");
    
    setEnviando(true);
    try {
      const response = await fetch('/api/avaliar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissaoId: 'sub-123',
          nota: notaFinal,
          feedback,
          decisao
        }),
      });

      if (response.ok) {
        alert("Avaliação do Mateus Coelho enviada!");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans flex flex-col items-center">
      <header className="w-full max-w-[1400px] flex items-center p-6 gap-6">
        <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400">←</button>
        <h1 className="text-xl font-bold tracking-tight text-white">Avaliar Submissão</h1>
      </header>

      <main className="w-full max-w-[1200px] px-6 grid grid-cols-12 gap-8 pb-40">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-[#161e31] p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 italic text-slate-400">
              "Aplicação de técnicas de programação em jogos educativos para ensino de lógica."
            </h2>
            <div className="flex items-center gap-3">
              <img className="w-10 h-10 rounded-full border border-blue-500/50" src="https://i.pravatar.cc/100?u=mateus" alt="Mateus" />
              <p className="text-sm font-medium">Mateus Coelho</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Critérios de Avaliação</h3>
            {criterios.map((c) => (
              <div key={c.id} className="bg-[#161e31] rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-5 flex justify-between items-center bg-[#1e293b]/30">
                  <span className="font-semibold">{c.titulo}</span>
                  <span className="text-xs font-bold text-blue-400 uppercase">{c.nivel}</span>
                </div>
                <div className="p-5 grid grid-cols-4 gap-2">
                  {[
                    { label: 'Excelente', p: 10 },
                    { label: 'Bom', p: 8 },
                    { label: 'Razoável', p: 6 },
                    { label: 'Fraco', p: 4 }
                  ].map((btn) => (
                    <button 
                      key={btn.label}
                      onClick={() => alterarNivel(c.id, btn.label, btn.p)}
                      className={`py-2.5 rounded-lg text-xs font-bold transition-all border ${
                        c.nivel === btn.label ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-[#0b1120] border-slate-800 text-slate-500'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#161e31] p-6 rounded-2xl border border-slate-800 sticky top-6">
            <h3 className="font-bold mb-4">Notas Adicionais</h3>
            <textarea 
              className="w-full h-40 bg-[#0b1120] border border-slate-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500"
              placeholder="Feedback para o autor..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            
            <h3 className="font-bold my-4">Decisão Final</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setDecisao('Aprovado')}
                className={`flex-1 py-3 rounded-xl font-bold border transition-all ${decisao === 'Aprovado' ? 'bg-green-600 border-green-500 text-white' : 'border-slate-800 text-slate-500'}`}
              >
                Aprovar
              </button>
              <button 
                onClick={() => setDecisao('Reprovado')}
                className={`flex-1 py-3 rounded-xl font-bold border transition-all ${decisao === 'Reprovado' ? 'bg-red-600 border-red-500 text-white' : 'border-slate-800 text-slate-500'}`}
              >
                Reprovar
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#0b1120]/90 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
        <div className="w-full max-w-[1200px] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase">Média Final</span>
            <span className="text-3xl font-black text-white">{notaFinal.toFixed(1)}<span className="text-sm text-slate-600">/10</span></span>
          </div>
          <button 
            onClick={handleEnviarAvaliacao}
            disabled={enviando}
            className={`px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 ${enviando ? 'opacity-50' : ''}`}
          >
            {enviando ? 'ENVIANDO...' : 'ENVIAR AVALIAÇÃO'}
          </button>
        </div>
      </footer>
    </div>
  );
}