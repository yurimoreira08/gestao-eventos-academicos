'use client';
// 1. Importamos os tipos necessários do React
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Cadastro() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '', email: '', documento: '', instituicao: '', tipo: 'Organizador', senha: '', confirmar: ''
  });

  // 2. Definimos que 'e' é um evento de formulário (FormEvent)
  const handleCadastro = async (e: FormEvent) => {
    e.preventDefault();
    
    if (form.senha !== form.confirmar) {
      return alert("As senhas não conferem!");
    }

    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("Conta criada com sucesso!");
        router.push('/login');
      } else {
        alert("Erro ao realizar cadastro.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[500px] bg-[#111827] p-10 rounded-3xl shadow-2xl border border-white/5">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Crie sua conta</h1>
          <p className="text-slate-500 text-sm font-medium">Sistema de Gestão de Eventos Acadêmicos</p>
        </header>

        <form onSubmit={handleCadastro} className="space-y-5">
          <div>
            <label className="text-slate-400 text-xs font-bold uppercase ml-1">Nome completo</label>
            {/* 3. Definimos que 'e' é um evento de mudança em um Input (ChangeEvent) */}
            <input type="text" placeholder="Seu nome" className="w-full bg-[#1f2937] border-none p-4 rounded-xl text-white mt-1" 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({...form, nome: e.target.value})} required />
          </div>

          <div>
            <label className="text-slate-400 text-xs font-bold uppercase ml-1">E-mail institucional</label>
            <input type="email" placeholder="exemplo@instituicao.edu.br" className="w-full bg-[#1f2937] border-none p-4 rounded-xl text-white mt-1" 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({...form, email: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase ml-1">CPF ou Documento</label>
              <input type="text" placeholder="000.000.000-00" className="w-full bg-[#1f2937] border-none p-4 rounded-xl text-white mt-1 text-sm" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({...form, documento: e.target.value})} />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase ml-1">Instituição</label>
              <input type="text" placeholder="Nome da IES" className="w-full bg-[#1f2937] border-none p-4 rounded-xl text-white mt-1 text-sm" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({...form, instituicao: e.target.value})} />
            </div>
          </div>
          
          {/* ... resto do formulário (lembre-se de adicionar o (e: ChangeEvent<HTMLInputElement>) nos outros inputs também!) */}
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-600/20 mt-4">
            Criar Minha Conta →
          </button>
        </form>
      </div>
    </div>
  );
}