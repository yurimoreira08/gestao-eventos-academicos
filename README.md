<h1 align="center">🎓 Gestão de Eventos Acadêmicos</h1>

<p align="center">
  Sistema completo e moderno para criação, gerenciamento e controle de participação em Eventos Acadêmicos, com emissão automática de certificados via PDF.
</p>

## ✨ Visão Geral

A plataforma foi arquitetada tendo o foco absoluto na **experiência do usuário** e fluidez. Organizadores podem criar eventos em segundos enriquecidos com banner, definir vagas e horários. Participantes encontram um painel limpo e direto ao ponto para realizar suas inscrições (Abertas ou Encerradas) de forma responsiva — seja no grandioso desktop ou na agilidade do celular.

Ao final do evento, o gestor pode trancá-lo com um único clique, auditar os presentes e disparar a geração oficial do **Certificado**. O participante não precisa procurar no Lixo Eletrônico do seu e-mail: o certificado já fica vitaliciamente associado e dispónível para impressão / download na sua conta na plataforma.

## 🚀 Funcionalidades

**Para o Participante:**
- 🔐 Login e Cadastro Seguro.
- 📱 Interface fluída e Responsiva.
- 🎟️ Listagem de "Eventos Abertos" e "Eventos Encerrados" (Bloqueio automático baseado em Data e Hora).
- 🏷️ Formulário prático de Inscrição (apenas Nome, Email e CPF - Formatado em tempo real).
- 🏅 Visualizador Nativo de Certificados (com geração nativa de PDF customizado omitindo menus e cabeçalhos).

**Para o Organizador (Admin do Evento):**
- 🖼️ Criação de evento com Banner customizado.
- ✏️ Painel Administrativo de "Edição" do Evento e "Exclusão" completa.
- 🛑 "Encerrar Evento": Transição de Status segura com travamento do Evento e liberação do Módulo de Avaliação.
- ✔️ Emissão de Certificados Manual: Liste, confira e selecione a dedo quem irá receber e o CPF atrelado, sem automatizações cegas. 

## 🛠️ Tecnologias Utilizadas

O projeto utiliza o que há de mais moderno na Stack React/Node:

*   **⚡ Framework Principal:** [Next.js (App Router)](https://nextjs.org/)
*   **🎨 Estilização:** [Tailwind CSS](https://tailwindcss.com/)
*   **🔥 Autenticação e Banco de Dados:** [Firebase (Auth & Firestore)](https://firebase.google.com/)
*   **✨ Ícones Limpos:** [Lucide React](https://lucide.dev/)

## 🔧 Como Testar Localmente (Localhost)

Para rodar este projeto na sua máquina e testar/modificar a lógica, siga os passos abaixo:

**1. Clone o Repositório:**
```sh
git clone https://seu-repositorio-aqui.git
cd gestao-eventos-academicos
```

**2. Instale as Dependências (NPM ou YARN):**
```sh
npm install
```

**3.  Credenciais do Firebase:**
O ambiente necessita de informações da nuvem. Crie o arquivo `.env.local` na raiz e preencha as suas chaves lá dentro:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx
```

**4. Inicie o Servidor Node:**
```sh
npm run dev
```

Abra `http://localhost:3000` no seu navegador!

> Desenvolvido para passar na matéria de Israel!