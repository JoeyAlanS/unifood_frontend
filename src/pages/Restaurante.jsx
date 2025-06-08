// src/Restaurante.jsx
import React, { useState } from "react";

const API = "https://restaurante-production-7756.up.railway.app/restaurante";

export default function Restaurante() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [categoria, setCategoria] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cadastroMensagem, setCadastroMensagem] = useState("");

  const [restaurantes, setRestaurantes] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [idDeletar, setIdDeletar] = useState("");
  const [deleteMensagem, setDeleteMensagem] = useState("");

  // Cadastrar restaurante
  async function handleCadastro(e) {
    e.preventDefault();
    setCadastroMensagem("Cadastrando...");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cnpj, categoria, endereco }),
      });
      if (res.ok) {
        setCadastroMensagem(" Restaurante cadastrado com sucesso!");
        setNome("");
        setCnpj("");
        setCategoria("");
        setEndereco("");
      } else {
        setCadastroMensagem(" Erro ao cadastrar restaurante.");
      }
    } catch {
      setCadastroMensagem(" Erro de conexão.");
    }
  }

  // Listar restaurantes
  async function listarRestaurantes() {
    setLoadingList(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setRestaurantes(data);
    } catch {
      setRestaurantes([]);
      alert("Erro ao buscar restaurantes.");
    } finally {
      setLoadingList(false);
    }
  }

  // Deletar restaurante
  async function deletarRestaurante() {
    if (!idDeletar.trim()) {
      setDeleteMensagem(" Informe o ID.");
      return;
    }
    setDeleteMensagem("Deletando...");
    try {
      const res = await fetch(`${API}/${idDeletar}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteMensagem(" Restaurante deletado.");
        setIdDeletar("");
      } else {
        setDeleteMensagem(" Erro ao deletar restaurante.");
      }
    } catch {
      setDeleteMensagem(" Erro de conexão.");
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2> Restaurante</h2>

      {/* Cadastrar */}
      <section style={{ marginTop: 20 }}>
        <h3>Cadastrar Restaurante</h3>
        <form onSubmit={handleCadastro}>
          <input
            className="form-control"
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <input
            className="form-control mt-2"
            placeholder="CNPJ"
            value={cnpj}
            onChange={e => setCnpj(e.target.value)}
            required
          />
          <input
            className="form-control mt-2"
            placeholder="Categoria"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            required
          />
          <input
            className="form-control mt-2"
            placeholder="Endereço"
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            required
          />
          <button className="btn btn-primary mt-2" type="submit">
            Cadastrar
          </button>
        </form>
        {cadastroMensagem && (
          <p className={cadastroMensagem.startsWith("") ? "text-danger" : "text-success"}>
            {cadastroMensagem}
          </p>
        )}
      </section>

      {/* Listar */}
      <section style={{ marginTop: 20 }}>
        <h3>📋 Restaurantes Cadastrados</h3>
        <button className="btn btn-secondary" onClick={listarRestaurantes} disabled={loadingList}>
          {loadingList ? "Carregando..." : "Listar Restaurantes"}
        </button>
        {restaurantes.map(r => (
          <div key={r.id} className="card mt-2 p-2">
            <strong>ID:</strong> {r.id}
            <br />
            <strong>{r.nome}</strong>
            <br />
            CNPJ: {r.cnpj}
            <br />
            Categoria: {r.categoria}
            <br />
            Endereço: {r.endereco}
          </div>
        ))}
      </section>

      {/* Deletar */}
      <section style={{ marginTop: 20 }}>
        <h3> Deletar Restaurante</h3>
        <input
          className="form-control"
          placeholder="ID do Restaurante para Deletar"
          value={idDeletar}
          onChange={e => setIdDeletar(e.target.value)}
        />
        <button className="btn btn-danger mt-2" onClick={deletarRestaurante}>
          Deletar Restaurante
        </button>
        {deleteMensagem && (
          <p className={deleteMensagem.startsWith("") ? "text-danger" : "text-success"}>
            {deleteMensagem}
          </p>
        )}
      </section>
    </div>
  );
}
