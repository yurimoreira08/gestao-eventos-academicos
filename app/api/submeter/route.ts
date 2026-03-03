import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Puxa o primeiro evento e usuário disponíveis para garantir o vínculo no banco
    const { data: evento } = await supabase.from('eventos').select('id').limit(1).single();
    const { data: usuario } = await supabase.from('usuarios').select('id').limit(1).single();

    const { error } = await supabase
      .from('submissoes')
      .insert([{
        titulo_trabalho: formData.get('titulo'),
        arquivo_url: (formData.get('arquivo') as File)?.name || 'sem_arquivo.pdf',
        evento_id: evento?.id,
        usuario_id: usuario?.id,
        status: 'em_analise'
      }]);

    if (error) throw error;

    return NextResponse.json({ sucesso: true, mensagem: 'Trabalho gravado no banco!' });
  } catch (error) {
    return NextResponse.json({ sucesso: false, erro: 'Erro na submissão.' }, { status: 500 });
  }
}