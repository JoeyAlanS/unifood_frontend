// src/pages/Entregador.jsx
import React, { useState } from "react";

const API_ENTREG = "https://reasonable-happiness-production.up.railway.app/api/entregadores";
const API_ENTREGAS = "https://reasonable-happiness-production.up.railway.app/api/deliveries";

export default function Entregador() {
  // ——— Consulta de status de entrega ———
  const [entregaIdQuery, setEntregaIdQuery] = useState("");
  const [statusConsulta, setStatusConsulta] = useState(null);
  const [loadingQuery, setLoadingQuery] = useState(false);

  // ——— Listagem de entregadores ———
  const [entregadores, setEntregadores] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // ——— Busca de entregador por ID ———
  const [idBuscar, setIdBuscar] = useState("");
  const [entregadorInfo, setEntregadorInfo] = useState(null);
  const [loadingBusca, setLoadingBusca] = useState(false);

  // ——— Busca de entregador por Nome ———
  const [nomeBuscar, setNomeBuscar] = useState("");
  const [resultadoNome, setResultadoNome] = useState([]);
  const [loadingNome, setLoadingNome] = useState(false);

  // ——— Atualização de disponibilidade ———
  const [idStatus, setIdStatus] = useState("");
  const [disponivel, setDisponivel] = useState("true");
  const [statusMsg, setStatusMsg] = useState("");

  // ——— Cadastro de entregador ———
  const [nomeCad, setNomeCad] = useState("");
  const [veiculoCad, setVeiculoCad] = useState("");
  const [rgCad, setRgCad] = useState("");
  const [cnhCad, setCnhCad] = useState("");
  const [seguroCad, setSeguroCad] = useState("");
  const [contaCad, setContaCad] = useState("");
  const [disponivelCad, setDisponivelCad] = useState(true);
  const [cadastroMsg, setCadastroMsg] = useState("");

  // ——— Atribuição de entrega ———
  const [orderIdAssign, setOrderIdAssign] = useState("");
  const [assignMsg, setAssignMsg] = useState("");

  // ——— Atualização de status da entrega ———
  const [entregaIdUpd, setEntregaIdUpd] = useState("");
  const [novoStatus, setNovoStatus] = useState("EM_ROTA");
  const [updEntregaMsg, setUpdEntregaMsg] = useState("");

  // —————————————————————————————————————————
  // Listar todos entregadores
  async function listarEntregadores() {
    setLoadingList(true);
    try {
      const res = await fetch(API_ENTREG);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntregadores(Array.isArray(data) ? data : []);
    } catch {
      setEntregadores([]);
      alert("Erro ao buscar entregadores.");
    } finally {
      setLoadingList(false);
    }
  }

  // —————————————————————————————————————————
  // Buscar entregador por ID
  async function buscarEntregador() {
    if (!idBuscar.trim()) {
      setEntregadorInfo({ error: "Informe o ID." });
      return;
    }
    setLoadingBusca(true);
    try {
      const res = await fetch(`${API_ENTREG}/${idBuscar}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntregadorInfo(data);
    } catch {
      setEntregadorInfo({ error: "Erro ao buscar entregador." });
    } finally {
      setLoadingBusca(false);
    }
  }

  // —————————————————————————————————————————
  // Buscar entregador por Nome
  async function buscarEntregadorPorNome() {
    if (!nomeBuscar.trim()) {
      setResultadoNome([{ error: "Informe o nome." }]);
      return;
    }
    setLoadingNome(true);
    try {
      const res = await fetch(API_ENTREG);
      if (!res.ok) throw new Error();
      const list = await res.json();
      const filtrados = Array.isArray(list)
        ? list.filter(e =>
          e.nome.toLowerCase().includes(nomeBuscar.toLowerCase())
        )
        : [];
      setResultadoNome(
        filtrados.length
          ? filtrados
          : [{ error: "Nenhum entregador encontrado." }]
      );
    } catch {
      setResultadoNome([{ error: "Erro ao buscar entregadores." }]);
    } finally {
      setLoadingNome(false);
    }
  }

  // —————————————————————————————————————————
  // Atualizar disponibilidade
  async function alterarStatus() {
    if (!idStatus.trim()) {
      setStatusMsg("Informe o ID.");
      return;
    }
    setStatusMsg("Atualizando...");
    try {
      const res = await fetch(
        `${API_ENTREG}/${idStatus}/status?disponivel=${disponivel}`,
        { method: "PUT" }
      );
      setStatusMsg(res.ok ? "Status atualizado!" : "Erro ao atualizar status.");
    } catch {
      setStatusMsg("Erro de conexão.");
    }
  }

  // —————————————————————————————————————————
  // Cadastrar entregador
  async function cadastrarEntregador() {
    if (
      !nomeCad ||
      !veiculoCad ||
      !rgCad ||
      !cnhCad ||
      !seguroCad ||
      !contaCad
    ) {
      setCadastroMsg("Por favor, preencha todos os campos.");
      return;
    }
    setCadastroMsg("Cadastrando...");
    try {
      const res = await fetch(API_ENTREG, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeCad,
          veiculo: veiculoCad,
          rg: rgCad,
          cnh: cnhCad,
          seguroVeiculo: seguroCad,
          contaBancaria: contaCad,
          disponivel: disponivelCad
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCadastroMsg(
        `Entregador "${data.nome}" cadastrado com ID ${data.id}!`
      );
      setNomeCad("");
      setVeiculoCad("");
      setRgCad("");
      setCnhCad("");
      setSeguroCad("");
      setContaCad("");
      setDisponivelCad(true);
    } catch {
      setCadastroMsg("Erro ao cadastrar entregador.");
    }
  }

  // —————————————————————————————————————————
  // Atribuir entrega a um pedido
  async function atribuirEntrega() {
    if (!orderIdAssign.trim()) {
      setAssignMsg("Informe o ID do pedido.");
      return;
    }
    setAssignMsg("Atribuindo...");
    try {
      const res = await fetch(`${API_ENTREGAS}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderIdAssign }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAssignMsg(
        `Entrega ${data.id} atribuída a entregador ${data.entregadorId}`
      );
    } catch {
      setAssignMsg("Erro ao atribuir entrega.");
    }
  }

  // —————————————————————————————————————————
  // Atualizar status da entrega
  async function atualizarStatusEntrega() {
    if (!entregaIdUpd.trim()) {
      setUpdEntregaMsg("Informe o ID da entrega.");
      return;
    }
    setUpdEntregaMsg("Atualizando status...");
    try {
      const res = await fetch(
        `${API_ENTREGAS}/${entregaIdUpd}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus }),
        }
      );
      if (!res.ok) throw new Error();
      setUpdEntregaMsg(`Status atualizado para ${novoStatus}.`);
    } catch {
      setUpdEntregaMsg("Erro ao atualizar status da entrega.");
    }
  }

  // —————————————————————————————————————————
  // Consultar status de entrega (pelo ID do ENTREGADOR)
  async function consultarStatusEntrega() {
    if (!entregaIdQuery.trim()) {
      setStatusConsulta({ error: "Informe o ID do entregador." });
      return;
    }
    setLoadingQuery(true);
    try {
      const resList = await fetch(
        `${API_ENTREGAS}/deliverer/${entregaIdQuery}/assignments`
      );
      if (!resList.ok) throw new Error();
      const lista = await resList.json();
      setStatusConsulta(
        Array.isArray(lista) && lista.length
          ? lista
          : { error: "Não há entregas em rota para este entregador." }
      );
    } catch {
      setStatusConsulta({ error: "Erro ao consultar entrega." });
    } finally {
      setLoadingQuery(false);
    }
  }


  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>🚴 Entregador</h2>

      {/* Listar todos */}
      <section style={{ marginTop: 20 }}>
        <h3>Listar Entregadores</h3>
        <button
          className="btn btn-primary"
          onClick={listarEntregadores}
          disabled={loadingList}
        >
          {loadingList ? "Carregando..." : "Listar Entregadores"}
        </button>
        {entregadores.map(e => (
          <div key={e.id} className="card p-2 my-2">
            <strong>{e.nome}</strong><br />
            ID: {e.id}<br />
            Veículo: {e.veiculo}<br />
            RG: {e.rg}<br />
            CNH: {e.cnh}<br />
            Seguro: {e.seguroVeiculo}<br />
            Conta: {e.contaBancaria}<br />
            Disponível: {e.disponivel ? "Sim" : "Não"}<br />
            Criado em: {new Date(e.criadoEm).toLocaleString()}<br />
            Atualizado em: {new Date(e.atualizadoEm).toLocaleString()}
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
        <button
          className="btn btn-primary mt-2"
          onClick={buscarEntregador}
          disabled={loadingBusca}
        >
          {loadingBusca ? "Buscando..." : "Buscar"}
        </button>
        {entregadorInfo?.error && (
          <p className="text-danger">{entregadorInfo.error}</p>
        )}
        {entregadorInfo && !entregadorInfo.error && (
          <div className="card p-2 my-2">
            <strong>{entregadorInfo.nome}</strong><br />
            ID: {entregadorInfo.id}<br />
            Veículo: {entregadorInfo.veiculo}<br />
            RG: {entregadorInfo.rg}<br />
            CNH: {entregadorInfo.cnh}<br />
            Seguro: {entregadorInfo.seguroVeiculo}<br />
            Conta: {entregadorInfo.contaBancaria}<br />
            Disponível: {entregadorInfo.disponivel ? "Sim" : "Não"}<br />
            Criado em: {new Date(entregadorInfo.criadoEm).toLocaleString()}<br />
            Atualizado em: {new Date(entregadorInfo.atualizadoEm).toLocaleString()}
          </div>
        )}
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
        <button
          className="btn btn-primary mt-2"
          onClick={buscarEntregadorPorNome}
          disabled={loadingNome}
        >
          {loadingNome ? "Buscando..." : "Buscar"}
        </button>
        {resultadoNome.map((e, i) =>
          e.error ? (
            <p key={i} className="text-danger">{e.error}</p>
          ) : (
            <div key={e.id} className="card p-2 my-2">
              <strong>{e.nome}</strong><br />
              ID: {e.id}<br />
              Disponível: {e.disponivel ? "Sim" : "Não"}<br />
              Criado em: {new Date(e.criadoEm).toLocaleString()}<br />
              Atualizado em: {new Date(e.atualizadoEm).toLocaleString()}
            </div>
          )
        )}
      </section>

      {/* Atualizar disponibilidade */}
      <section style={{ marginTop: 20 }}>
        <h3>🔄 Atualizar Disponibilidade</h3>
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
        {statusMsg && (
          <p className={statusMsg.startsWith("Erro") ? "text-danger" : "text-success"}>
            {statusMsg}
          </p>
        )}
      </section>

      {/* Cadastrar novo entregador */}
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
        <label className="form-check-label mt-2">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={disponivelCad}
            onChange={e => setDisponivelCad(e.target.checked)}
          />
          Disponível por padrão
        </label>
        <button className="btn btn-success mt-2" onClick={cadastrarEntregador}>
          Cadastrar
        </button>
        {cadastroMsg && (
          <p className={cadastroMsg.startsWith("Erro") ? "text-danger" : "text-success"}>
            {cadastroMsg}
          </p>
        )}
      </section>

      {/* Atribuir entrega */}
      <section style={{ marginTop: 30 }}>
        <h3>Atribuir Entrega a um Entregador</h3>
        <input
          className="form-control"
          placeholder="ID do Pedido"
          value={orderIdAssign}
          onChange={e => setOrderIdAssign(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={atribuirEntrega}>
          Atribuir Entrega
        </button>
        {assignMsg && (
          <p className={assignMsg.startsWith("Erro") ? "text-danger" : "text-success"}>
            {assignMsg}
          </p>
        )}
      </section>

      {/* ————— Verificar Status de Entrega ————— */}
      <section style={{ marginTop: 30 }}>
        <h3>Consultar Status de Entrega</h3>
        <input
          className="form-control"
          placeholder="ID do Entregador"
          value={entregaIdQuery}
          onChange={e => setEntregaIdQuery(e.target.value)}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={consultarStatusEntrega}
          disabled={loadingQuery}
        >
          {loadingQuery ? "Consultando..." : "Consultar Status"}
        </button>

        {statusConsulta?.error && (
          <p className="text-danger">{statusConsulta.error}</p>
        )}

        {Array.isArray(statusConsulta) && statusConsulta.map(ent => (
          <div key={ent.id} className="card p-2 my-2">
            <strong>Entrega ID:</strong> {ent.id}<br />
            <strong>Pedido ID:</strong> {ent.orderId}<br />
            <strong>Status:</strong> {ent.status}<br />
          </div>
        ))}
      </section>


      {/* Atualizar status da entrega */}
      <section style={{ marginTop: 30 }}>
        <h3>Atualizar Status da Entrega</h3>
        <input
          className="form-control"
          placeholder="ID da Entrega"
          value={entregaIdUpd}
          onChange={e => setEntregaIdUpd(e.target.value)}
        />
        <select
          className="form-control mt-2"
          value={novoStatus}
          onChange={e => setNovoStatus(e.target.value)}
        >
          <option value="EM_ROTA">EM_ROTA</option>
          <option value="ENTREGUE">ENTREGUE</option>
        </select>
        <button className="btn btn-primary mt-2" onClick={atualizarStatusEntrega}>
          Atualizar Status
        </button>
        {updEntregaMsg && (
          <p className={updEntregaMsg.startsWith("Erro") ? "text-danger" : "text-success"}>
            {updEntregaMsg}
          </p>
        )}
      </section>
    </div>
  );
}