'use client';

import React, { useState } from 'react';
import { ChevronLeft, User, Mail, GraduationCap, CreditCard, Barcode, QrCode, ArrowRight } from 'lucide-react';
import Link from 'next/link';
// Aqui nós importamos a sua conexão com o banco!
import { supabase } from '@/lib/supabase';

export default function CadastroPagamento() {
  const [metodoSelecionado, setMetodoSelecionado] = useState('cartao');
  const [isProcessando, setIsProcessando] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    instituicao: ''
  });

  const handleConfirmarPagamento = async () => {
    if (!formData.nome || !formData.email || !formData.instituicao) {
      alert("Por favor, preencha todos os seus dados antes de confirmar!");
      return;
    }

    setIsProcessando(true);

    try {
      // 1. Pega o ID do evento que a gente cadastrou no painel (Caminho Feliz da apresentação)
      const { data: evento, error: erroEvento } = await supabase
        .from('eventos')
        .select('id')
        .limit(1)
        .single();

      if (erroEvento || !evento) throw new Error("Nenhum evento encontrado no banco.");

      // 2. Salva o Usuário no banco
      // Usamos upsert para o sistema não quebrar se você testar duas vezes com o mesmo e-mail na apresentação
      const { data: usuario, error: erroUsuario } = await supabase
        .from('usuarios')
        .upsert(
          { nome: formData.nome, email: formData.email, instituicao: formData.instituicao, senha: '123' },
          { onConflict: 'email' }
        )
        .select()
        .single();

      if (erroUsuario || !usuario) throw new Error("Erro ao salvar os dados do usuário.");

      // 3. Salva a Inscrição conectando o Usuário e o Evento!
      const { error: erroInscricao } = await supabase
        .from('inscricoes')
        .insert({
          evento_id: evento.id,
          usuario_id: usuario.id,
          metodo_pagamento: metodoSelecionado,
          status_pagamento: 'confirmado'
        });

      if (erroInscricao) throw new Error("Erro ao registrar a inscrição.");

      // Se tudo deu certo, comemora e limpa a tela!
      alert(`Sucesso! A inscrição de ${formData.nome} foi salva no banco de dados! 🎉`);
      setFormData({ nome: '', email: '', instituicao: '' });

    } catch (error: any) {
      console.error(error);
      alert("Ops! Algo deu errado: " + error.message);
    } finally {
      setIsProcessando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-5 pb-24 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        <div className="flex items-center mb-8 w-full">
          {/* Lembre-se de checar se o link de voltar está apontando para a pasta certa da sua tela de detalhes */}
          <Link href="/detalhes-evento" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-blue-500" />
          </Link>
          <h1 className="text-xl font-bold mx-auto pr-8">Cadastro e Pagamento</h1>
        </div>

        <div className="mb-8 w-full">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Passo 3 de 3: Finalização</span>
            <span className="text-blue-400">Última etapa</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 w-full h-full rounded-full"></div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-lg font-bold mb-1">Seus Dados ✨</h2>
          <p className="text-sm text-slate-400 mb-4">Preencha suas informações para o certificado e futuros eventos.</p>
          
          <div className="space-y-4 mb-10">
            <div className="flex items-center p-3 bg-[#0F172A] rounded-xl border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <div className="bg-indigo-500/20 p-3 rounded-full mr-4"><User className="text-indigo-400" size={20} /></div>
              <div className="flex-1">
                <label className="text-xs text-indigo-300/70 block mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Ex: Lorrany Araújo"
                  className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-slate-600"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-[#0F172A] rounded-xl border border-slate-700 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 transition-all">
              <div className="bg-pink-500/20 p-3 rounded-full mr-4"><Mail className="text-pink-400" size={20} /></div>
              <div className="flex-1">
                <label className="text-xs text-pink-300/70 block mb-1">E-mail</label>
                <input 
                  type="email" 
                  placeholder="Ex: lorrany@ifpi.edu.br"
                  className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-slate-600"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center p-3 bg-[#0F172A] rounded-xl border border-slate-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <div className="bg-emerald-500/20 p-3 rounded-full mr-4"><GraduationCap className="text-emerald-400" size={20} /></div>
              <div className="flex-1">
                <label className="text-xs text-emerald-300/70 block mb-1">Instituição de Ensino</label>
                <input 
                  type="text" 
                  placeholder="Ex: IFPI - Campus Picos"
                  className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-slate-600"
                  value={formData.instituicao}
                  onChange={(e) => setFormData({...formData, instituicao: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-lg font-bold mb-1">Métodos de Pagamento</h2>
          <p className="text-sm text-slate-400 mb-4">Selecione como deseja pagar</p>
          
          <div className="space-y-3 mb-8">
            <div 
              onClick={() => setMetodoSelecionado('cartao')}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${metodoSelecionado === 'cartao' ? 'bg-[#1E293B] border-blue-500' : 'bg-[#0F172A] border-slate-800 hover:bg-[#151f33]'}`}
            >
              <CreditCard className={`${metodoSelecionado === 'cartao' ? 'text-blue-400' : 'text-slate-500'} mr-4`} size={24} />
              <div className="flex-1">
                <p className={`font-semibold text-sm ${metodoSelecionado === 'cartao' ? 'text-white' : 'text-slate-300'}`}>Cartão de Crédito</p>
                <p className="text-xs text-slate-500">Visa, Mastercard, Elo</p>
              </div>
              {metodoSelecionado === 'cartao' ? 
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div> : 
                <div className="w-5 h-5 border border-slate-600 rounded-full"></div>
              }
            </div>

            <div 
              onClick={() => setMetodoSelecionado('boleto')}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${metodoSelecionado === 'boleto' ? 'bg-[#1E293B] border-blue-500' : 'bg-[#0F172A] border-slate-800 hover:bg-[#151f33]'}`}
            >
              <Barcode className={`${metodoSelecionado === 'boleto' ? 'text-blue-400' : 'text-slate-500'} mr-4`} size={24} />
              <div className="flex-1">
                <p className={`font-semibold text-sm ${metodoSelecionado === 'boleto' ? 'text-white' : 'text-slate-300'}`}>Boleto</p>
                <p className="text-xs text-slate-500">Pagável em qualquer banco</p>
              </div>
              {metodoSelecionado === 'boleto' ? 
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div> : 
                <div className="w-5 h-5 border border-slate-600 rounded-full"></div>
              }
            </div>

            <div 
              onClick={() => setMetodoSelecionado('pix')}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${metodoSelecionado === 'pix' ? 'bg-[#1E293B] border-blue-500' : 'bg-[#0F172A] border-slate-800 hover:bg-[#151f33]'}`}
            >
              <QrCode className={`${metodoSelecionado === 'pix' ? 'text-blue-400' : 'text-slate-500'} mr-4`} size={24} />
              <div className="flex-1">
                <p className={`font-semibold text-sm ${metodoSelecionado === 'pix' ? 'text-white' : 'text-slate-300'}`}>Pix</p>
                <p className="text-xs text-slate-500">Confirmação instantânea</p>
              </div>
              {metodoSelecionado === 'pix' ? 
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div> : 
                <div className="w-5 h-5 border border-slate-600 rounded-full"></div>
              }
            </div>
          </div>

          <div className="flex justify-between items-end mb-10 pt-4 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Valor Total</p>
              <p className="text-3xl font-bold">R$ 150,00</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Taxa de Inscrição</p>
              <p className="text-xs text-blue-400">Tarifa Acadêmica</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0B1120] p-4 border-t border-slate-800 flex justify-center">
        <div className="w-full max-w-2xl">
          <p className="text-center text-[10px] text-slate-500 mb-3 flex items-center justify-center">
            🔒 Transação segura com criptografia SSL
          </p>
          <button 
            onClick={handleConfirmarPagamento}
            disabled={isProcessando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all"
          >
            {isProcessando ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando Inscrição...
              </span>
            ) : (
              <span className="flex items-center">
                Confirmar Pagamento <ArrowRight className="ml-2" size={20} />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}