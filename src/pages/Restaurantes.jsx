"use client"

import { useState, useEffect } from "react"

export default function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([])
  const [restauranteSelecionadoId, setRestauranteSelecionadoId] = useState(null)
  const [itensCardapio, setItensCardapio] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [showCardapio, setShowCardapio] = useState(false)

  const [nome, setNome] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [categoria, setCategoria] = useState("")
  const [endereco, setEndereco] = useState("")

  const [nomeItem, setNomeItem] = useState("")
  const [precoItem, setPrecoItem] = useState("")
  const [descricaoItem, setDescricaoItem] = useState("")

  const BASE_URL = "https://restaurante-production-7756.up.railway.app"

  const carregarRestaurantes = async () => {
    try {
      const resposta = await fetch(`${BASE_URL}/restaurante`)
      const data = await resposta.json()
      setRestaurantes(data)
    } catch (erro) {
      console.error("Erro ao carregar restaurantes:", erro)
    }
  }

  const carregarPedidos = async () => {
    try {
      const resposta = await fetch(`${BASE_URL}/restaurante/pedidos`)
      if (!resposta.ok) throw new Error("Erro ao carregar pedidos")
      const data = await resposta.json()
      setPedidos(data)
    } catch (erro) {
      console.error("Erro ao buscar pedidos:", erro)
    }
  }

  const carregarCardapio = async (restauranteId) => {
    setRestauranteSelecionadoId(restauranteId)
    try {
      const resposta = await fetch(`${BASE_URL}/itensCardapio/restaurante/${restauranteId}`)
      const data = await resposta.json()
      setItensCardapio(data)
      setShowCardapio(true)
    } catch (erro) {
      console.error("Erro ao carregar cardápio:", erro)
    }
  }

  const handleSubmitRestaurante = async (e) => {
    e.preventDefault()
    const novoRestaurante = { nome, cnpj, categoria, endereco }

    try {
      const resposta = await fetch(`${BASE_URL}/restaurante`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoRestaurante),
      })

      if (!resposta.ok) throw new Error("Erro ao adicionar restaurante")

      setNome("")
      setCnpj("")
      setCategoria("")
      setEndereco("")
      await carregarRestaurantes()
    } catch (erro) {
      console.error(erro)
    }
  }

  const excluirRestaurante = async (id) => {
    if (window.confirm("Deseja realmente excluir este restaurante?")) {
      try {
        const resposta = await fetch(`${BASE_URL}/restaurante/${id}`, {
          method: "DELETE",
        })
        if (!resposta.ok) throw new Error("Erro ao excluir restaurante")
        await carregarRestaurantes()
      } catch (erro) {
        console.error("Erro ao excluir restaurante:", erro)
      }
    }
  }

  const handleSubmitCardapio = async (e) => {
    e.preventDefault()
    const novoItem = {
      nome: nomeItem,
      descricao: descricaoItem,
      preco: Number.parseFloat(precoItem),
      restauranteId: restauranteSelecionadoId,
    }

    try {
      const resposta = await fetch(`${BASE_URL}/itensCardapio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoItem),
      })

      if (!resposta.ok) throw new Error("Erro ao adicionar item")

      setNomeItem("")
      setPrecoItem("")
      setDescricaoItem("")
      await carregarCardapio(restauranteSelecionadoId)
    } catch (erro) {
      console.error("Erro ao adicionar item ao cardápio:", erro)
    }
  }

  const excluirItemCardapio = async (itemId) => {
    try {
      const resposta = await fetch(`${BASE_URL}/itensCardapio/${itemId}`, {
        method: "DELETE",
      })
      if (!resposta.ok) throw new Error("Erro ao excluir item")
      await carregarCardapio(restauranteSelecionadoId)
    } catch (erro) {
      console.error("Erro ao excluir item do cardápio:", erro)
    }
  }

  const atribuirEntrega = async (orderId) => {
    try {
      const resposta = await fetch(
        `${BASE_URL}/restaurante/atribuir-entrega/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }
      );
      if (!resposta.ok) throw new Error("Erro ao atribuir entrega");
      alert("Entrega atribuída com sucesso!");
      await carregarPedidos();
    } catch (erro) {
      alert("Erro ao atribuir entrega.");
      console.error(erro);
    }
  }

  useEffect(() => {
    carregarRestaurantes()
    carregarPedidos()
  }, [])

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />

      <div className="container my-4">
        <h1 className="text-center text-primary mb-4">Lista de Restaurantes</h1>

        <ul className="list-group mb-4">
          {restaurantes.map((restaurante) => (
            <li key={restaurante.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => carregarCardapio(restaurante.id)}
              >
                {restaurante.nome} - {restaurante.categoria} - {restaurante.endereco}
              </span>
              <button className="btn btn-sm btn-danger" onClick={() => excluirRestaurante(restaurante.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>

        {showCardapio && (
          <div className="mt-5">
            <h2 className="text-primary">
              Cardápio de <span>{restaurantes.find((r) => r.id === restauranteSelecionadoId)?.nome}</span>
            </h2>

            <ul className="list-group mb-3">
              {itensCardapio.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {item.nome} - R$ {(item.preco || 0).toFixed(2)} - {item.descricao}
                  </span>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => excluirItemCardapio(item.id)}>
                    Excluir
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmitCardapio} className="mb-4">
              <h4 className="text-secondary">Adicionar Item</h4>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome do item"
                  value={nomeItem}
                  onChange={(e) => setNomeItem(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Preço (R$)"
                  value={precoItem}
                  onChange={(e) => setPrecoItem(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descrição"
                  value={descricaoItem}
                  onChange={(e) => setDescricaoItem(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Adicionar ao Cardápio
              </button>
            </form>
          </div>
        )}

        <h1 className="text-center text-primary mb-4">Adicionar Restaurantes</h1>

        <form onSubmit={handleSubmitRestaurante}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Adicionar
          </button>
        </form>

        <h1 className="text-center text-primary my-4">Lista de Pedidos</h1>
        <div className="mb-5">
          <ul className="list-group">
            {pedidos.map((pedido) => (
              <li
                key={pedido.id}
                className={`list-group-item${pedido.entregadorId ? " bg-success bg-opacity-25" : ""}`}
              >
                <strong>ID:</strong> {pedido.id} <br />
                <strong>Cliente:</strong> {pedido.clienteId} <br />
                <strong>Total:</strong> R$ {(pedido.valorTotal || 0).toFixed(2)}
                <br />
                {pedido.entregadorId && (
                  <span className="badge bg-success mb-2 fs-6" style={{ fontSize: "1rem" }}>
                    Entrega já atribuída ao entregador {pedido.entregadorId}
                  </span>
                )}
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={() => atribuirEntrega(pedido.id)}
                  disabled={!!pedido.entregadorId}
                >
                  {pedido.entregadorId ? "Já atribuído" : "Atribuir ao entregador"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
