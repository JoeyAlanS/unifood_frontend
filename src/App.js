import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClienteInterface from './pages/Cliente';
import Pedido from './pages/Pedido';
import Entregador from './pages/Entregador';
import Restaurantes from './pages/Restaurantes';

export default function App() {
  return (
    <>
      <div className="container mt-4">
        <Routes>
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/cliente" element={<ClienteInterface />} />
          <Route path="/restaurante" element={<Restaurantes />} />
          <Route path="/entregador" element={<Entregador />} />
          <Route path="*" element={<Pedido />} />
        </Routes>
      </div>
    </>
  );
}
