import { useState, useContext } from 'react';

const { createContext } = require('react');

export const pagamentoContext = createContext();
pagamentoContext.displayName = 'Pagamento';

export function PagamentoProvider({ children }) {
  const tiposDePagamento = [
    {
      nome: 'Boleto',
      juros: 1,
      id: 1
    },
    {
      nome: 'Cartão de crédito',
      juros: 1.2,
      id: 2
    },
    {
      nome: 'PIX',
      juros: 1,
      id: 3
    },
    {
      nome: 'Crediario',
      juros: 1.5,
      id: 4
    }
  ];

  const [formaPagamento, setFormaPagamento] = useState(tiposDePagamento[0]);
  return (
    <pagamentoContext.Provider
      value={{ tiposDePagamento, formaPagamento, setFormaPagamento }}
    >
      {children}
    </pagamentoContext.Provider>
  );
}

export function usePagamentoContext() {
  const { formaPagamento, tiposDePagamento, setFormaPagamento } =
    useContext(pagamentoContext);

  function mudarPagamento(id) {
    const pagamentoAtual = tiposDePagamento.find(
      pagamento => pagamento.id === id
    );
    setFormaPagamento(pagamentoAtual);
  }

  return {
    formaPagamento,
    tiposDePagamento,
    mudarPagamento
  };
}
