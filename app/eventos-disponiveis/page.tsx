'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Calendar, MapPin, LayoutDashboard, PlusCircle, Award, Settings } from 'lucide-react';

export default function ListaEventos() {
  // Dados simulados para a apresentação baseados nos campos que seu amigo criou
  const eventosDisponiveis = [
    {
      id: '1',
      titulo: 'Desafio de Programação Criativa: Lógica para Todos',
      tipo: 'Congresso',
      data: '24 de Outubro, 2024',
      imagem: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
      pago: true
    },
    {
      id: '2',
      titulo: 'Simpósio de IA e o Futuro do Desenvolvimento',
      tipo: 'Simpósio',
      data: '05 de Novembro, 2024',
      imagem: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000&auto=format&fit=crop',
      pago: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center pb-24 font-sans">
      <div className="w-full max-w-md px-5 pt-8">
        
        {/* Header com Saudação */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-400 text-sm">Olá, Lorrany 👋</p>
            <h1 className="text-xl font-bold">Eventos Disponíveis</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            LA
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="Buscar eventos, palestras..."
            className="w-full bg-[#162032] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#3B82F6] transition"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        </div>

        {/* Lista de Eventos */}
        <div className="space-y-5">
          {eventosDisponiveis.map((evento) => (
            // AQUI ACONTECE A MÁGICA DA CONEXÃO!
            // O Link aponta para a rota da tela de Detalhes que você criou.
            // Ajuste o href="/detalhes-evento" para o nome exato da pasta onde está sua tela de detalhes.
            <Link href="/detalhes-evento" key={evento.id} className="block bg-[#162032] border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500 transition-colors">
              <div className="h-32 w-full relative">
                <img src={evento.imagem} alt={evento.titulo} className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-400">
                  {evento.tipo}
                </div>
                {evento.pago ? (
                  <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                    Pago
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-emerald-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                    Gratuito
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-bold text-sm mb-2 line-clamp-2">{evento.titulo}</h2>
                <div className="flex items-center text-xs text-slate-400 mb-1">
                  <Calendar size={14} className="mr-2 text-blue-400" />
                  {evento.data}
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <MapPin size={14} className="mr-2 text-blue-400" />
                  Híbrido (Online/Presencial)
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Bottom Navigation Bar (Igual ao do seu amigo para manter a consistência) */}
      <div className="fixed bottom-0 w-full max-w-md bg-[#0F172A] border-t border-slate-800 flex justify-between items-center px-6 py-3 pb-safe z-50">
        <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition">
          <LayoutDashboard size={20} className="mb-1" />
          <span className="text-[10px]">Dashboard</span>
        </button>
        <button className="flex flex-col items-center text-[#3B82F6] transition">
          <Calendar size={20} className="mb-1" />
          <span className="text-[10px]">Eventos</span>
        </button>
        <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition -mt-4">
          <div className="bg-[#0F172A] p-1 rounded-full">
            <div className="bg-slate-700 rounded-full p-2">
              <PlusCircle size={24} color="white" />
            </div>
          </div>
          <span className="text-[10px] mt-1">Criar</span>
        </button>
        <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition">
          <Award size={20} className="mb-1" />
          <span className="text-[10px]">Certificados</span>
        </button>
        <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition">
          <Settings size={20} className="mb-1" />
          <span className="text-[10px]">Ajustes</span>
        </button>
      </div>
    </div>
  );
}