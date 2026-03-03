import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Captura o email e senha enviados pelo front-end
    const { email, senha } = await request.json();

    // Validação com os dados do Yuri que você definiu
    // No futuro, aqui você faria uma busca no PostgreSQL
    if (email === "yuri@gmail.com" && senha === "123") {
      return NextResponse.json({ 
        message: "Login realizado com sucesso!",
        user: { name: "Yuri Moreira", role: "Organizador" }
      }, { status: 200 });
    }

    // Se os dados estiverem errados
    return NextResponse.json(
      { message: "E-mail ou senha incorretos." }, 
      { status: 401 }
    );

  } catch (error) {
    // Erro de servidor (ex: JSON malformado)
    return NextResponse.json(
      { message: "Erro interno no servidor." }, 
      { status: 500 }
    );
  }
}