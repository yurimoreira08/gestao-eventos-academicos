
'use client';

import { CalendarDays, PlusCircle, Award, Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const getNavClass = (path: string) => {
    return pathname === path ? 'text-blue-500' : 'text-gray-400 hover:text-gray-300';
  };

  return (
    <nav className="fixed bottom-0 w-full bg-[#0F172A]/95 backdrop-blur border-t border-gray-800 flex justify-center z-50">
      <div className="w-full max-w-md flex justify-between items-center px-8 py-3 pb-safe">
        <button onClick={() => router.push('/menu')} className={`flex flex-col items-center gap-1 ${getNavClass('/menu')}`}>
          <Home size={20} />
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <button onClick={() => router.push('/eventos')} className={`flex flex-col items-center gap-1 ${getNavClass('/eventos')}`}>
          <CalendarDays size={20} />
          <span className="text-[10px] font-medium">Eventos</span>
        </button>
        <button onClick={() => router.push('/criar_eventos')} className={`flex flex-col items-center gap-1 ${getNavClass('/criar_eventos')}`}>
          <PlusCircle size={20} />
          <span className="text-[10px] font-medium">Criar</span>
        </button>
        <button onClick={() => router.push('/certificados')} className={`flex flex-col items-center gap-1 ${getNavClass('/certificados')}`}>
          <Award size={20} />
          <span className="text-[10px] font-medium">Certificados</span>
        </button>
      </div>
    </nav>
  );
}