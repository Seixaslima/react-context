import { useContext } from 'react';
import { useEffect } from 'react';
import { createContext } from 'react';
import { useState } from 'react';
import { UsuarioContext } from './Usuario';
import { usePagamentoContext } from './Pagamento';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProduto, setQuantidadeProduto] = useState(0);
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);
  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        quantidadeProduto,
        setQuantidadeProduto,
        valorTotalCarrinho,
        setValorTotalCarrinho
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinhoContext() {
  const {
    carrinho,
    setCarrinho,
    quantidadeProduto,
    setQuantidadeProduto,
    valorTotalCarrinho,
    setValorTotalCarrinho
  } = useContext(CarrinhoContext);

  const { saldo, setSaldo } = useContext(UsuarioContext);
  const { formaPagamento } = usePagamentoContext();

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
    const { novoTotal, novaQuantidade } = carrinho.reduce(
      (contador, produto) => ({
        novaQuantidade: contador.novaQuantidade + produto.quantidade,
        novoTotal: contador.novoTotal + produto.valor * produto.quantidade
      }),
      { novoTotal: 0, novaQuantidade: 0 }
    );
    setQuantidadeProduto(novaQuantidade);
    setValorTotalCarrinho(novoTotal * formaPagamento.juros);
  }, [carrinho, setQuantidadeProduto, setValorTotalCarrinho, formaPagamento]);

  function efetuarCompra() {
    setCarrinho([]);
    setSaldo(saldo - valorTotalCarrinho);
  }

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    quantidadeProduto,
    setQuantidadeProduto,
    valorTotalCarrinho,
    efetuarCompra
  };
}
