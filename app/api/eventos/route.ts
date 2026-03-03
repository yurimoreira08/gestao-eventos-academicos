import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Insere os dados diretos no Supabase
    const { data, error } = await supabase
      .from('eventos')
      .insert([{
        titulo: formData.get('titulo'),
        tipo: formData.get('tipo'),
        descricao: formData.get('descricao'),
        data_inicio: formData.get('dataInicio') || null,
        hora_inicio: formData.get('horaInicio') || null,
        data_fim: formData.get('dataFim') || null,
        hora_fim: formData.get('horaFim') || null,
        evento_pago: formData.get('eventoPago') === 'true',
        status: 'ativo'
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Evento salvo no banco com sucesso!' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar evento:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor.' }, { status: 500 });
  }
}