// src/Pedidos.jsx
import React, { useEffect, useState } from "react";

const API_BASE_LOCAL = "http://localhost:8081/api/pedidos";
const API_BASE_PROD = "https://pedido-backend-production.up.railway.app/api/pedidos";

export default function Pedidos() {
  // --- Estados do fluxo principal ---
  const [cardapio, setCardapio] = useState([]);
  const [pedido, setPedido] = useState({ clienteId: "", itens: [] });
  const [tela, setTela] = useState("login");
  const [statusEntrega, setStatusEntrega] = useState(null);
  const [nomeCliente, setNomeCliente] = useState("Cliente");
  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [clientes, setClientes] = useState({});
  const [nomesEntregadores, setNomesEntregadores] = useState({});
  const [ultimoPedidoId, setUltimoPedidoId] = useState(null);

  // --- Estados da seção de JSON ---
  const [pedidoJson, setPedidoJson] = useState('');
  const [cadastroMensagem, setCadastroMensagem] = useState('');
  const [listaPedidosAll, setListaPedidosAll] = useState([]);
  const [clienteIdBusca, setClienteIdBusca] = useState('');
  const [listaPedidosClienteRaw, setListaPedidosClienteRaw] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingClienteRaw, setLoadingClienteRaw] = useState(false);

  // --- Login para cardápio ---
  const [clienteIdInput, setClienteIdInput] = useState("");
  const handleLogin = () => {
    if (!clienteIdInput.trim()) {
      alert("Informe o ID do cliente!");
      return;
    }
    setPedido(p => ({ ...p, clienteId: clienteIdInput }));
    setTela("cardapio");
  };

  // --- Busca nome cliente para saudação ---
  useEffect(() => {
    if (!pedido.clienteId) return;
    fetch(`${API_BASE_LOCAL}/cliente/${pedido.clienteId}/nome`)
      .then(res => res.json())
      .then(data => setNomeCliente(data.nome || "Cliente"))
      .catch(() => setNomeCliente("Cliente"));
  }, [pedido.clienteId]);

  // --- Carrega cardápio ---
  useEffect(() => {
    if (tela === "cardapio") {
      fetch(`${API_BASE_LOCAL}/itensCardapio`)
        .then(res => res.json())
        .then(data => setCardapio(Array.isArray(data) ? data : []))
        .catch(() => setCardapio([]));
    }
  }, [tela]);

  // --- Adicionar / remover itens ---
  const addItem = item => {
    const exists = pedido.itens.find(i => i.produtoId === item.id);
    const novos = exists
      ? pedido.itens.map(i =>
          i.produtoId === item.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        )
      : [
          ...pedido.itens,
          {
            produtoId: item.id,
            nomeProduto: item.nome,
            quantidade: 1,
            precoUnitario: item.preco,
          },
        ];
    setPedido(p => ({ ...p, itens: novos }));
  };
  const removeItem = id => {
    const novos = pedido.itens
      .map(i =>
        i.produtoId === id ? { ...i, quantidade: i.quantidade - 1 } : i
      )
      .filter(i => i.quantidade > 0);
    setPedido(p => ({ ...p, itens: novos }));
  };
  const valorTotal = pedido.itens.reduce(
    (acc, i) => acc + i.precoUnitario * i.quantidade,
    0
  );

  // --- Efetuar pedido ---
  const efetuarPedido = async () => {
    if (!pedido.itens.length) return;
    try {
      const res = await fetch(API_BASE_LOCAL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUltimoPedidoId(data.id);
      setTela("acompanhamento");
    } catch {
      alert("Erro ao efetuar pedido.");
    }
  };

  // --- Acompanhamento ---
  useEffect(() => {
    if (tela === "acompanhamento" && ultimoPedidoId) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE_LOCAL}/${ultimoPedidoId}`);
          const d = await res.json();
          let nomeEnt = "-";
          if (d.entregadorId) {
            const nr = await fetch(
              `${API_BASE_LOCAL}/entregador/${d.entregadorId}/nome`
            );
            const nd = await nr.json();
            nomeEnt = nd.nome || d.entregadorId;
          }
          setStatusEntrega({ entregador: nomeEnt, status: d.status });
        } catch {
          setStatusEntrega({
            entregador: "-",
            status: "Erro ao consultar status",
          });
        }
      })();
    }
  }, [tela, ultimoPedidoId]);

  const voltarParaCardapio = () => {
    setTela("cardapio");
    setPedido(p => ({ ...p, itens: [] }));
  };

  // --- Meus pedidos (dinâmico) ---
  const buscarPedidosCliente = async () => {
    try {
      const res = await fetch(
        `${API_BASE_LOCAL}/cliente/${pedido.clienteId}`
      );
      const data = await res.json();
      setPedidosCliente(Array.isArray(data) ? data : []);
      // nomes...
    } catch {
      alert("Erro ao buscar seus pedidos.");
    }
    setTela("pedidos");
  };

  // --- Seções de JSON CRUD ---
  const cadastrarPedidoJson = async () => {
    setCadastroMensagem("Carregando...");
    try {
      const res = await fetch(API_BASE_PROD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: pedidoJson,
      });
      setCadastroMensagem(
        res.ok
          ? " Pedido cadastrado com sucesso!"
          : " Erro ao cadastrar pedido."
      );
    } catch {
      setCadastroMensagem(" Erro de conexão.");
    }
  };

  const listarTodosOsPedidos = async () => {
    setLoadingAll(true);
    try {
      const res = await fetch(API_BASE_PROD);
      const data = await res.json();
      setListaPedidosAll(data);
    } catch {
      setListaPedidosAll([]);
    } finally {
      setLoadingAll(false);
    }
  };

  const buscarPorClienteRaw = async () => {
    if (!clienteIdBusca.trim()) return;
    setLoadingClienteRaw(true);
    try {
      const res = await fetch(`${API_BASE_PROD}/cliente/${clienteIdBusca}`);
      const data = await res.json();
      setListaPedidosClienteRaw(data);
    } catch {
      setListaPedidosClienteRaw([]);
    } finally {
      setLoadingClienteRaw(false);
    }
  };

  // --- Renderização ---
  if (tela === "login") {
    return (
      <div className="container mt-5">
        <h2>Identifique-se</h2>
        <input
          className="form-control mb-3"
          value={clienteIdInput}
          onChange={e => setClienteIdInput(e.target.value)}
          placeholder="ID do cliente"
        />
        <button className="btn btn-primary" onClick={handleLogin}>
          Entrar
        </button>
      </div>
    );
  }

  if (tela === "acompanhamento") {
    return (
      <div className="container mt-5">
        <h2>Acompanhamento</h2>
        {!statusEntrega ? (
          <p>Carregando status...</p>
        ) : (
          <div className="card p-3">
            <p>Entregador: {statusEntrega.entregador}</p>
            <p>Status: {statusEntrega.status}</p>
          </div>
        )}
        <button className="btn btn-secondary mt-3" onClick={voltarParaCardapio}>
          Voltar ao Cardápio
        </button>
      </div>
    );
  }

  if (tela === "pedidos") {
    return (
      <div className="container mt-5">
        <h2>Meus Pedidos</h2>
        {pedidosCliente.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Itens</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pedidosCliente.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.itens.map(i => (
                      <div key={i.produtoId}>
                        {i.nomeProduto} (x{i.quantidade})
                      </div>
                    ))}
                  </td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="btn btn-secondary" onClick={voltarParaCardapio}>
          Voltar ao Cardápio
        </button>
      </div>
    );
  }

  // --- Tela de cardápio e JSON juntos ---
  return (
    <div className="container mt-5">
      {/* Cardápio */}
      <h2>Cardápio</h2>
      <div className="row">
        {cardapio.map(item => (
          <div key={item.id} className="col-md-4 mb-3">
            <div className="card p-2">
              <h5>{item.nome}</h5>
              <p>R$ {item.preco.toFixed(2)}</p>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => addItem(item)}
              >
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Montar pedido */}
      <h3>🛒 Meu Pedido</h3>
      {pedido.itens.length === 0 ? (
        <p>Nenhum item adicionado.</p>
      ) : (
        <ul className="list-group mb-3">
          {pedido.itens.map(i => (
            <li key={i.produtoId} className="list-group-item d-flex justify-content-between">
              {i.nomeProduto} x{i.quantidade}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => removeItem(i.produtoId)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: <strong>R$ {valorTotal.toFixed(2)}</strong></p>
      <button
        className="btn btn-success mb-4"
        onClick={efetuarPedido}
        disabled={!pedido.itens.length}
      >
        Efetuar Pedido
      </button>

      {/* Seções estáticas JSON */}
      <hr/>
      <h2>JSON CRUD (fallback)</h2>

      <div className="section mb-4">
        <h5>Cadastrar Pedido (JSON)</h5>
        <textarea
          className="form-control mb-2"
          rows={3}
          placeholder='{"clienteId":"abc123","itens":["item1"]}'
          value={pedidoJson}
          onChange={e => setPedidoJson(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={cadastrarPedidoJson}>
          Cadastrar via JSON
        </button>
        {cadastroMensagem && <p className="mt-2">{cadastroMensagem}</p>}
      </div>

      <div className="section mb-4">
        <h5>Listar Todos os Pedidos</h5>
        <button className="btn btn-outline-secondary" onClick={listarTodosOsPedidos}>
          Listar Todos
        </button>
        {loadingAll ? (
          <p>Carregando...</p>
        ) : (
          listaPedidosAll.map(p => (
            <div key={p.id} className="card p-2 mb-2">
              <strong>ID:</strong> {p.id} — <strong>Status:</strong> {p.status}
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h5>Buscar Pedidos por Cliente (JSON)</h5>
        <input
          className="form-control mb-2"
          placeholder="ID do Cliente"
          value={clienteIdBusca}
          onChange={e => setClienteIdBusca(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={buscarPorClienteRaw}>
          Buscar
        </button>
        {loadingClienteRaw ? (
          <p>Carregando...</p>
        ) : (
          listaPedidosClienteRaw.map(p => (
            <div key={p.id} className="card p-2 mb-2">
              <strong>ID:</strong> {p.id} — <strong>Status:</strong> {p.status}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
