import { NextRequest, NextResponse } from 'next/server';

// Ó a mágica aqui: a gente tipa o request como NextRequest
export async function POST(request: NextRequest) {
  try {
    // O Next.js já pega os arquivos e textos direto do FormData
    const formData = await request.formData();
    
    const titulo = formData.get('titulo');
    const autores = formData.get('autores');
    const resumo = formData.get('resumo');
    const arquivo = formData.get('arquivo');

    // Validação básica
    if (!titulo || !autores || !resumo || !arquivo) {
      console.warn("Submissão incompleta recebida.");
      return NextResponse.json(
        { sucesso: false, erro: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    console.log("Chegou na base, patrão!");
    console.log("Dados da submissão:", { titulo, autores, resumo });
    console.log("Arquivo recebido:", (arquivo as File).name || 'Arquivo sem nome');

    return NextResponse.json(
      { sucesso: true, mensagem: 'Trabalho submetido com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na API de submissão:", error);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro interno ao submeter o trabalho.' },
      { status: 500 }
    );
  }
}