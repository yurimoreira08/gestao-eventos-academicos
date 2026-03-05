
import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventoId, userId } = body;

    if (!eventoId || !userId) {
      return NextResponse.json({ error: 'Parâmetros insuficientes.' }, { status: 400 });
    }

    const docRef = doc(db, 'eventos', eventoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }

    if (docSnap.data().creatorId !== userId) {
      return NextResponse.json({ error: 'Acesso negado: Você não é o organizador.' }, { status: 403 });
    }

    await updateDoc(docRef, {
      status: 'finalizado',
      finalizadoEm: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Evento encerrado com sucesso.' });
  } catch (error) {
    console.error('Erro na API de finalização:', error);
    return NextResponse.json({ error: 'Falha interna no servidor.' }, { status: 500 });
  }
}