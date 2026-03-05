
import { NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventoId, userId, nome, email, cpf } = body;

    if (!eventoId || !userId || !nome || !email || !cpf) {
      return NextResponse.json(
        { error: 'Dados insuficientes fornecidos para a efetivação da inscrição. É necessário informar todos os campos (Nome, Email e CPF).' }, 
        { status: 400 }
      );
    }

    if (cpf.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido.' }, 
        { status: 400 }
      );
    }

    const q = query(
      collection(db, 'participacoes'), 
      where('eventoId', '==', eventoId), 
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return NextResponse.json(
        { error: 'O usuário informado já possui uma inscrição ativa neste evento.' }, 
        { status: 409 }
      );
    }

    await addDoc(collection(db, 'participacoes'), {
      eventoId,
      userId,
      nome,
      email,
      cpf,
      dataInscricao: new Date().toISOString(),
      certificadoEmitido: false
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Falha interna no servidor durante o processamento da inscrição:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno no servidor.' }, 
      { status: 500 }
    );
  }
}