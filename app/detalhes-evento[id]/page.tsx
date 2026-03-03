'use client';

import React from 'react';
import Link from 'next/link';
// Caso não tenha o lucide-react instalado, rode: npm install lucide-react
import { Calendar, MapPin, Link as LinkIcon, ChevronLeft, Share2, LayoutGrid, PlusCircle, Award, Settings } from 'lucide-react';

export default function DetalhesEvento() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white pb-20">
      {/* Header com Imagem */}
      <div className="relative h-64 w-full bg-slate-800">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop" 
          alt="Palco do Evento" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button className="p-2 bg-black/50 rounded-full"><ChevronLeft size={20} /></button>
          <button className="p-2 bg-black/50 rounded-full"><Share2 size={20} /></button>
        </div>
      </div>

      <div className="p-5">
        <h1 className="text-2xl font-bold mb-2">Desafio de Programação Criativa: Lógica para Todos</h1>
        <p className="text-sm text-blue-400 mb-6">Organizado por Comunidade de Criadores Digitais <span className="text-blue-500">✔</span></p>

        {/* Cards de Informação */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center p-4 bg-[#1E293B] rounded-xl border border-slate-700">
            <Calendar className="text-blue-400 mr-4" size={24} />
            <div>
              <p className="font-semibold text-sm">Série de Encontros Semanais</p>
              <p className="text-xs text-slate-400">A partir de 24 de Outubro, 2024</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-[#1E293B] rounded-xl border border-slate-700">
            <MapPin className="text-blue-400 mr-4" size={24} />
            <div>
              <p className="font-semibold text-sm">Online e Presencial (Híbrido)</p>
              <p className="text-xs text-slate-400">Verifique locais parceiros</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-[#1E293B] rounded-xl border border-slate-700">
            <LinkIcon className="text-blue-400 mr-4" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-sm">Compartilhar Desafio</p>
              <p className="text-xs text-slate-400">Convide amigos para criar!</p>
            </div>
          </div>
        </div>

        {/* Sobre o Evento */}
        <h2 className="text-lg font-bold mb-3">Sobre o Evento</h2>
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          O Desafio de Programação Criativa convida entusiastas de todas as idades a explorar o universo da lógica através da criação de jogos educativos. Descubra como o pensamento computacional pode ser divertido e acessível!
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2 mb-8">
          <li>Oficina: Fundamentos da Lógica de Programação</li>
          <li>Mentoria: Desenho de Níveis com Desafios Lógicos</li>
          <li>Painel de Discussão: Gamificação na Educação</li>
        </ul>

        {/* Palestrantes */}
        <h2 className="text-lg font-bold mb-4">Palestrantes</h2>
        <div className="flex space-x-6 mb-8">
          {['Edu. Vance', 'Esp. J. Doe', 'Edu. S. Chen'].map((nome, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 mb-2 flex items-center justify-center text-xl font-bold">
                {nome.split(' ')[1][0]}
              </div>
              <span className="text-xs text-slate-300">{nome}</span>
            </div>
          ))}
        </div>

        {/* Botão de Inscrição */}
        {/* Ajuste o href para a rota onde você colocar a tela de pagamento */}
        <Link href="/pagamento" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 rounded-xl transition-colors">
            Inscreva-se Agora
        </Link>
      </div>

      {/* Menu Inferior Fixo (Simulação) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0B1120] border-t border-slate-800 p-4 flex justify-around text-slate-400">
        <div className="flex flex-col items-center"><LayoutGrid size={20} /><span className="text-[10px] mt-1">Dashboard</span></div>
        <div className="flex flex-col items-center text-blue-500"><Calendar size={20} /><span className="text-[10px] mt-1">Eventos</span></div>
        <div className="flex flex-col items-center"><PlusCircle size={20} /><span className="text-[10px] mt-1">Criar</span></div>
        <div className="flex flex-col items-center"><Award size={20} /><span className="text-[10px] mt-1">Certificados</span></div>
        <div className="flex flex-col items-center"><Settings size={20} /><span className="text-[10px] mt-1">Ajustes</span></div>
      </div>
    </div>
  );
}