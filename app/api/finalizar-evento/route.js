import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Puxa o último evento cadastrado para a apresentação
    const { data: evento } = await supabase
      .from('eventos')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(1)
      .single();

    const relatorios = [
      { id: 1, title: "Relatório de Presença", desc: "CSV • 124 KB", icon: "📊", url: "#" },
      { id: 2, title: "Resumo Financeiro", desc: "PDF • 2.4 MB", icon: "💰", url: "#" },
      { id: 3, title: "Feedback Palestrantes", desc: "PDF • 850 KB", icon: "✍️", url: "#" }
    ];

    return NextResponse.json({ evento, relatorios });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { eventoId } = await request.json();
    // Atualiza o status no Supabase
    const { error } = await supabase
      .from('eventos')
      .update({ status: 'BLOQUEADO' })
      .eq('id', eventoId);

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Evento bloqueado no banco." });
  } catch (error) {
    return NextResponse.json({ error: "Falha ao bloquear" }, { status: 500 });
  }
}