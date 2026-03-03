import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { submissaoId, nota, feedback, decisao } = await request.json();

    const { error } = await supabase
      .from('avaliacoes')
      .insert([{
        submissao_id: submissaoId === 'sub-123' ? null : submissaoId,
        nota,
        comentarios: `${decisao}: ${feedback}`
      }]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro na avaliação." }, { status: 500 });
  }
}