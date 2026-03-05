
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (password !== confirmPassword) {
      setErro('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    if (password.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: nome
      });

      console.log('Conta criada com sucesso para:', nome);

      router.push('/menu'); 
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);

      if (error.code === 'auth/email-already-in-use') {
        setErro('Este email já está em uso.');
      } else {
        setErro('Ocorreu um erro durante o cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-6 font-sans text-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Crie sua conta!</h1>
          <p className="text-gray-400 mt-2 text-sm">Organize seus eventos de forma profissional.</p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-4 mt-8">
          {erro && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm text-center">
              {erro}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Seu Nome</label>
            <input 
              type="text" 
              placeholder="Ex: João da Silva"
              className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input 
              type="email" 
              placeholder="seu.email@exemplo.com"
              className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Confirmar Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 mt-4 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            onClick={() => router.push('/login')}
            className="text-sm text-gray-400 hover:text-white"
          >
            Já tem conta? Fazer Login
          </button>
        </div>
      </div>
    </div>
  );
}