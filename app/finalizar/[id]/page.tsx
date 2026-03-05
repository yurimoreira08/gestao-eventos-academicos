
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { ChevronLeft, Lock, Plus, Image as ImageIcon, FileText, Download, Award, FileSpreadsheet, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function FinalizarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [evento, setEvento] = useState<any>(null);
  const [qtdParticipantes, setQtdParticipantes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        
        const docRef = doc(db, 'eventos', resolvedParams.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setEvento(docSnap.data());
        }

        const q = query(collection(db, 'participacoes'), where('eventoId', '==', resolvedParams.id));
        const inscritosSnap = await getDocs(q);
        setQtdParticipantes(inscritosSnap.size);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [resolvedParams.id]);

  const handleFinalizar = async () => {
    if (!confirm("Tem certeza? Esta ação bloqueará as edições e liberará os certificados.")) return;
    
    setProcessando(true);
    try {
      const res = await fetch('/api/finalizar_evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId: resolvedParams.id, userId: auth.currentUser?.uid })
      });

      if (!res.ok) throw new Error("Erro na API ao finalizar.");
      
      toast.success("Evento finalizado com sucesso! Certificados liberados.");
      router.push('/certificados'); 
    } catch (error) {
      toast.error("Ocorreu um erro ao finalizar o evento.");
    } finally {
      setProcessando(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">Carregando painel...</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-28 font-sans">
      
      <header className="flex items-center justify-between p-4 sticky top-0 bg-[#0F172A]/90 backdrop-blur z-10">
        <button onClick={() => router.back()} className="p-2"><ChevronLeft size={24} /></button>
        <h1 className="font-semibold text-lg">Finalizar e Relatórios</h1>
        <div className="w-8"></div> 
      </header>

      <main className="p-5 space-y-8">

        <section className="bg-[#1E293B] rounded-2xl p-5 border border-gray-700/50 shadow-lg">
          <div className="flex gap-4 mb-4">
            <div className="bg-[#0F172A] p-3 rounded-xl h-fit border border-gray-800">
              <Lock className="text-blue-500" size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Finalizar Evento</h2>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                Após finalizar, os dados do evento ({qtdParticipantes} participantes) serão bloqueados para edição.
              </p>
            </div>
          </div>
          <button 
            onClick={handleFinalizar}
            disabled={processando || evento?.status === 'finalizado'}
            className={`w-full font-semibold rounded-xl px-4 py-3 transition-colors ${
              evento?.status === 'finalizado' 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {processando ? 'Processando...' : evento?.status === 'finalizado' ? 'Evento Já Finalizado' : 'Encerrar Evento e Bloquear Dados'}
          </button>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Anexar Fotos/Documentos</h3>
            <button className="text-blue-500 flex items-center gap-1 text-sm font-medium">
              <Plus size={16} /> Adicionar
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="min-w-[100px] h-[100px] bg-gray-800 rounded-xl flex flex-col items-center justify-center border border-gray-700">
               <ImageIcon size={24} className="text-gray-400 mb-2" />
               <span className="text-[10px] text-gray-400">Abertura.jpg</span>
            </div>
            <div className="min-w-[100px] h-[100px] bg-gray-800 rounded-xl flex flex-col items-center justify-center border border-gray-700">
               <ImageIcon size={24} className="text-gray-400 mb-2" />
               <span className="text-[10px] text-gray-400">Palestra.jpg</span>
            </div>
            <div className="min-w-[100px] h-[100px] bg-[#1E293B] rounded-xl flex flex-col items-center justify-center border border-gray-700">
               <FileText size={24} className="text-gray-400 mb-2" />
               <span className="text-[10px] text-gray-400">Resumo.pdf</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Relatórios Disponíveis</h3>
          <div className="space-y-3">
            
            <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-2 rounded-lg"><FileSpreadsheet size={20} className="text-blue-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">Relatório de Presença</h4>
                  <p className="text-xs text-gray-500">CSV • 124 KB</p>
                </div>
              </div>
              <button className="text-blue-500 p-2 hover:bg-blue-500/10 rounded-full transition-colors"><Download size={20} /></button>
            </div>

            <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-2 rounded-lg"><FileText size={20} className="text-green-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">Resumo Financeiro</h4>
                  <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                </div>
              </div>
              <button className="text-blue-500 p-2 hover:bg-blue-500/10 rounded-full transition-colors"><Download size={20} /></button>
            </div>

            <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/10 p-2 rounded-lg"><MessageSquare size={20} className="text-yellow-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">Feedback de Palestrantes</h4>
                  <p className="text-xs text-gray-500">PDF • 850 KB</p>
                </div>
              </div>
              <button className="text-blue-500 p-2 hover:bg-blue-500/10 rounded-full transition-colors"><Download size={20} /></button>
            </div>

          </div>
        </section>
      </main>

      <div className="fixed bottom-0 w-full p-4 bg-[#0F172A]/90 backdrop-blur border-t border-gray-800 z-50">
        <button 
          onClick={handleFinalizar}
          disabled={evento?.status === 'finalizado'}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-colors disabled:bg-gray-700 disabled:text-gray-400"
        >
          <Award size={20} />
          {evento?.status === 'finalizado' ? 'Certificados Já Gerados' : 'Gerar Todos os Certificados'}
        </button>
      </div>
    </div>
  );
}