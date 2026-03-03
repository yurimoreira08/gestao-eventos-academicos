'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, MoreHorizontal, Search, QrCode, ScanLine, Users } from 'lucide-react';

/**
 * Interface representing the participant object consumed by the front-end application.
 */
interface Participant {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  paymentStatus: 'PAGO' | 'PENDENTE';
  isCheckedIn: boolean;
}

export default function Confirmados() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches the dynamic list of participants from the API endpoint upon component initialization.
   */
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/participantes');
        if (response.ok) {
          const data = await response.json();
          setParticipants(data);
        }
      } catch (error) {
        console.error('Failed to load participants from the server:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  /**
   * Updates the check-in status of a specific participant in the local state.
   * Note: In a production environment, this should also trigger a PUT/PATCH request to the API.
   * * @param {string} id - The unique identifier of the participant.
   */
  const handleToggleCheckIn = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isCheckedIn: !p.isCheckedIn } : p))
    );
  };

  /**
   * Derives a filtered list of participants based on the current search query.
   */
  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalParticipants = participants.length;
  const presentParticipants = participants.filter((p) => p.isCheckedIn).length;
  const pendingCheckins = totalParticipants - presentParticipants;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center pb-24 relative">
      <div className="w-full max-w-md px-5 pt-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <button className="p-2 hover:bg-slate-800 rounded-full transition">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Confirmados</h1>
          <button className="p-2 hover:bg-slate-800 rounded-full transition">
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-[#1E2E4A] border border-[#2A3F63] rounded-xl p-4">
            <h2 className="text-[#3B82F6] text-xs font-bold tracking-wider mb-1">PRESENTES</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#3B82F6]">{presentParticipants}</span>
              <span className="text-slate-400 text-sm">/{totalParticipants}</span>
            </div>
          </div>
          <div className="flex-1 bg-[#1E293B] rounded-xl p-4">
            <h2 className="text-slate-400 text-xs font-bold tracking-wider mb-1">PENDENTES</h2>
            <div className="text-3xl font-bold">{pendingCheckins}</div>
          </div>
        </div>

        {/* Search Input Section */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail"
              className="w-full bg-[#1E293B] text-sm text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading || totalParticipants === 0}
            />
          </div>
        </div>

        {/* List Header */}
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="text-lg font-bold">Participantes ({totalParticipants})</h3>
          {totalParticipants > 0 && (
            <span className="text-slate-400 text-xs font-bold tracking-wider">CHECK-IN</span>
          )}
        </div>

        {/* Dynamic Participants List / Empty State Handling */}
        <div className="space-y-1">
          {isLoading ? (
             <p className="text-center text-slate-400 mt-10">Carregando dados...</p>
          ) : totalParticipants === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Users size={48} className="mb-4 opacity-50" />
              <p className="text-center font-medium">Nenhum participante cadastrado ainda.</p>
              <p className="text-center text-sm mt-1">A lista será atualizada automaticamente.</p>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <p className="text-center text-slate-400 mt-10">Nenhum participante encontrado na busca.</p>
          ) : (
            filteredParticipants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between py-3 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <img src={participant.avatarUrl} alt={participant.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-base">{participant.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400 text-xs">{participant.email}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${participant.paymentStatus === 'PAGO' ? 'bg-[#064E3B] text-[#34D399]' : 'bg-[#78350F] text-[#FBBF24]'}`}>
                        {participant.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleCheckIn(participant.id)}
                  className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${participant.isCheckedIn ? 'bg-[#3B82F6]' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${participant.isCheckedIn ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}