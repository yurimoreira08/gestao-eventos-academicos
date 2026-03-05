
'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { ChevronLeft, Save, Trash2, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/app/components/ConfirmModal';

export default function EventoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const [isCreator, setIsCreator] = useState(false);
  const [userParticipacaoId, setUserParticipacaoId] = useState<string | null>(null);
  const [participantes, setParticipantes] = useState<any[]>([]);

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
    const fetchEvento = async () => {
      try {
        const docRef = doc(db, 'eventos', resolvedParams.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setEvento({ id: docSnap.id, ...data });
          
          setTitulo(data.titulo || '');
          setDescricao(data.descricao || '');
          setDataInicio(data.dataInicio || '');
          setHoraInicio(data.horaInicio || '');
          setDataFim(data.dataFim || '');
          setHoraFim(data.horaFim || '');
          setImagemPreview(data.imagem || data.imagemBase64 || null);

          onAuthStateChanged(auth, async (user) => {
              if (user) {
               if (user.uid === data.creatorId) {
                 setIsCreator(true);
                 
                 const qParticipantes = query(collection(db, 'participacoes'), where('eventoId', '==', resolvedParams.id));
                 const snapParticipantes = await getDocs(qParticipantes);
                 const lista = snapParticipantes.docs.map(d => ({ id: d.id, ...d.data() }));
                 setParticipantes(lista);
               } else {
                 setIsCreator(false);
                 
                 const pq = query(collection(db, 'participacoes'), where('eventoId', '==', resolvedParams.id), where('userId', '==', user.uid));
                 const pSnap = await getDocs(pq);
                 if (!pSnap.empty) {
                   setUserParticipacaoId(pSnap.docs[0].id);
                 } else {
                   toast.error('Você não tem permissão para acessar esta página.');
                   router.push('/eventos');
                 }
               }
             } else {
               toast.error('Você não tem permissão para acessar esta página.');
               router.push('/eventos');
             }
          });
        } else {
          toast.error('Evento não encontrado.');
          router.push('/eventos');
        }
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        toast.error('Erro ao carregar os dados do evento.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [resolvedParams.id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem não pode ter mais que 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSalvando(true);
    try {
      const docRef = doc(db, 'eventos', resolvedParams.id);
      
      const payload: any = {
        titulo,
        descricao,
        dataInicio,
        horaInicio,
        dataFim,
        horaFim,
      };

      if (imagemPreview !== evento?.imagem) {
         
         payload.imagem = imagemPreview;
         payload.imagemBase64 = imagemPreview; 
      }

      await updateDoc(docRef, payload);
      
      toast.success('Evento atualizado com sucesso!');
      router.push('/eventos');
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error('Erro ao salvar as alterações do evento.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = () => {
    confirmAction(
      "Apagar Evento",
      "Tem certeza absoluta que deseja APAGAR este evento? Isso não pode ser desfeito e todas as inscrições serão perdidas.",
      async () => {
        setDeletando(true);
        try {
          
          const q = query(collection(db, 'participacoes'), where('eventoId', '==', resolvedParams.id));
          const snaps = await getDocs(q);
          
          const deletePromises = snaps.docs.map(participacaoDoc => deleteDoc(doc(db, 'participacoes', participacaoDoc.id)));
          await Promise.all(deletePromises);

          await deleteDoc(doc(db, 'eventos', resolvedParams.id));
          
          toast.success('Evento apagado com sucesso.');
          router.push('/eventos');
        } catch (error) {
          console.error("Erro ao deletar:", error);
          toast.error('Erro ao tentar apagar o evento.');
          setDeletando(false);
        }
      },
      'danger',
      'Apagar Evento'
    );
  };

  const handleCancelarInscricao = () => {
    if (!userParticipacaoId) return;

    confirmAction(
      "Cancelar Inscrição",
      "Tem certeza que deseja cancelar sua inscrição neste evento?",
      async () => {
        try {
          await deleteDoc(doc(db, 'participacoes', userParticipacaoId));
          toast.success('Inscrição cancelada com sucesso.');
          router.push('/eventos');
        } catch (error) {
          console.error("Erro ao cancelar inscrição:", error);
          toast.error('Erro ao cancelar sua inscrição.');
        }
      },
      'danger',
      'Cancelar Participação'
    );
  };

  if (loading) return <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">Carregando detalhes do evento...</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl mt-4">
        <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1E293B]/50 rounded-t-2xl">
          <button onClick={() => router.back()} className="text-gray-400 p-2 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-semibold text-lg">{isCreator ? 'Gerenciar Evento' : 'Acessar Evento'}</h1>
          {isCreator ? (
            <button 
              type="button" 
              onClick={handleDeletar} 
              disabled={deletando}
              className="text-red-500 p-2 hover:text-red-400 transition-colors disabled:opacity-50"
              title="Apagar Evento"
            >
              <Trash2 size={24} />
            </button>
          ) : (
            <div className="w-10"></div> 
          )}
        </header>

        <main className="p-6 space-y-6 bg-[#0F172A] border-x border-b border-gray-800 rounded-b-2xl shadow-xl">
           <div 
            onClick={() => isCreator && !imagemPreview && fileInputRef.current?.click()}
            className={`relative border border-dashed border-gray-700 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-[#1E293B] bg-opacity-30 transition-all ${imagemPreview ? 'p-0 border-none' : 'p-8'} ${!isCreator ? 'pointer-events-none' : 'cursor-pointer hover:bg-opacity-50'}`}
          >
            {imagemPreview ? (
              <>
                <img src={imagemPreview} alt="Preview do evento" className="w-full h-56 object-cover" />
                {isCreator && (
                  <button 
                    type="button" 
                    onClick={() => setImagemPreview(null)} 
                    className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-black transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </>
            ) : (
              <>
                <Camera size={32} className="text-blue-500 mb-2" />
                <h2 className="font-semibold text-sm">Atualizar Imagem do Evento</h2>
                <p className="text-xs text-gray-500 mt-1 mb-4">Recomendado: 1200x630px (Máx 5MB)</p>
                <button type="button" className="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2 text-sm text-blue-400 font-medium hover:bg-gray-800 transition-colors">
                  Selecionar Nova Imagem
                </button>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
              disabled={!isCreator}
            />
          </div>

          <form onSubmit={handleSalvar} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Título do Evento</label>
              <input type="text" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed" value={titulo} onChange={(e) => setTitulo(e.target.value)} required disabled={!isCreator} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Descrição</label>
              <textarea rows={4} className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed" value={descricao} onChange={(e) => setDescricao(e.target.value)} required disabled={!isCreator} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Início</label>
                <input type="date" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required disabled={!isCreator} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hora Início</label>
                <input type="time" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required disabled={!isCreator} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Fim</label>
                <input type="date" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required disabled={!isCreator} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hora Fim</label>
                <input type="time" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required disabled={!isCreator} />
              </div>
            </div>

            {isCreator ? (
              <>
                <button 
                  type="submit" 
                  disabled={salvando} 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-4 py-4 mt-8 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <Save size={20} />
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>

                <div className="pt-8 border-t border-gray-800 mt-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    Inscritos no Evento
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">{participantes.length}</span>
                  </h3>
                  
                  {participantes.length > 0 ? (
                    <div className="space-y-3">
                      {participantes.map(p => (
                        <div key={p.id} className="bg-[#1E293B] p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                           <div>
                             <p className="font-bold text-sm">{p.nome}</p>
                             <p className="text-xs text-gray-400">{p.email}</p>
                           </div>
                           <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.certificadoEmitido ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                             {p.certificadoEmitido ? 'CERTIFICADO ENVIADO' : 'INSCRITO'}
                           </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-[#1E293B]/50 rounded-xl border border-gray-800 border-dashed text-gray-500 text-sm">
                      Nenhum participante inscrito ainda.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-800">
                <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                  <h3 className="text-green-400 font-bold mb-1">Inscrição Confirmada</h3>
                  <p className="text-xs text-gray-400">Você está participando deste evento. O certificado será enviado para o seu e-mail após a conclusão.</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleCancelarInscricao} 
                  className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 font-bold border border-red-500/20 rounded-xl px-4 py-3 transition-colors"
                >
                  Cancelar Minha Participação
                </button>
              </div>
            )}
          </form>
        </main>
      </div>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}
