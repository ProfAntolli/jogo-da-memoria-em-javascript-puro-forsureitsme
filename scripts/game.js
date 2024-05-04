class Card {
  matched = false;
  selected = false;
  element = document.createElement("div");
  cardBack = document.createElement("div");
  cardFront = document.createElement("div");
  foreground = 0;

  constructor(foreground) {
    this.foreground = foreground;

    this.element.classList.add("memory__card");
    this.cardFront.classList.add("memory__card_front");
    this.cardBack.classList.add("memory__card_back");
    this.cardFront.classList.add(
      `memory__card_front--foreground-${foreground}`
    );

    this.element.appendChild(this.cardFront);
    this.element.appendChild(this.cardBack);
  }

  render() {
    this.element.classList.toggle("memory__card--matched", this.matched);
    this.element.classList.toggle("memory__card--selected", this.selected);
  }
}

class Game {
  // Tabuleiro inicial com os cards organizados
  board = new Array(12).fill(1).map((_, index) => {
    const foregroundIndex = parseInt(index / 2, 10);
    const card = new Card(foregroundIndex);

    // Atribui evento de clique no elemento da carta como seleção
    card.element.addEventListener("click", () => this.selectCard(card));

    return card;
  });
  table = document.querySelector(".memory__table");
  gameOver = document.querySelector(".memory__game-over");

  constructor() {
    // Reinicia o jogo ao clicar em "Jogar novamente"
    document
      .querySelector(".memory__game-over__play-again")
      .addEventListener("click", () => {
        this.restart();
      });
  }

  restart() {
    // Remove marcação de combinações das cartas
    for (let i = this.board.length - 1; i >= 0; i--) {
      this.board[i].matched = false;
    }
    
    // Esconde a tela de fim de jogo
    this.gameOver.classList.remove("memory__game-over--show");
    
    // Inicia novamente
    this.init();
  }

  init() {
    // Remove todas as cartas da mesa
    this.table.innerHTML = "";

    // Embaralha as cartas do tabuleiro utilizando o método Fisher–Yates
    for (let i = this.board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const aux = this.board[i];
      this.board[i] = this.board[j];
      this.board[j] = aux;
    }

    // Adiciona as cartas na mesa
    for (let i = 0; i < this.board.length; i++) {
      const card = this.board[i];
      this.table.appendChild(card.element);
      card.render();
    }
  }

  selectCard(card) {
    // Ignorar cartas já combinadas
    if (card.matched) {
      return;
    }

    // Marca carta como selecionada
    card.selected = true;
    card.render();

    this.checkMatch();
  }

  checkMatch() {
    const selectedCards = this.board.filter((card) => card.selected);

    // Prossegue com a verificação de combinação somente se houver escolhido duas cartas
    if (selectedCards.length < 2) {
      return;
    }

    // Verifica se cards selecionados possuem a mesma face
    if (
      selectedCards.every(
        (card) => card.foreground === selectedCards[0].foreground
      )
    ) {
      this.matchCards(selectedCards);
      this.checkGameOver();
      return;
    }

    // Não sendo os cards de mesma face, bloquear ações no tabuleiro por 1.5 segundos
    // e então desselecionar cartas e permitir ações novamente
    this.toggleLock(true);
    setTimeout(() => {
      this.unselectCards(selectedCards);
      this.toggleLock(false);
    }, 1500);
  }

  // Marca cartas como não selecionadas, escondendo elas
  unselectCards(cards) {
    for (let i = cards.length - 1; i >= 0; i--) {
      cards[i].selected = false;
      cards[i].render();
    }
  }

  // Marca cartas como combinadas e as desseleciona
  matchCards(cards) {
    for (let i = cards.length - 1; i >= 0; i--) {
      cards[i].matched = true;
    }

    this.unselectCards(cards);
  }

  // Bloqueia ações no tabuleiro, previnindo eventos do mouse
  toggleLock(state) {
    this.table.classList.toggle("memory__table--locked", state);
  }

  checkGameOver() {
    // Verifica se todos as cartas foram combinadas e mostra a tela de fim de jogo se necessário
    if (this.board.every((card) => card.matched)) {
      this.gameOver.classList.add("memory__game-over--show");
    }
  }
}

// Inicia jogo
new Game().init();
