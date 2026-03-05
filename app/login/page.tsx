
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      if (isLogin) {
        
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Autenticação realizada com sucesso.');
      } else {
        
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Registro de novo usuário realizado com sucesso.');
      }

      router.push('/menu'); 
    } catch (error: any) {
      console.error('Falha na operação de autenticação:', error);

      if (error.code === 'auth/invalid-credential') {
        setErro('Credenciais inválidas. Verifique seu email e senha.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErro('Este endereço de email já encontra-se registrado.');
      } else if (error.code === 'auth/weak-password') {
        setErro('A senha providenciada deve conter no mínimo 6 caracteres.');
      } else {
        setErro('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-6 font-sans text-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {isLogin ? 'Bem-vindo, Organizador!' : 'Crie sua Conta!'}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {isLogin ? 'Faça login para gerenciar seu evento.' : 'Cadastre-se para começar a organizar.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 mt-8">
          {erro && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm text-center">
              {erro}
            </div>
          )}

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

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-400">Esqueceu a senha?</a>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 mt-4 transition-colors"
          >
            {isLogin ? 'Login' : 'Cadastrar'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErro('');
            }} 
            className="text-sm text-gray-400 hover:text-white"
          >
            {isLogin ? 'Não tem conta? Cadastrar-se' : 'Já tem conta? Fazer Login'}
          </button>
        </div>
      </div>
    </div>
  );
}