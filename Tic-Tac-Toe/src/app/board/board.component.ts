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
    X: 10,
    O: -10,
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
    return this.xIsNext ? 'O' : 'X';
  }

  makeMove(idx: number) {
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();

    if(!this.xIsNext){
      this.bestMove();
      this.winner = this.calculateWinner();
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
    let state = true;
    this.squares.forEach(element => {
      if(element != null){
        state = false;
      }
    });

    if(state){
      return 'tie';
    }
    return null;
  }


  bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      // Is the spot available?
      if (this.squares[i] == null) {
        this.squares[i] = 'X';
        let score = this.minimax(this.squares, 0, false);
        this.squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = { i};
        }
      }
    }
    this.squares[move.i] = 'X';
  }
  


  minimax(board, depth, isMaximizing) {
    let result = this.calculateWinner();
    if (result != null) {
      if(result=='X'){
        return 10;
      }
      else if(result=='O'){
        return -10;
      }
      else{
        debugger;
        return 0;
      }
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
          // Is the spot available?
        if (board[i] == null) {
          board[i] = 'X';
          let score = this.minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
        
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        // Is the spot available?
        if (board[i] == null) {
          board[i] = 'O';
          let score = this.minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
        
      }
      return bestScore;
    }
  }
  
}
