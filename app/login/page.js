'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redireciona para a tela de certificados que organizamos
        router.push('/gerar-certificado');
      } else {
        setErro(data.message || 'Erro ao realizar login');
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px] space-y-8 text-center">
        
        {/* Header de Boas-vindas */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Bem-vindo,<br />Organizador!
          </h1>
          <p className="text-slate-400 text-sm">Faça login para gerenciar seu evento.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          {/* Campo Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
            <input
              type="email"
              placeholder="seu.email@exemplo.com"
              required
              className="w-full p-4 bg-[#161e31] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full p-4 bg-[#161e31] border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <div className="flex justify-end">
              <button type="button" className="text-xs text-blue-500 hover:underline">Esqueceu a senha?</button>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs text-center font-bold">
              {erro}
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={carregando}
            className={`w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] ${carregando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {carregando ? 'Autenticando...' : 'Login'}
          </button>
        </form>

        <button className="text-slate-400 text-sm hover:text-white transition-colors">
          Cadastrar-se
        </button>
      </div>
    </div>
  );
}