'use client';

import { useState } from 'react';
import { Camera, Calendar, LayoutDashboard, PlusCircle, Award, Settings, ChevronDown } from 'lucide-react';

/**
 * Defines the available categories for event participants.
 */
const PARTICIPANT_TYPES = ['Estudantes', 'Professores', 'Pesquisadores', 'Público Geral'];

export default function CriarEvento() {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(['Professores', 'Pesquisadores']);
  const [isPaid, setIsPaid] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  /**
   * Toggles the selection state of a specific participant category.
   * * @param {string} type - The participant category identifier to be toggled.
   */
  const toggleParticipant = (type: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  /**
   * Handles the file input change event to securely capture the selected image.
   * * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event object.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  /**
   * Asynchronously submits the form data to the underlying API endpoint.
   * Constructs a FormData object to handle both scalar properties and binary file data.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('tipo', tipo);
    formData.append('descricao', descricao);
    formData.append('dataInicio', dataInicio);
    formData.append('horaInicio', horaInicio);
    formData.append('dataFim', dataFim);
    formData.append('horaFim', horaFim);
    formData.append('participantes', JSON.stringify(selectedParticipants));
    formData.append('eventoPago', String(isPaid));
    
    if (imageFile) {
      formData.append('imagem', imageFile);
    }

    try {
      const response = await fetch('/api/eventos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Evento publicado com sucesso!');
      } else {
        alert('Falha ao publicar evento.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center pb-24 relative font-sans">
      <div className="w-full max-w-md px-5 pt-8">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-[#3B82F6] font-medium text-sm">Cancelar</button>
          <h1 className="text-base font-bold">Criar Evento Acadêmico</h1>
          <button onClick={handleSubmit} className="text-[#3B82F6] font-medium text-sm">Criar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload Area */}
          <label className="flex flex-col items-center justify-center border border-slate-700 border-dashed rounded-xl p-8 bg-[#162032] hover:bg-slate-800 transition cursor-pointer">
            <Camera size={32} className="text-[#3B82F6] mb-3" />
            <span className="text-sm font-bold mb-1">Carregar Imagem do Evento</span>
            <span className="text-slate-400 text-xs mb-4">Recomendado: 1200x630px (Máx 5MB)</span>
            <div className="bg-[#1E2E4A] text-[#3B82F6] text-xs font-bold py-2 px-4 rounded-lg">
              {imageFile ? imageFile.name : 'Selecionar Imagem'}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>

          {/* Event Details Inputs */}
          <div>
            <label className="block text-sm font-bold mb-2">Título do Evento</label>
            <input 
              type="text" 
              placeholder="ex: Congresso Anual de Neurociência"
              className="w-full bg-[#162032] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#3B82F6] transition"
              value={titulo} onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Tipo de Evento</label>
            <div className="relative">
              <select 
                className="w-full bg-[#162032] border border-slate-700 rounded-lg p-3 text-sm appearance-none focus:outline-none focus:border-[#3B82F6] transition"
                value={tipo} onChange={(e) => setTipo(e.target.value)}
              >
                <option value="" disabled>Escolha o tipo</option>
                <option value="simposio">Simpósio</option>
                <option value="congresso">Congresso</option>
                <option value="palestra">Palestra</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Descrição</label>
            <textarea 
              placeholder="Descreva a agenda, palestrantes e objetivos principais..."
              className="w-full bg-[#162032] border border-slate-700 rounded-lg p-3 text-sm h-28 resize-none focus:outline-none focus:border-[#3B82F6] transition"
              value={descricao} onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Date and Time Grid */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-400 mb-3">DATA E HORA</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Início (Data)</label>
                <input type="date" className="w-full bg-[#162032] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#3B82F6] text-slate-300" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Início (Hora)</label>
                <input type="time" className="w-full bg-[#162032] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#3B82F6] text-slate-300" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Fim (Data)</label>
                <input type="date" className="w-full bg-[#162032] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#3B82F6] text-slate-300" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Fim (Hora)</label>
                <input type="time" className="w-full bg-[#162032] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#3B82F6] text-slate-300" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Participant Types Chips */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-400 mb-3">TIPOS DE PARTICIPANTES</label>
            <div className="flex flex-wrap gap-2">
              {PARTICIPANT_TYPES.map((ptype) => (
                <button
                  key={ptype}
                  type="button"
                  onClick={() => toggleParticipant(ptype)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedParticipants.includes(ptype) 
                      ? 'bg-[#3B82F6] text-white' 
                      : 'bg-[#162032] text-slate-300 border border-slate-700'
                  }`}
                >
                  {ptype}
                </button>
              ))}
            </div>
          </div>

          {/* Paid Event Toggle */}
          <div className="bg-[#162032] border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">Evento Pago</h4>
              <p className="text-xs text-slate-400 mt-0.5">Ative para cobrar inscrições (Gratuito por padrão)</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPaid(!isPaid)}
              className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${isPaid ? 'bg-[#3B82F6]' : 'bg-slate-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isPaid ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Publish Button */}
          <button type="submit" className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition shadow-lg mt-2">
            Publicar Evento Acadêmico
          </button>
          
          <p className="text-center text-xs text-slate-500 mt-4 pb-6">
            Ao publicar, você concorda com os Termos de Serviço da Plataforma Acadêmica.
          </p>
        </form>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full max-w-md bg-[#0F172A] border-t border-slate-800 flex justify-between items-center px-6 py-3 pb-safe">
        <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition">
          <LayoutDashboard size={20} className="mb-1" />
          <span className="text-[10px]">Dashboard</span>
        </button>
        <button className="flex flex-col items-center text-slate-500 hover:text-slate-300 transition">
          <Calendar size={20} className="mb-1" />
          <span className="text-[10px]">Eventos</span>
        </button>
        <button className="flex flex-col items-center text-[#3B82F6] transition -mt-4">
          <div className="bg-[#0F172A] p-1 rounded-full">
            <div className="bg-[#3B82F6] rounded-full p-2">
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