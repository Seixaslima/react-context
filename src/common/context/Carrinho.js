import { useContext } from 'react';
import { createContext } from 'react';
import { useState } from 'react';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  return (
    <CarrinhoContext.Provider value={{ carrinho, setCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinhoContext() {
  const { carrinho, setCarrinho } = useContext(CarrinhoContext);

  function adicionarProduto(novoItem) {
    let temProduto = carrinho.find(
      itemDoCarrinho => itemDoCarrinho.id === novoItem.id
    );
    if (!temProduto) {
      novoItem.quantidade = 1;
      setCarrinho(carrinhoAntigo => [...carrinhoAntigo, novoItem]);
      return;
    }
    setCarrinho(carrinhoAntigo =>
      carrinhoAntigo.map(itemDoCarrinho => {
        if (itemDoCarrinho.id === novoItem.id) itemDoCarrinho.quantidade += 1;
        return itemDoCarrinho;
      })
    );
  }

  return {
    carrinho,
    setCarrinho,
    adicionarProduto
  };
}
