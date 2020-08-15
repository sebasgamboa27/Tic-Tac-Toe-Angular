import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  squares: string[];
  xIsNext: boolean;
  winner: string;
  scores = {
    X: -10,
    O: 10,
    tie: 0
  };

  constructor() {}

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();

    if(!this.xIsNext){
      this.bestMove();
      this.xIsNext = !this.xIsNext;
    }

  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }


  bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    debugger;
    for (let i = 0; i < 9; i++) {
      // Is the spot available?
      debugger;
      if (this.squares[i] === null) {
        this.squares[i] = 'O';
        let score = this.minimax( 0, false);
        this.squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = {i};
        }
      }
    }
    this.squares[move.i] = 'O';
  }


  minimax(depth, isMaximizing) {
    
    let result = this.calculateWinner();
    if (result !== null) {
      return this.scores[result];
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        // Is the spot available?
        if (this.squares[i] === null) {
          this.squares[i] = 'O';
          let score = this.minimax( depth + 1, false);
          this.squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let j = 0; j < 9; j++) {
          // Is the spot available?
        if (this.squares[j] === null) {
          this.squares[j]= 'X';
          let score = this.minimax( depth + 1, true);
          this.squares[j] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }
}
