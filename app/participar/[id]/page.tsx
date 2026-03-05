
'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { ChevronLeft, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ParticiparPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setCpf(value);
  };

  const handleInscricao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      toast.error("Para inscrever-se, é necessário efetuar o login previamente.");
      router.push('/login');
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      toast.error("Por favor, insira um CPF válido composto por 11 dígitos.");
      return;
    }

    setLoading(true);

    try {
      
      const res = await fetch('/api/participar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventoId: resolvedParams.id,
          userId: auth.currentUser.uid,
          nome,
          email,
          cpf: cpfLimpo
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro desconhecido na API.');
      }

      toast.success('Inscrição confirmada com sucesso.');
      router.push('/eventos'); 
    } catch (error: any) {
      console.error("Erro ao processar inscrição:", error);
      toast.error(`Ocorreu um erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-md">
        <header className="flex items-center p-4 border-b border-gray-800 bg-[#1E293B]/30 rounded-t-2xl mt-4">
          <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-semibold text-lg ml-2">Confirmar Inscrição</h1>
        </header>

        <main className="p-6 bg-[#1E293B] border-x border-b border-gray-800 rounded-b-2xl shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500/20 p-4 rounded-full">
              <UserCheck className="text-blue-500" size={40} />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center mb-2">Quase lá!</h2>
          <p className="text-gray-400 text-sm text-center mb-8">
            Preencha seus dados reais. Eles sairão no seu certificado depois.
          </p>

          <form onSubmit={handleInscricao} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Nome Completo</label>
              <input 
                type="text" 
                required 
                placeholder="Ex: Nome Completo" 
                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email de Contato</label>
              <input 
                type="email" 
                required 
                placeholder="seu@email.com" 
                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">CPF</label>
              <input 
                type="text" 
                required 
                placeholder="000.000.000-00" 
                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                value={cpf} 
                onChange={handleCpfChange} 
                maxLength={14}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-4 py-4 mt-4 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              {loading ? 'Processando...' : 'Confirmar Inscrição'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}