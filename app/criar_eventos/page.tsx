
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import BottomNav from '@/app/components/BottomNav';
import { Camera, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CriarEventosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('');
  
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);

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

  const handleCriarEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      toast.error("É necessário estar logado para criar um evento.");
      return;
    }

    setLoading(true);
    try {
      
      const response = await fetch('/api/criar_eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          descricao,
          dataInicio,
          horaInicio,
          dataFim,
          horaFim,
          imagemBase64: imagemPreview,
          creatorId: auth.currentUser.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('A API retornou uma resposta de erro.');
      }

      const data = await response.json();
      console.log('Evento criado com sucesso! ID:', data.id);
      toast.success('Evento criado com sucesso!');
      
      router.push('/menu');
    } catch (error) {
      console.error("Falha na comunicação com a API:", error);
      toast.error('Ocorreu um erro de rede ou de servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl mt-4">
        <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1E293B]/50 rounded-t-2xl">
          <button onClick={() => router.back()} className="text-blue-500 text-sm hover:text-blue-400">Cancelar</button>
          <h1 className="font-semibold text-lg">Criar Evento Acadêmico</h1>
          <button onClick={handleCriarEvento} className="text-blue-500 text-sm font-semibold hover:text-blue-400">Criar</button>
        </header>

        <main className="p-6 space-y-6 bg-[#0F172A] border-x border-b border-gray-800 rounded-b-2xl shadow-xl">
          
          <div 
            onClick={() => !imagemPreview && fileInputRef.current?.click()}
            className={`relative border border-dashed border-gray-700 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-[#1E293B] bg-opacity-30 transition-all ${imagemPreview ? 'p-0 border-none' : 'p-8 cursor-pointer hover:bg-opacity-50'}`}
          >
            {imagemPreview ? (
              <>
                <img src={imagemPreview} alt="Preview do evento" className="w-full h-56 object-cover" />
                <button 
                  type="button" 
                  onClick={() => setImagemPreview(null)} 
                  className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-black transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <Camera size={32} className="text-blue-500 mb-2" />
                <h2 className="font-semibold text-sm">Carregar Imagem do Evento</h2>
                <p className="text-xs text-gray-500 mt-1 mb-4">Recomendado: 1200x630px (Máx 5MB)</p>
                <button type="button" className="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2 text-sm text-blue-400 font-medium hover:bg-gray-800 transition-colors">
                  Selecionar Imagem
                </button>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*"
              className="hidden"
            />
          </div>

          <form onSubmit={handleCriarEvento} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Título do Evento</label>
              <input 
                type="text" 
                className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Descrição</label>
              <textarea 
                rows={4} 
                className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Início</label>
                <input type="date" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hora Início</label>
                <input type="time" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Fim</label>
                <input type="date" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hora Fim</label>
                <input type="time" className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold rounded-xl px-4 py-4 mt-8 transition-colors shadow-lg shadow-blue-500/25">
              {loading ? 'Publicando...' : 'Publicar Evento Acadêmico'}
            </button>
          </form>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}