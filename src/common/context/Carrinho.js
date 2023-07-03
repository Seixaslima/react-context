import { useContext } from 'react';
import { useEffect } from 'react';
import { createContext } from 'react';
import { useState } from 'react';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProduto, setQuantidadeProduto] = useState(0);
  return (
    <CarrinhoContext.Provider
      value={{ carrinho, setCarrinho, quantidadeProduto, setQuantidadeProduto }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinhoContext() {
  const { carrinho, setCarrinho, quantidadeProduto, setQuantidadeProduto } =
    useContext(CarrinhoContext);

  function mudarQuantidade(id, quantidade) {
    return carrinho.map(itemDoCarrinho => {
      if (itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade;
      return itemDoCarrinho;
    });
  }

  function adicionarProduto(novoItem) {
    let temProduto = carrinho.find(
      itemDoCarrinho => itemDoCarrinho.id === novoItem.id
    );
    if (!temProduto) {
      novoItem.quantidade = 1;
      setCarrinho(carrinhoAntigo => [...carrinhoAntigo, novoItem]);
      return;
    }
    setCarrinho(mudarQuantidade(novoItem.id, 1));
  }

  function removerProduto(id) {
    const produtoAtual = carrinho.find(
      itemDoCarrinho => itemDoCarrinho.id === id
    );
    if (!produtoAtual) {
      return;
    }
    const ehOUltimo = produtoAtual.quantidade === 1;
    if (ehOUltimo) {
      return setCarrinho(carrinhoAntigo =>
        carrinhoAntigo.filter(itemDoCarrinho => itemDoCarrinho.id !== id)
      );
    }

    setCarrinho(mudarQuantidade(id, -1));
  }

  useEffect(() => {
    const novaQuantidade = carrinho.reduce(
      (contador, produto) => contador + produto.quantidade,
      0
    );
    setQuantidadeProduto(novaQuantidade);
  }, [carrinho, setQuantidadeProduto]);

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    quantidadeProduto,
    setQuantidadeProduto
  };
}
