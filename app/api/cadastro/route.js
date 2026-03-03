"use client";
import { useState } from "react";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    instituicao: "",
    tipoPerfil: "Organizador",
    senha: "",
    confirmar: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmar) {
      alert("As senhas não coincidem");
      return;
    }

    await fetch("/api/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Conta criada!");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Crie sua conta</h1>
        <p>Sistema de Gestão de Eventos Acadêmicos</p>

        <form onSubmit={handleSubmit}>
          <div className="input">
            <label>Nome completo</label>
            <input name="nome" placeholder="Seu nome" onChange={handleChange} />
          </div>

          <div className="input">
            <label>E-mail institucional</label>
            <input name="email" placeholder="exemplo@instituicao.edu.br" onChange={handleChange} />
          </div>

          <div className="input">
            <label>CPF ou Documento</label>
            <input name="cpf" placeholder="000.000.000-00" onChange={handleChange} />
          </div>

          <div className="input">
            <label>Instituição</label>
            <input name="instituicao" placeholder="Nome da IES" onChange={handleChange} />
          </div>

          <label className="perfil-label">Tipo de perfil</label>
          <div className="perfil">
            <button
              type="button"
              className={form.tipoPerfil === "Organizador" ? "active" : ""}
              onClick={() =>
                setForm({ ...form, tipoPerfil: "Organizador" })
              }
            >
              Organizador
            </button>

            <button
              type="button"
              className={form.tipoPerfil === "Participante" ? "active" : ""}
              onClick={() =>
                setForm({ ...form, tipoPerfil: "Participante" })
              }
            >
              Participante
            </button>
          </div>

          <div className="row">
            <div className="input">
              <label>Senha</label>
              <input type="password" name="senha" onChange={handleChange} />
            </div>

            <div className="input">
              <label>Confirmar</label>
              <input type="password" name="confirmar" onChange={handleChange} />
            </div>
          </div>

          <button className="submit">Criar Minha Conta →</button>
        </form>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0b0f1a, #111827);
          padding: 40px;
        }

        .card {
          width: 720px;
          padding: 60px;
          background: #121826;
          border-radius: 28px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
          color: white;
        }

        h1 {
          font-size: 38px;
          margin-bottom: 10px;
        }

        p {
          color: #94a3b8;
          margin-bottom: 35px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          color: #cbd5e1;
        }

        input {
          height: 52px;
          padding: 0 18px;
          border-radius: 14px;
          border: 1px solid #1f2937;
          background: #1e293b;
          color: white;
          font-size: 15px;
          outline: none;
          transition: 0.3s;
        }

        input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        .perfil-label {
          margin-top: 10px;
        }

        .perfil {
          display: flex;
          gap: 15px;
        }

        .perfil button {
          flex: 1;
          height: 52px;
          border-radius: 14px;
          border: 1px solid #1f2937;
          background: #1e293b;
          color: white;
          cursor: pointer;
          transition: 0.3s;
          font-size: 15px;
        }

        .perfil button:hover {
          background: #273449;
        }

        .perfil .active {
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          border: none;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
        }

        .row {
          display: flex;
          gap: 20px;
        }

        .row .input {
          flex: 1;
        }

        .submit {
          margin-top: 20px;
          height: 58px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          font-size: 17px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: 0.3s;
        }

        .submit:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.5);
        }
      `}</style>
    </div>
  );
}