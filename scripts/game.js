class Card {
  open = false;
  selected = false;
  element = document.createElement("div");
  cardBack = document.createElement("div");
  cardFront = document.createElement("div");
  foreground = 0;

  constructor(foregroundIndex) {
    this.element.classList.add("memory__card");
    this.cardFront.classList.add("memory__card_front");
    this.cardBack.classList.add("memory__card_back");
    this.cardFront.classList.add(
      `memory__card_front--foreground-${foregroundIndex}`
    );

    this.element.appendChild(this.cardFront);
    this.element.appendChild(this.cardBack);
  }
}

class Game {
  // Tabuleiro inicial com os cards organizados
  initialBoard = new Array(12).fill(1).map((_, index) => {
    const foregroundIndex = parseInt(index / 2, 10);
    return new Card(foregroundIndex);
  });

  board = null;

  constructor(table) {
    this.table = table;
  }

  init() {
    // Remove todas as cartas da mesa
    this.table.innerHTML = "";

    // Reinicia o tabuleiro com cards organizados
    this.board = this.initialBoard;

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
    }
  }
}

const table = document.querySelector(".memory__table");
const game = new Game(table);
game.init();
