import React, { useState } from "react";

const API = "https://reasonable-happiness-production.up.railway.app/api/entregadores";

export default function Entregador() {
  const [entregadores, setEntregadores] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [idBuscar, setIdBuscar] = useState("");
  const [entregadorInfo, setEntregadorInfo] = useState(null);
  const [loadingBusca, setLoadingBusca] = useState(false);

  const [nomeBuscar, setNomeBuscar] = useState("");
  const [resultadoNome, setResultadoNome] = useState([]);
  const [loadingNome, setLoadingNome] = useState(false);

  const [idStatus, setIdStatus] = useState("");
  const [disponivel, setDisponivel] = useState("true");
  const [statusMsg, setStatusMsg] = useState("");

  const [nomeCad, setNomeCad] = useState("");
  const [veiculoCad, setVeiculoCad] = useState("");
  const [rgCad, setRgCad] = useState("");
  const [cnhCad, setCnhCad] = useState("");
  const [seguroCad, setSeguroCad] = useState("");
  const [contaCad, setContaCad] = useState("");
  const [cadastroMsg, setCadastroMsg] = useState("");

  // Listar entregadores disponíveis
  async function listarEntregadores() {
    setLoadingList(true);
    try {
      const res = await fetch(`${API}/disponiveis`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntregadores(data);
    } catch {
      setEntregadores([]);
      alert("Erro ao buscar entregadores.");
    } finally {
      setLoadingList(false);
    }
  }

  // Buscar por ID
  async function buscarEntregador() {
    if (!idBuscar.trim()) return setEntregadorInfo({ error: "Informe o ID." });
    setLoadingBusca(true);
    try {
      const res = await fetch(`${API}/${idBuscar}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntregadorInfo(data);
    } catch {
      setEntregadorInfo({ error: "Erro ao buscar entregador." });
    } finally {
      setLoadingBusca(false);
    }
  }

  // Buscar por nome
  async function buscarEntregadorPorNome() {
    if (!nomeBuscar.trim()) return setResultadoNome([{ error: "Informe o nome." }]);
    setLoadingNome(true);
    try {
      const res = await fetch(`${API}/disponiveis`);
      const list = await res.json();
      const filtrados = list.filter(e =>
        e.nome.toLowerCase().includes(nomeBuscar.toLowerCase())
      );
      setResultadoNome(
        filtrados.length ? filtrados : [{ error: "Nenhum entregador encontrado." }]
      );
    } catch {
      setResultadoNome([{ error: "Erro ao buscar entregadores." }]);
    } finally {
      setLoadingNome(false);
    }
  }

  // Atualizar disponibilidade
  async function alterarStatus() {
    if (!idStatus.trim()) return setStatusMsg("Informe o ID.");
    setStatusMsg("Atualizando...");
    try {
      const res = await fetch(
        `${API}/${idStatus}/status?disponivel=${disponivel}`,
        { method: "PUT" }
      );
      setStatusMsg(res.ok ? "Status atualizado!" : "Erro ao atualizar status.");
    } catch {
      setStatusMsg("Erro de conexão.");
    }
  }

  // Cadastrar entregador
  async function cadastrarEntregador() {
    if (!nomeCad || !veiculoCad || !rgCad || !cnhCad || !seguroCad || !contaCad) {
      return setCadastroMsg("Por favor, preencha todos os campos.");
    }
    setCadastroMsg("Cadastrando...");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeCad,
          veiculo: veiculoCad,
          rg: rgCad,
          cnh: cnhCad,
          seguroVeiculo: seguroCad,
          contaBancaria: contaCad,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCadastroMsg(`Entregador "${data.nome}" cadastrado com ID ${data.id}!`);
      setNomeCad("");
      setVeiculoCad("");
      setRgCad("");
      setCnhCad("");
      setSeguroCad("");
      setContaCad("");
    } catch {
      setCadastroMsg("Erro ao cadastrar entregador.");
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>Entregador</h2>

      {/* Listar */}
      <section style={{ marginTop: 20 }}>
        <h3>Listar Entregadores Disponíveis</h3>
        <button className="btn btn-primary" onClick={listarEntregadores} disabled={loadingList}>
          {loadingList ? "Carregando..." : "Listar Entregadores"}
        </button>
        {entregadores.map(e => (
          <div key={e.id} className="card">
            <strong>{e.nome}</strong><br />
            ID: {e.id}<br />
            Status: {e.disponivel ? "Disponível" : "Indisponível"}
          </div>
        ))}
      </section>

      {/* Buscar por ID */}
      <section style={{ marginTop: 20 }}>
        <h3>Buscar Entregador por ID</h3>
        <input
          className="form-control"
          placeholder="ID do Entregador"
          value={idBuscar}
          onChange={e => setIdBuscar(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={buscarEntregador} disabled={loadingBusca}>
          {loadingBusca ? "Buscando..." : "Buscar"}
        </button>
        {entregadorInfo?.error ? (
          <p className="text-danger">{entregadorInfo.error}</p>
        ) : entregadorInfo ? (
          <div className="card">
            <strong>{entregadorInfo.nome}</strong><br />
            ID: {entregadorInfo.id}<br />
            Status: {entregadorInfo.disponivel ? "Disponível" : "Indisponível"}
          </div>
        ) : null}
      </section>

      {/* Buscar por Nome */}
      <section style={{ marginTop: 20 }}>
        <h3>Buscar Entregador por Nome</h3>
        <input
          className="form-control"
          placeholder="Nome do Entregador"
          value={nomeBuscar}
          onChange={e => setNomeBuscar(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={buscarEntregadorPorNome} disabled={loadingNome}>
          {loadingNome ? "Buscando..." : "Buscar"}
        </button>
        {resultadoNome.map((e, i) =>
          e.error ? (
            <p key={i} className="text-danger">{e.error}</p>
          ) : (
            <div key={e.id} className="card">
              <strong>{e.nome}</strong><br />
              ID: {e.id}<br />
              Status: {e.disponivel ? "Disponível" : "Indisponível"}
            </div>
          )
        )}
      </section>

      {/* Atualizar status */}
      <section style={{ marginTop: 20 }}>
        <h3>Atualizar Disponibilidade</h3>
        <input
          className="form-control"
          placeholder="ID do Entregador"
          value={idStatus}
          onChange={e => setIdStatus(e.target.value)}
        />
        <select
          className="form-control mt-2"
          value={disponivel}
          onChange={e => setDisponivel(e.target.value)}
        >
          <option value="true">Disponível</option>
          <option value="false">Indisponível</option>
        </select>
        <button className="btn btn-primary mt-2" onClick={alterarStatus}>
          Atualizar Status
        </button>
        {statusMsg && <p className={statusMsg.startsWith("Erro") ? "text-danger" : "text-success"}>{statusMsg}</p>}
      </section>

      {/* Cadastrar */}
      <section style={{ marginTop: 20 }}>
        <h3>Cadastrar Entregador</h3>
        <input
          className="form-control"
          placeholder="Nome"
          value={nomeCad}
          onChange={e => setNomeCad(e.target.value)}
        />
        <input
          className="form-control mt-2"
          placeholder="Veículo"
          value={veiculoCad}
          onChange={e => setVeiculoCad(e.target.value)}
        />
        <input
          className="form-control mt-2"
          placeholder="RG"
          value={rgCad}
          onChange={e => setRgCad(e.target.value)}
        />
        <input
          className="form-control mt-2"
          placeholder="CNH"
          value={cnhCad}
          onChange={e => setCnhCad(e.target.value)}
        />
        <input
          className="form-control mt-2"
          placeholder="Seguro do Veículo"
          value={seguroCad}
          onChange={e => setSeguroCad(e.target.value)}
        />
        <input
          className="form-control mt-2"
          placeholder="Conta Bancária"
          value={contaCad}
          onChange={e => setContaCad(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={cadastrarEntregador}>
          Cadastrar
        </button>
        {cadastroMsg && <p className={cadastroMsg.startsWith("") ? "text-danger" : "text-success"}>{cadastroMsg}</p>}
      </section>
    </div>
  );
}
