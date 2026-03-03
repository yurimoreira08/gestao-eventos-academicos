import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Busca dados cruzados entre inscrições e usuários
    const { data, error } = await supabase
      .from('inscricoes')
      .select(`
        id,
        status_pagamento,
        usuarios ( id, nome, email )
      `);

    if (error) throw error;

    // Formata para o padrão que a sua tela de Confirmados espera
    const participants = data.map((item: any) => ({
      id: item.usuarios.id,
      name: item.usuarios.nome,
      email: item.usuarios.email,
      avatarUrl: `https://i.pravatar.cc/150?u=${item.usuarios.email}`,
      paymentStatus: item.status_pagamento === 'confirmado' ? 'PAGO' : 'PENDENTE',
      isCheckedIn: false 
    }));

    return NextResponse.json(participants, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro ao buscar dados.' }, { status: 500 });
  }
}