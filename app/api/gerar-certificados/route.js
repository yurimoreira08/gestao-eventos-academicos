import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { participantesIds, modeloId } = body;

    // 1. Validação de segurança
    if (!participantesIds || participantesIds.length === 0) {
      return NextResponse.json(
        { message: "Nenhum participante foi selecionado para emissão." },
        { status: 400 }
      );
    }

    // 2. Lógica de Negócio (Simulação)
    // Aqui você integraria com bibliotecas como 'jspdf' ou 'canvas'
    // E usaria o seu PostgreSQL para registrar a data de emissão.
    console.log(`Iniciando geração de ${participantesIds.length} certificados.`);
    console.log(`Modelo utilizado: ${modeloId}`);

    // Simula o tempo de processamento de múltiplos documentos
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 3. Resposta de Sucesso
    return NextResponse.json({
      success: true,
      count: participantesIds.length,
      message: `Sucesso! ${participantesIds.length} certificados foram enviados para a fila de e-mails.`,
    }, { status: 200 });

  } catch (error) {
    console.error("Erro na API de Certificados:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro interno ao gerar os documentos." },
      { status: 500 }
    );
  }
}