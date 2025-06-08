import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ClienteInterface from './pages/Cliente';
import Pedido from './pages/Pedido';
import Restaurante from './pages/Restaurante';
import Entregador from './pages/Entregador';

export default function App() {
  return (
    <>
      <nav>…</nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/cliente" element={<ClienteInterface />} />
          <Route path="/restaurante" element={<Restaurante />} />
          <Route path="/entregador" element={<Entregador />} />
          <Route path="*" element={<Pedido />} />
        </Routes>
      </div>
    </>
  );
}
