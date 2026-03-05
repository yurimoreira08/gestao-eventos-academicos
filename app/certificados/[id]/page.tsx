'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronLeft, GraduationCap, Printer, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function CertificadoPageView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const [participacao, setParticipacao] = useState<any>(null);
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificado = async () => {
      try {
        const participacaoRef = doc(db, 'participacoes', resolvedParams.id);
        const participacaoSnap = await getDoc(participacaoRef);

        if (!participacaoSnap.exists()) {
          toast.error("Certificado não encontrado.");
          router.push('/certificados');
          return;
        }

        const partData = participacaoSnap.data();
        setParticipacao({ id: participacaoSnap.id, ...partData });

        if (!partData.certificadoEmitido) {
          toast.error("Este certificado ainda não foi emitido.");
          router.push('/certificados');
          return;
        }

        const eventoRef = doc(db, 'eventos', partData.eventoId);
        const eventoSnap = await getDoc(eventoRef);

        if (eventoSnap.exists()) {
          setEvento({ id: eventoSnap.id, ...eventoSnap.data() });
        }
      } catch (error) {
        console.error("Erro ao buscar certificado:", error);
        toast.error('Erro ao carregar o certificado.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificado();
  }, [resolvedParams.id, router]);

  const handleImprimir = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">Carregando certificado...</div>;

  if (!participacao || !evento) return null;

  const dataFinal = evento.dataFim ? new Date(`${evento.dataFim}T${evento.horaFim || '00:00'}`).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans flex flex-col items-center">
      
      <div className="w-full max-w-4xl print:hidden">
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1E293B]/50 rounded-b-none mt-0 lg:mt-4 lg:rounded-t-2xl">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="text-gray-400 p-2 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h1 className="font-semibold text-lg ml-2">Visualizar Certificado</h1>
          </div>
          <button 
            onClick={handleImprimir}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Printer size={18} />
            <span>Baixar PDF</span>
          </button>
        </header>
      </div>

      <main className="w-full flex-1 flex justify-center p-4 print:p-0">
        <div className="w-[1000px] max-w-full aspect-[1.414/1] bg-white text-[#0F172A] shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center p-12 print:shadow-none print:w-[297mm] print:h-[210mm]">

          <div className="absolute top-0 left-0 w-full h-4 bg-blue-600"></div>
          <div className="absolute top-0 left-0 w-full h-8 bg-blue-600/30 blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-4 bg-blue-800"></div>
          <div className="absolute inset-4 border-2 border-gray-200 pointer-events-none"></div>
          <div className="absolute inset-5 border border-gray-300 border-dashed pointer-events-none"></div>

          <div className="bg-blue-50 p-6 rounded-full mb-6 relative z-10">
            <GraduationCap size={64} className="text-blue-600" />
          </div>
          
          <h2 className="text-sm font-bold tracking-[0.3em] text-gray-400 mb-8 uppercase relative z-10">Certificado de Participação</h2>
          
          <div className="mb-4 relative z-10">
            <p className="text-gray-600 text-lg mb-2">Concedemos este certificado a</p>
            <h1 className="text-5xl font-serif font-bold text-gray-800 border-b-2 border-gray-300 pb-2 px-12 inline-block">
              {participacao.nome}
            </h1>
          </div>
          
          <div className="max-w-2xl mt-4 relative z-10">
            <p className="text-xl font-medium text-gray-600 leading-relaxed">
              por ter participado com êxito do evento acadêmico
            </p>
            <p className="text-3xl font-bold mt-2 text-blue-700">
              {evento.titulo}
            </p>
          </div>

          <div className="mt-10 mb-4 relative z-10 text-center">
            <p className="text-lg text-gray-600">
              CPF do participante: <span className="font-bold text-gray-800 tracking-wider font-mono">{participacao.cpf ? participacao.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'Não informado'}</span>
            </p>
          </div>

          <div className="mt-6 relative z-10 flex flex-col items-center">
            <p className="text-sm font-bold text-gray-700 mb-1">Realizado em: {dataFinal}</p>
            <p className="text-xs text-gray-500 font-mono">Documento ID: {participacao.id}</p>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body {
            height: 100vh;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden;
            background: white;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
}
