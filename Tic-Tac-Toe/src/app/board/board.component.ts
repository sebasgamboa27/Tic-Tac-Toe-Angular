import { Component, OnInit } from '@angular/core';
import { not } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: string[][];
  xIsNext: boolean;
  winner: string;
  scores = {
    X: -10,
    O: 10,
    tie: 0
  };

  AILevel: number = 9;
  AIThinking: boolean;

  constructor() {}

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.winner = null;
    this.xIsNext = true;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number,idy:number) {
    console.log(this.AILevel);

    if (!this.board[idx][idy]) {
      this.board[idx][idy] = this.player;
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();

    if(!this.xIsNext && this.winner === null){
      this.bestMove();
      this.winner = this.calculateWinner();
    }

  }

  equals3(a, b, c) {
    return a == b && b == c && a != '';
  }

  calculateWinner() {
    let winner = null;
  
    // horizontal
    for (let i = 0; i < 3; i++) {
      if (this.equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
        winner = this.board[i][0];
      }
    }
  
    // Vertical
    for (let i = 0; i < 3; i++) {
      if (this.equals3(this.board[0][i], this.board[1][i], this.board[2][i])) {
        winner = this.board[0][i];
      }
    }
  
    // Diagonal
    if (this.equals3(this.board[0][0], this.board[1][1], this.board[2][2])) {
      winner = this.board[0][0];
    }
    if (this.equals3(this.board[2][0], this.board[1][1], this.board[0][2])) {
      winner = this.board[2][0];
    }
  
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] == '') {
          openSpots++;
        }
      }
    }
  
    if (winner == null && openSpots == 0) {
      return 'tie';
    } else {
      return winner;
    }
  }


  bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (this.board[i][j] == '') {
          this.board[i][j] = 'O';
          let score = this.minimax(this.board, 0, false);
          this.board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    if(move === undefined && this.winner === null){
      debugger;
      let notFound = true;
      while (notFound){
        let i = Math.floor(Math.random() * (3 - 0) + 0);
        let j = Math.floor(Math.random() * (3 - 0) + 0);
        if(this.board[i][j] == ''){
          move = {i,j};
          notFound = false;
        }
      }
    }
    this.board[move.i][move.j] = 'O';
    this.xIsNext = !this.xIsNext;
  }
  


  minimax(board, depth, isMaximizing) {
    let result = this.calculateWinner();
    if (result !== null) {
      return this.scores[result];
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = 'O';
            let score;
            if(depth<=this.AILevel){
              score = this.minimax(board, depth + 1, false);
            }
            else{
              score = bestScore;
            }
            board[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = 'X';
            let score;
            if(depth<=this.AILevel){
              score = this.minimax(board, depth + 1, true);
            }
            else{
              score = bestScore;
            }
            board[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
  
}
