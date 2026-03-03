'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, MapPin, LayoutDashboard, PlusCircle, Award, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 

export default function ListaEventos() {
  const [eventosDisponiveis, setEventosDisponiveis] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarEventos() {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('status', 'ativo'); 

      if (error) {
        console.error('Erro ao buscar do Supabase:', error);
      } else if (data) {
        setEventosDisponiveis(data);
      }
      setCarregando(false);
    }

    buscarEventos();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center pb-24 font-sans">
      
      {/* max-w-6xl permite que a tela fique larga no PC, mas não estoure nos cantos */}
      <div className="w-full max-w-6xl px-5 md:px-8 pt-8 md:pt-12">
        
        <div className="flex items-center justify-between mb-8">
          <div>
    
            {/* Texto um pouco maior no PC */}
            <h1 className="text-2xl md:text-3xl font-bold">Eventos Disponíveis</h1>
          </div>
          {/* Avatar um pouco maior no PC */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold md:text-lg">LA</div>
        </div>

        {/* Barra de pesquisa com largura máxima no PC para não esticar demais */}
        <div className="relative mb-10 w-full md:max-w-md">
          <input 
            type="text" 
            placeholder="Buscar eventos, palestras..."
            className="w-full bg-[#162032] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#3B82F6] transition"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        </div>

        {/* GRID RESPONSIVO: 1 coluna (Mobile), 2 colunas (Tablet), 3 colunas (PC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carregando ? (
            <p className="text-slate-400 text-sm col-span-full">Carregando eventos...</p>
          ) : eventosDisponiveis.length === 0 ? (
            <p className="text-slate-400 text-sm col-span-full">Nenhum evento disponível no momento.</p>
          ) : (
            eventosDisponiveis.map((evento) => (
              <Link href="/detalhes-evento" key={evento.id} className="block bg-[#162032] border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500 transition-colors">
                {/* Altura da imagem um pouco maior no PC (md:h-48) */}
                <div className="h-40 md:h-48 w-full relative">
                  <img src={evento.imagem_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop'} alt={evento.titulo} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-400">
                    {evento.tipo}
                  </div>
                  {evento.evento_pago ? (
                    <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white">Pago</div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-emerald-600 px-3 py-1 rounded-full text-xs font-bold text-white">Gratuito</div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-base md:text-lg mb-2 line-clamp-2">{evento.titulo}</h2>
                  <div className="flex items-center text-xs md:text-sm text-slate-400 mb-2">
                    <Calendar size={16} className="mr-2 text-blue-400" />
                    {evento.data_inicio ? new Date(evento.data_inicio).toLocaleDateString('pt-BR') : 'Data a definir'}
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-slate-400">
                    <MapPin size={16} className="mr-2 text-blue-400" />
                    Híbrido (Online/Presencial)
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Menu Inferior: Agora ele se estende pela tela e centraliza os ícones no PC */}
      <div className="fixed bottom-0 w-full bg-[#0F172A] border-t border-slate-800 z-50">
        <div className="max-w-6xl mx-auto flex justify-between md:justify-around items-center px-6 py-3 pb-safe">
          <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition">
            <LayoutDashboard size={20} className="mb-1" />
            <span className="text-[10px] md:text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center text-[#3B82F6] transition">
            <Calendar size={20} className="mb-1" />
            <span className="text-[10px] md:text-xs">Eventos</span>
          </button>
          <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition -mt-4 md:-mt-6">
            <div className="bg-[#0F172A] p-1 rounded-full">
              <div className="bg-slate-700 hover:bg-slate-600 rounded-full p-2 md:p-3 transition-colors">
                <PlusCircle size={24} className="md:w-7 md:h-7" color="white" />
              </div>
            </div>
            <span className="text-[10px] md:text-xs mt-1">Criar</span>
          </button>
          <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition">
            <Award size={20} className="mb-1" />
            <span className="text-[10px] md:text-xs">Certificados</span>
          </button>
          <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition">
            <Settings size={20} className="mb-1" />
            <span className="text-[10px] md:text-xs">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  );
}