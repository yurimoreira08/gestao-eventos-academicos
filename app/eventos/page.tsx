
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { CalendarDays, MapPin, Clock, Search } from 'lucide-react';
import BottomNav from '@/app/components/BottomNav';
import { toast } from 'sonner';

export default function EventosPage() {
  const router = useRouter();
  const [eventos, setEventos] = useState<any[]>([]);
  const [participacoes, setParticipacoes] = useState<string[]>([]); 
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const q = query(collection(db, 'eventos'), orderBy('dataInicio', 'desc'));
        const snap = await getDocs(q);
        const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEventos(lista);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const fetchParticipacoes = async () => {
      if (!userId) {
        setParticipacoes([]);
        return;
      }
      try {
        const q = query(collection(db, 'participacoes'), where('userId', '==', userId));
        const snap = await getDocs(q);
        const listaEventosParticipados = snap.docs.map(doc => doc.data().eventoId);
        setParticipacoes(listaEventosParticipados);
      } catch (error) {
        console.error("Erro ao buscar participações:", error);
      }
    };

    fetchParticipacoes();
  }, [userId]);

  const eventosFiltrados = eventos.filter(evento => 
    evento.titulo?.toLowerCase().includes(busca.toLowerCase()) || 
    evento.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  const isEncerrado = (evento: any) => {
    if (evento.status === 'finalizado') return true;
    if (!evento.dataFim) return false;
    
    const fimStr = evento.horaFim ? `${evento.dataFim}T${evento.horaFim}` : `${evento.dataFim}T23:59:59`;
    const fimData = new Date(fimStr);
    return new Date() > fimData;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24 font-sans">
      <header className="p-8 pt-16 pb-8 bg-[#1E293B]/40 rounded-b-[2.5rem] border-b border-gray-800 shadow-xl">
        <h1 className="text-3xl font-bold tracking-tight">Eventos Acadêmicos</h1>
        <p className="text-gray-400 text-sm mt-2">Encontre e participe dos melhores eventos.</p>
        
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar eventos..." 
            className="w-full bg-[#0F172A] border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-blue-500 outline-none transition-colors"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </header>

      <main className="p-4 sm:p-6 w-full max-w-7xl mx-auto space-y-6">
        <div className="relative w-full max-w-md mx-auto sm:max-w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar eventos..." 
            className="w-full bg-[#0F172A] border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-blue-500 outline-none transition-colors"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-10">Carregando eventos...</div>
        ) : eventosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map(evento => (
              <div key={evento.id} className="bg-[#1E293B] border border-gray-700 rounded-2xl shadow-lg overflow-hidden group hover:border-blue-500/50 transition-colors flex flex-col">
                {evento.imagem && (
                  <div className="w-full h-48 overflow-hidden bg-[#0F172A] flex items-center justify-center">
                    <img src={evento.imagem} alt={evento.titulo} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h2 className="text-xl font-bold text-white leading-tight">{evento.titulo}</h2>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase shrink-0 ${isEncerrado(evento) ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {isEncerrado(evento) ? 'Encerrado' : 'Aberto'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-5 line-clamp-2 flex-1">{evento.descricao}</p>
                  
                  <div className="flex flex-col gap-2 text-xs text-gray-500 mb-5 shrink-0">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-blue-400" />
                      <span>
                        {evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString() : 'Não definida'} 
                        {evento.horaInicio ? ` às ${evento.horaInicio}` : ''}
                      </span>
                    </div>
                    {(evento.dataFim || evento.horaFim) && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-400" />
                        <span>
                          Fim: {evento.dataFim ? new Date(evento.dataFim).toLocaleDateString() : 'Não definida'} 
                          {evento.horaFim ? ` às ${evento.horaFim}` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {evento.creatorId === userId ? (
                    <button 
                      onClick={() => router.push(`/eventos/${evento.id}`)}
                      className="w-full bg-gray-800 hover:bg-gray-700 mt-auto text-gray-400 font-semibold rounded-xl py-3 transition-colors shrink-0"
                    >
                      Gerenciar Evento
                    </button>
                  ) : participacoes.includes(evento.id) ? (
                    <button 
                      onClick={() => router.push(`/eventos/${evento.id}`)}
                      className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 mt-auto font-semibold rounded-xl py-3 transition-colors shrink-0"
                    >
                      Acessar Evento
                    </button>
                  ) : (
                    <button 
                      onClick={() => router.push(`/participar/${evento.id}`)}
                      disabled={isEncerrado(evento)}
                      className="w-full bg-blue-600 hover:bg-blue-500 mt-auto text-white font-semibold rounded-xl py-3 transition-colors disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed shrink-0"
                    >
                      {isEncerrado(evento) ? 'Inscrições Encerradas' : 'Participar Agora'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            Nenhum evento encontrado.{!busca && ' Que tal criar um?'}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
