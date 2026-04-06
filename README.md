# Essenza — Frontend

E-commerce de produtos artesanais em produção, construído do zero com React, TypeScript e Vite. Cobre toda a jornada do cliente: catálogo, carrinho, checkout, pagamento e autenticação.

🌐 [essenzame.com.br](https://essenzame.com.br)

## Tecnologias utilizadas

- **React 18 + Vite**
  - Framework principal para construção da interface em componentes. O Vite oferece hot reload rápido e configuração mínima para projetos modernos.
- **TypeScript**
  - Tipagem estática em todo o projeto, garantindo segurança e previsibilidade no desenvolvimento.
- **TailwindCSS v4**
  - Estilização utility-first com design responsivo mobile-first. Todo o layout foi construído sem bibliotecas de componentes externas, priorizando controle visual.
- **React Router DOM v6**
  - Roteamento client-side com suporte a rotas protegidas por autenticação.
- **Context API**
  - Gerenciamento de estado global para autenticação (`AuthContext`) e carrinho de compras (`CartContext`), mantendo os dados sincronizados entre os componentes sem dependências externas.
- **Axios**
  - Cliente HTTP para comunicação com a API, com interceptors configurados para envio automático de credenciais.

## Fluxo principal da aplicação

### Autenticação

- O usuário cria conta informando nome, CPF, data de nascimento, e-mail e senha.
- O login retorna um JWT armazenado em cookie `HttpOnly`, sem exposição ao JavaScript.
- Rotas protegidas redirecionam para `/login` caso o usuário não esteja autenticado.

### Compra

1. Usuário navega pelo catálogo e adiciona produtos ao carrinho (com seleção de variante quando aplicável).
2. No checkout, preenche o endereço de entrega e calcula o frete pelo CEP.
3. O frete é calculado considerando a quantidade total de itens no pedido.
4. Seleciona a forma de pagamento e aceita os termos de uso (exigido pela LGPD).
5. Ao confirmar, é redirecionado para a página de pagamento do Mercado Pago.

## Decisões técnicas

- **Cookie HttpOnly para autenticação:** escolha deliberada para evitar exposição do token JWT ao JavaScript, reduzindo riscos de ataques XSS.
- **Context API sem Redux:** o estado da aplicação não justificava a complexidade de uma biblioteca de gerenciamento de estado externa. Context API atende bem ao volume de dados compartilhados.
- **Cálculo de frete unificado:** em vez de enviar múltiplos pacotes individuais à API do Super Frete, os itens são consolidados em um único pacote com peso proporcional à quantidade, simplificando o cálculo e reduzindo chamadas à API.
- **Design sem biblioteca de componentes:** todo o layout foi construído diretamente com TailwindCSS para manter controle total sobre a identidade visual da marca.

## Repositórios relacionados

- **Backend:** [essenza-back](https://github.com/seu-usuario/essenza-back)
- **Admin:** [essenza-admin](https://github.com/seu-usuario/essenza-admin)
