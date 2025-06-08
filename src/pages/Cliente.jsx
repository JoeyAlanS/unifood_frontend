import React, { useState } from 'react';

const ClienteInterface = () => {
  const [section, setSection] = useState('');
  // Campos do formulário de cadastro
  const [cadNome, setCadNome] = useState('');
  const [cadEmail, setCadEmail] = useState('');
  const [cadTelefone, setCadTelefone] = useState('');
  const [cadEndereco, setCadEndereco] = useState('');
  const [cadastroMensagem, setCadastroMensagem] = useState('');

  // Campos do formulário de atualização
  const [updId, setUpdId] = useState('');
  const [updNome, setUpdNome] = useState('');
  const [updEmail, setUpdEmail] = useState('');
  const [updTelefone, setUpdTelefone] = useState('');
  const [updEndereco, setUpdEndereco] = useState('');
  const [updateMensagem, setUpdateMensagem] = useState('');

  // Deleção
  const [delId, setDelId] = useState('');
  const [deleteMensagem, setDeleteMensagem] = useState('');

  // Listagem
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  // Restaurantes
  const [restaurantes, setRestaurantes] = useState([]);
  const [loadingRest, setLoadingRest] = useState(false);

  // Handlers
  const handleCadastro = async e => {
    e.preventDefault();
    setCadastroMensagem('Carregando...');
    try {
      const res = await fetch(
        'https://microservicocliente-production.up.railway.app/api/clientes',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: cadNome,
            email: cadEmail,
            telefone: cadTelefone,
            endereco: cadEndereco
          })
        }
      );
      if (res.ok) {
        const data = await res.json();
        setCadastroMensagem(`✅ Cliente cadastrado! ID: ${data.id}`);
        setCadNome('');
        setCadEmail('');
        setCadTelefone('');
        setCadEndereco('');
      } else {
        setCadastroMensagem('❌ Erro ao cadastrar.');
      }
    } catch {
      setCadastroMensagem('❌ Erro de conexão.');
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdateMensagem('Carregando...');
    try {
      const res = await fetch(
        `https://microservicocliente-production.up.railway.app/api/clientes/${updId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: updNome,
            email: updEmail,
            telefone: updTelefone,
            endereco: updEndereco
          })
        }
      );
      setUpdateMensagem(
        res.ok ? '✅ Cliente atualizado.' : '❌ Erro. ID inválido?'
      );
    } catch {
      setUpdateMensagem('❌ Erro de conexão.');
    }
  };

  const handleDelete = async () => {
    if (!delId) return setDeleteMensagem('❌ Informe o ID.');
    setDeleteMensagem('Carregando...');
    try {
      const res = await fetch(
        `https://microservicocliente-production.up.railway.app/api/clientes/${delId}`,
        { method: 'DELETE' }
      );
      setDeleteMensagem(
        res.ok ? '✅ Cliente deletado.' : '❌ Erro ao deletar.'
      );
    } catch {
      setDeleteMensagem('❌ Erro de conexão.');
    }
  };

  const listarClientes = async () => {
    setLoadingClientes(true);
    try {
      const res = await fetch(
        'https://microservicocliente-production.up.railway.app/api/clientes'
      );
      const data = await res.json();
      setClientes(data);
    } catch {
      setClientes([]);
    } finally {
      setLoadingClientes(false);
    }
  };

  const carregarRestaurantes = async () => {
    setLoadingRest(true);
    try {
      const res = await fetch(
        'https://restaurante-production-7756.up.railway.app/restaurante'
      );
      const data = await res.json();
      setRestaurantes(data);
    } catch {
      setRestaurantes([]);
    } finally {
      setLoadingRest(false);
    }
  };

  return (
    <div className="container">
      <h2>Cliente</h2>
      <div className="menu">
        <button onClick={() => setSection('cadastro')}>📝 Cadastrar</button>
        <button onClick={() => setSection('atualizar')}>🔁 Atualizar</button>
        <button onClick={() => setSection('deletar')}>❌ Deletar</button>
        <button onClick={() => setSection('listarClientes')}>📋 Listar Clientes</button>
        <button onClick={() => setSection('restaurantes')}>🍽️ Restaurantes</button>
      </div>

      {section === 'cadastro' && (
        <div className="section">
          <h3>📝 Cadastrar Novo Cliente</h3>
          <form onSubmit={handleCadastro}>
            <input
              type="text"
              placeholder="Nome"
              value={cadNome}
              onChange={e => setCadNome(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={cadEmail}
              onChange={e => setCadEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Telefone"
              value={cadTelefone}
              onChange={e => setCadTelefone(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Endereço"
              value={cadEndereco}
              onChange={e => setCadEndereco(e.target.value)}
              required
            />
            <button type="submit">Cadastrar</button>
          </form>
          <p className="msg">{cadastroMensagem}</p>
        </div>
      )}

      {section === 'atualizar' && (
        <div className="section">
          <h3>🔁 Atualizar Cadastro</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="ID do Cliente"
              value={updId}
              onChange={e => setUpdId(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Nome"
              value={updNome}
              onChange={e => setUpdNome(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={updEmail}
              onChange={e => setUpdEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Telefone"
              value={updTelefone}
              onChange={e => setUpdTelefone(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Endereço"
              value={updEndereco}
              onChange={e => setUpdEndereco(e.target.value)}
              required
            />
            <button type="submit">Atualizar Cadastro</button>
          </form>
          <p className="msg">{updateMensagem}</p>
        </div>
      )}

      {section === 'deletar' && (
        <div className="section">
          <h3>❌ Deletar Cliente</h3>
          <input
            type="text"
            placeholder="ID do Cliente para Deletar"
            value={delId}
            onChange={e => setDelId(e.target.value)}
          />
          <button onClick={handleDelete}>Deletar Cliente</button>
          <p className="msg">{deleteMensagem}</p>
        </div>
      )}

      {section === 'listarClientes' && (
        <div className="section">
          <h3>📋 Clientes Cadastrados</h3>
          <button onClick={listarClientes}>Listar Clientes</button>
          {loadingClientes ? (
            <p>Carregando...</p>
          ) : (
            clientes.map(c => (
              <div key={c.id} className="card">
                <strong>ID:</strong> {c.id}
                <br />
                <strong>Nome:</strong> {c.nome}
                <br />
                Email: {c.email}
                <br />
                Telefone: {c.telefone}
                <br />
                Endereço: {c.endereco}
              </div>
            ))
          )}
        </div>
      )}

      {section === 'restaurantes' && (
        <div className="section">
          <h3>🍽️ Restaurantes Disponíveis</h3>
          <button onClick={carregarRestaurantes}>Ver Restaurantes</button>
          {loadingRest ? (
            <p>Carregando...</p>
          ) : (
            restaurantes.map(r => (
              <div key={r.id} className="card">
                <strong>{r.nome}</strong>
                <br />
                CNPJ: {r.cnpj}
                <br />
                Categoria: {r.categoria}
                <br />
                Endereço: {r.endereco}
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: auto;
        }
        .menu button {
          padding: 10px 20px;
          margin: 5px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .menu button:hover {
          background: #0056b3;
        }
        .section {
          margin-top: 20px;
        }
        input,
        button,
        select {
          padding: 10px;
          margin: 8px 0;
          width: 100%;
          box-sizing: border-box;
        }
        .card {
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 5px;
        }
        .msg {
          margin-top: 8px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default ClienteInterface;
