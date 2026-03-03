import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .single();

    if (error || !user) {
      return NextResponse.json({ message: "E-mail ou senha incorretos." }, { status: 401 });
    }

    return NextResponse.json({ 
      message: "Sucesso!",
      user: { name: user.nome, role: user.papel }
    });
  } catch (error) {
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}