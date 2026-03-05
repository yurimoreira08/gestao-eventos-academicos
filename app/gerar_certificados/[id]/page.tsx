
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronLeft, GraduationCap, Pencil, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function GerarCertificadosPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const buscarParticipantes = async () => {
      try {
        const q = query(collection(db, 'participacoes'), where('eventoId', '==', resolvedParams.id));
        const snap = await getDocs(q);
        
        const lista: any[] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setParticipantes(lista);

        const pendentes = lista.filter(p => !p.certificadoEmitido).map(p => p.id);
        setSelecionados(pendentes);
      } catch (error) {
        console.error("Falha ao recuperar a listagem de participantes:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarParticipantes();
  }, [resolvedParams.id]);

  const toggleSelecao = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleTodos = () => {
    const idsFiltradosPendentes = participantes
      .filter(p => p.nome?.toLowerCase().includes(busca.toLowerCase()))
      .map(p => p.id);

    if (selecionados.length === idsFiltradosPendentes.length) {
      setSelecionados([]);
    } else {
      setSelecionados(idsFiltradosPendentes);
    }
  };

  const handleGerarCertificados = async () => {
    if (selecionados.length === 0) {
      toast.error("Por favor, selecione pelo menos um participante.");
      return;
    }
    
    setProcessando(true);
    try {
      const res = await fetch('/api/gerar_certificados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantesIds: selecionados })
      });

      if (!res.ok) throw new Error("Falha na comunicação com a API.");
      
      toast.success("Sucesso! Certificados gerados e enviados.");
      router.push('/certificados');
    } catch (error) {
      toast.error("Ocorreu um erro ao gerar os certificados.");
    } finally {
      setProcessando(false);
    }
  };

  const participantesFiltrados = participantes.filter(p => 
    (p.nome && p.nome.toLowerCase().includes(busca.toLowerCase())) || 
    (p.email && p.email.toLowerCase().includes(busca.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">Carregando participantes...</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-32 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="flex items-center p-4 sticky top-0 bg-[#0F172A]/90 backdrop-blur z-10 border-b border-gray-800">
          <button onClick={() => router.back()} className="p-2"><ChevronLeft size={24} /></button>
          <h1 className="font-semibold text-lg ml-2">Gerar Certificados</h1>
        </header>

        <main className="p-5 space-y-8">
        
        <section>
          <h2 className="text-xl font-bold">Modelo do Certificado</h2>
          <p className="text-gray-400 text-sm mt-1 mb-4">Revise como os dados serão exibidos no documento final.</p>
          
          <div className="bg-[#1E293B] rounded-2xl p-4 border border-gray-700 shadow-xl">
            <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center text-[#0F172A] aspect-[1.4/1] shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
               <div className="absolute top-0 left-0 w-full h-2 bg-blue-500/20 blur-md"></div>
               
               <div className="bg-blue-50 p-3 rounded-full mb-3">
                 <GraduationCap size={32} className="text-blue-600" />
               </div>
               <h3 className="text-[10px] font-bold tracking-widest text-gray-400 mb-4 uppercase">Certificado de Participação</h3>
               <p className="text-xl font-serif font-bold text-gray-800">{"{Nome do Participante}"}</p>
               <p className="text-[10px] mt-2 font-medium text-gray-500">participou com sucesso do evento</p>
               <p className="text-sm font-bold mt-1 text-gray-700">{"{Título do Evento}"}</p>
               <p className="text-[9px] mt-4 font-medium text-gray-400">realizado em {"{Data}"}.</p>
            </div>
            
            <div className="mt-5">
              <h4 className="font-bold text-sm text-center">Modelo Padrão Acadêmico</h4>
              <p className="text-xs text-gray-500 mt-1 text-center">Os dados acima serão injetados automaticamente no documento.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Selecionar Participantes</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail" 
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-blue-500 outline-none"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-gray-700 cursor-pointer hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-[#0F172A]"
                  checked={selecionados.length === participantes.length && selecionados.length > 0}
                  onChange={toggleTodos}
                />
                <span className="font-medium text-sm">Selecionar Todos ({participantes.length})</span>
              </div>
            </label>

            {participantesFiltrados.map(part => (
              <label key={part.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${part.certificadoEmitido ? 'bg-[#0F172A] border-gray-800 opacity-80' : 'bg-[#1E293B] border-gray-700 hover:border-gray-500'}`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-[#0F172A]"
                    checked={selecionados.includes(part.id)}
                    onChange={() => toggleSelecao(part.id)}
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-200">{part.nome}</h4>
                    <p className="text-xs text-gray-500">{part.email}</p>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${part.certificadoEmitido ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                  {part.certificadoEmitido ? 'ENVIADO' : 'CONFIRMADO'}
                </div>
              </label>
            ))}
          </div>
        </section>
        </main>
      </div>

      <div className="fixed bottom-0 w-full p-4 bg-[#0F172A]/95 backdrop-blur-md border-t border-gray-800 z-50 flex justify-center">
        <div className="w-full max-w-sm">
          <button 
            onClick={handleGerarCertificados}
            disabled={processando || selecionados.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-4 py-3 transition-colors disabled:bg-gray-800 disabled:text-gray-500 shadow-lg text-sm"
          >
            {processando ? 'Processando envio...' : `Gerar e Enviar ${selecionados.length} Certificados`}
          </button>
          <p className="text-center text-[10px] text-gray-500 mt-2 font-medium italic hidden sm:block">
            Os certificados serão gerados e disponibilizados no perfil do usuário.
          </p>
        </div>
      </div>
    </div>
  );
}