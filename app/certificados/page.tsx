
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Award, CheckCircle, Clock } from 'lucide-react';
import BottomNav from '@/app/components/BottomNav';
import ConfirmModal from '@/app/components/ConfirmModal';
import { toast } from 'sonner';

export default function CertificadosPage() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<'meus' | 'criados'>('meus');
  const [eventosCriados, setEventosCriados] = useState<any[]>([]);
  const [meusCertificados, setMeusCertificados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    type: 'warning' as 'warning' | 'danger' | 'info',
    onConfirm: () => {}
  });

  const confirmAction = (title: string, message: string, onConfirm: () => void, type: 'warning' | 'danger' | 'info' = 'warning', confirmText = 'Confirmar') => {
    setModalConfig({ isOpen: true, title, message, onConfirm, type, confirmText });
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      setLoading(true);
      try {
        if (abaAtiva === 'criados') {
          
          const q = query(collection(db, 'eventos'), where('creatorId', '==', user.uid));
          const snap = await getDocs(q);
          const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setEventosCriados(lista);
        } else {
          
          const q = query(collection(db, 'participacoes'), where('userId', '==', user.uid), where('certificadoEmitido', '==', true));
          const snap = await getDocs(q);
          const parts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const certsDetalhados = await Promise.all(parts.map(async (part: any) => {
            const evRef = doc(db, 'eventos', part.eventoId);
            const evSnap = await getDoc(evRef);
            return {
              ...part,
              eventoData: evSnap.exists() ? evSnap.data() : null
            };
          }));
          
          setMeusCertificados(certsDetalhados);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [abaAtiva, router]);

  const handleFinalizar = (eventoId: string) => {
    confirmAction(
      "Finalizar Evento",
      "Certeza que quer encerrar este evento? Após finalizar, você poderá selecionar os participantes e gerar os certificados manualmente.",
      async () => {
        try {
          const res = await fetch('/api/finalizar_evento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventoId, userId: auth.currentUser?.uid })
          });

          if (!res.ok) throw new Error("Erro na API ao finalizar evento.");
          
          toast.success("Evento finalizado com sucesso!");
          
          setEventosCriados(prev => prev.map(ev => ev.id === eventoId ? { ...ev, status: 'finalizado' } : ev));
        } catch (error) {
          console.error(error);
          toast.error("Erro ao finalizar evento.");
        }
      },
      'warning',
      'Finalizar Evento'
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24 font-sans">
      <header className="w-full max-w-4xl mx-auto p-8 pt-16 pb-6 bg-[#1E293B]/40 border-b border-gray-800 rounded-b-xl lg:mt-4 lg:rounded-t-xl">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Award className="text-yellow-400" size={32} /> Central
        </h1>
        <p className="text-gray-400 text-sm mt-2">Gerencie eventos criados e baixe seus certificados.</p>
      </header>

      <div className="w-full max-w-4xl mx-auto flex border-b border-gray-800 mt-2 px-6">
        <button 
          onClick={() => setAbaAtiva('meus')} 
          className={`pb-4 pt-4 px-2 text-sm font-semibold transition-colors border-b-2 ${abaAtiva === 'meus' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Meus Certificados
        </button>
        <button 
          onClick={() => setAbaAtiva('criados')} 
          className={`pb-4 pt-4 px-2 ml-6 text-sm font-semibold transition-colors border-b-2 ${abaAtiva === 'criados' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Eventos Criados (Admin)
        </button>
      </div>

      <main className="w-full max-w-4xl mx-auto p-6 space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Carregando dados...</div>
        ) : abaAtiva === 'meus' ? (
          
          meusCertificados.length > 0 ? (
            meusCertificados.map(cert => (
              <div key={cert.id} className="bg-gradient-to-r flex flex-row items-center justify-between from-[#1E293B] to-[#0F172A] border border-gray-700 rounded-2xl p-5 shadow-lg">
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{cert.eventoData?.titulo || 'Evento Desconhecido'}</h3>
                  <p className="text-xs text-gray-400">Participante: {cert.nome}</p>
                </div>
                <button 
                  onClick={() => router.push(`/certificados/${cert.id}`)}
                  className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 p-3 rounded-full transition-colors"
                  title="Ver e Baixar Certificado"
                >
                  <Award size={24} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10 flex flex-col items-center">
              <Award className="text-gray-600 mb-3 opacity-50" size={48} />
              <p>Nenhum certificado emitido para você ainda.</p>
              <p className="text-sm mt-1">Participe de eventos para ganhá-los!</p>
            </div>
          )
        ) : (
          
          eventosCriados.length > 0 ? (
            eventosCriados.map(evento => (
              <div key={evento.id} className="bg-[#1E293B] border border-gray-700 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white">{evento.titulo}</h3>
                  {evento.status === 'finalizado' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-green-500/20 text-green-400 uppercase">
                      <CheckCircle size={12} /> Finalizado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-500 uppercase">
                      <Clock size={12} /> Em Andamento
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-4">{evento.descricao}</p>
                
                {evento.status !== 'finalizado' && (
                  <button 
                    onClick={() => handleFinalizar(evento.id)}
                    className="w-full bg-red-600/20 border border-red-500/30 hover:bg-red-600/40 text-red-400 font-semibold rounded-xl py-3 text-sm transition-colors"
                  >
                    Encerrar Evento
                  </button>
                )}
                {evento.status === 'finalizado' && (
                  <button 
                    onClick={() => router.push(`/gerar_certificados/${evento.id}`)}
                    className="w-full bg-[#0F172A] border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 font-semibold rounded-xl py-3 text-sm transition-colors"
                  >
                    Emitir / Ver Certificados
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">Você não criou nenhum evento ainda.</div>
          )
        )}
      </main>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      <BottomNav />
    </div>
  );
}
