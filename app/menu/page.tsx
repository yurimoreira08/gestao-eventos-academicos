
'use client';

import { useRouter } from 'next/navigation';
import { CalendarDays, PlusCircle, Award, Sparkles } from 'lucide-react';
import BottomNav from '@/app/components/BottomNav';

export default function MenuPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24 font-sans">
      
      <header className="w-full max-w-5xl mx-auto p-8 pt-16 pb-8 bg-[#1E293B]/40 md:rounded-b-[2.5rem] border-b border-gray-800 shadow-xl lg:mt-4 lg:rounded-t-[2.5rem]">
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">Olá, bem-vindo!</h1>
          <p className="text-gray-400 mt-2 text-sm max-w-md leading-relaxed md:mx-0 mx-auto">O que vamos fazer na plataforma hoje?</p>
        </div>
      </header>

      <main className="p-6 mt-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">

        <button
          onClick={() => router.push('/eventos')}
          className="w-full bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-gray-700 hover:border-blue-500 rounded-2xl p-6 flex items-center gap-5 transition-all text-left group shadow-lg"
        >
          <div className="bg-blue-500/20 p-4 rounded-2xl group-hover:bg-blue-500/40 transition-colors">
            <CalendarDays className="text-blue-400" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Eventos</h2>
            <p className="text-sm text-gray-400 mt-1">Explore e participe dos desafios e palestras.</p>
          </div>
        </button>

        <button
          onClick={() => router.push('/criar_eventos')}
          className="w-full bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-gray-700 hover:border-green-500/50 rounded-2xl p-6 flex items-center gap-5 transition-all text-left group shadow-lg"
        >
          <div className="bg-green-500/20 p-4 rounded-2xl group-hover:bg-green-500/40 transition-colors">
            <PlusCircle className="text-green-400" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Criar Evento</h2>
            <p className="text-sm text-gray-400 mt-1">Publique seu próprio evento acadêmico.</p>
          </div>
        </button>

        <button
          onClick={() => router.push('/certificados')}
          className="w-full bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-gray-700 hover:border-yellow-500/50 rounded-2xl p-6 flex items-center gap-5 transition-all text-left group shadow-lg"
        >
          <div className="bg-yellow-500/20 p-4 rounded-2xl group-hover:bg-yellow-500/40 transition-colors">
            <Award className="text-yellow-400" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Certificados</h2>
            <p className="text-sm text-gray-400 mt-1">Acesse e emita os certificados dos eventos.</p>
          </div>
        </button>

      </main>

      <BottomNav />
    </div>
  );
}