
import { NextResponse } from 'next/server';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { participantesIds } = body;

    if (!participantesIds || !Array.isArray(participantesIds) || participantesIds.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum participante foi selecionado para a emissão.' }, 
        { status: 400 }
      );
    }

    const batch = writeBatch(db);

    participantesIds.forEach((id: string) => {
      const participacaoRef = doc(db, 'participacoes', id);
      batch.update(participacaoRef, {
        certificadoEmitido: true,
        dataEmissao: new Date().toISOString()
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true, message: 'Certificados emitidos com sucesso.' });
  } catch (error) {
    console.error('Falha interna durante a emissão em lote de certificados:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno no processamento dos certificados.' }, 
      { status: 500 }
    );
  }
}