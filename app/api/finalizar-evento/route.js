import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Busca informações do evento e arquivos anexados
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const res = await query('SELECT * FROM eventos WHERE id = $1', [id]);
    const evento = res.rows[0];

    // Simulação de metadados de arquivos (Poderiam vir de uma tabela 'anexos')
    const relatorios = [
      { id: 1, title: "Relatório de Presença", desc: "CSV • 124 KB", icon: "📊", url: `/api/download?type=presenca&id=${id}` },
      { id: 2, title: "Resumo Financeiro", desc: "PDF • 2.4 MB", icon: "💰", url: `/api/download?type=financeiro&id=${id}` },
      { id: 3, title: "Feedback Palestrantes", desc: "PDF • 850 KB", icon: "✍️", url: `/api/download?type=feedback&id=${id}` }
    ];

    return NextResponse.json({ evento, relatorios });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar ao PostgreSQL" }, { status: 500 });
  }
}

// POST: Executa o bloqueio de segurança "Status de Integridade"
export async function POST(request) {
  try {
    const { eventoId } = await request.json();

    // Bloqueia o evento no banco de dados
    await query(
      "UPDATE eventos SET status = 'BLOQUEADO' WHERE id = $1",
      [eventoId]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Dados bloqueados com sucesso no SportConnect." 
    });
  } catch (error) {
    return NextResponse.json({ error: "Falha na transação de bloqueio" }, { status: 500 });
  }
}