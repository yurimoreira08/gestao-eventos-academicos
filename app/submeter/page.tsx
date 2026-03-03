'use client'; // Tem que ter isso pra usar os hooks (useState) no Next.js

import { useState, ChangeEvent, FormEvent } from 'react';
import { ChevronLeft, Plus, UploadCloud, Send } from 'lucide-react';

export default function SubmeterTrabalho() {
  const [titulo, setTitulo] = useState('');
  const [autores, setAutores] = useState('');
  const [resumo, setResumo] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);

  const contarPalavras = (texto: string) => {
    return texto.trim() ? texto.trim().split(/\s+/).length : 0;
  };

  const totalPalavras = contarPalavras(resumo);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArquivo(e.target.files[0]);
    }
  };

  const enviarTrabalho = async (e: FormEvent) => {
    e.preventDefault();

    if (!titulo || !autores || !resumo || !arquivo) {
      alert("Opa! Preenche tudo aí, meu fi!");
      return;
    }

    if (totalPalavras > 300) {
      alert("O resumo tá muito grande! O máximo é 300 palavras.");
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('autores', autores);
    formData.append('resumo', resumo);
    formData.append('arquivo', arquivo);

    try {
      // Mandando a papelada pra nossa rota de API ali de cima
      const response = await fetch('/api/submeter', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.sucesso) {
        alert(data.mensagem);
      } else {
        alert("Deu ruim no servidor.");
      }
    } catch (error) {
      console.error("Erro na submissão:", error);
      alert("Vish, a conexão foi de arrasta pra cima.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 flex justify-center">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-4">
          <button className="p-2 hover:bg-slate-800 rounded-full transition"><ChevronLeft size={24} /></button>
          <h1 className="text-lg font-bold">Submeter Trabalho</h1>
          <div className="w-10"></div> {/* Espaçador */}
        </div>

        <form onSubmit={enviarTrabalho} className="space-y-6">
          
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold mb-2">Título do Trabalho</label>
            <input 
              type="text" 
              placeholder="Ex: Impacto da IA na Educação"
              className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Autores */}
          <div>
            <label className="block text-sm font-semibold mb-2">Autores</label>
            <input 
              type="text" 
              placeholder="Nome completo do autor"
              className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition mb-3"
              value={autores}
              onChange={(e) => setAutores(e.target.value)}
            />
            <button type="button" className="w-full flex items-center justify-center border border-slate-700 border-dashed rounded-lg p-3 text-blue-500 hover:bg-slate-800 transition">
              <Plus size={18} className="mr-2" />
              <span className="text-sm font-medium">Adicionar outro autor</span>
            </button>
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-sm font-semibold mb-2">Resumo</label>
            <div className="relative">
              <textarea 
                placeholder="Digite um resumo do seu trabalho (máx. 300 palavras)"
                className={`w-full bg-[#1E293B] border rounded-lg p-3 text-sm h-32 resize-none focus:outline-none transition ${totalPalavras > 300 ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'}`}
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
              />
              <span className={`absolute bottom-3 right-3 text-xs ${totalPalavras > 300 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {totalPalavras}/300 palavras
              </span>
            </div>
          </div>

          {/* Upload de Arquivo */}
          <div>
            <label className="block text-sm font-semibold mb-2">Carregar Arquivo</label>
            <label className="w-full flex flex-col items-center justify-center border border-slate-700 border-dashed rounded-lg p-8 bg-[#1E293B] hover:bg-slate-800 transition cursor-pointer">
              <UploadCloud size={32} className="text-slate-400 mb-3" />
              {arquivo ? (
                <span className="text-blue-500 font-medium">{arquivo.name}</span>
              ) : (
                <>
                  <span className="text-slate-400 text-sm mb-1">
                    Arraste e solte ou <span className="text-blue-500 font-medium">clique para selecionar</span>
                  </span>
                  <span className="text-slate-500 text-xs">Formatos aceitos: PDF, PPTX, DOCX</span>
                </>
              )}
              {/* Input escondido, o label que faz a mágica do clique */}
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.pptx,.docx"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Botão Enviar */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg flex items-center justify-center transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={totalPalavras > 300}
          >
            <Send size={18} className="mr-2" />
            Enviar Trabalho
          </button>
        </form>

      </div>
    </div>
  );
}