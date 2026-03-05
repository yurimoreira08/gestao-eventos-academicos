
import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, descricao, dataInicio, horaInicio, dataFim, horaFim, imagemBase64, creatorId } = body;

    if (!titulo || !descricao || !dataInicio || !horaInicio || !dataFim || !horaFim || !creatorId) {
      return NextResponse.json(
        { error: 'Dados incompletos fornecidos na requisição.' }, 
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'eventos'), {
      titulo,
      descricao,
      dataInicio,
      horaInicio,
      dataFim,
      horaFim,
      imagem: imagemBase64 || null,
      creatorId,
      status: 'ativo',
      criadoEm: new Date().toISOString() 
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
    
  } catch (error) {
    console.error('Falha interna no processamento da requisição:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno no servidor.' }, 
      { status: 500 }
    );
  }
}