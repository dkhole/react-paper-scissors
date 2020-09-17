import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    
  setColor() {
    if(this.props.squareClass === 'square x') {
      return this.props.playerX;
    } 
    else if (this.props.squareClass === 'square o') {
      return this.props.playerO;
    } else {
      return 'black';
    }
  }

  render() {
      return (
        <button className={this.props.squareClass} onClick={this.props.onClick} style={{color: this.setColor()}}>
            {this.props.value}
        </button>
      );
    }
  }
  
class Board extends React.Component {

    renderSquare(i) {
      return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                squareClass={this.props.classes[i]}
                playerX={this.props.playerX}
                playerO={this.props.playerO}
            />
      );
    }
  
    render() {

        return (
            <div id="board">
              <div className="board-row">
                  {this.renderSquare(0)}
                  {this.renderSquare(1)}
                  {this.renderSquare(2)}
              </div>
              <div className="board-row">
                  {this.renderSquare(3)}
                  {this.renderSquare(4)}
                  {this.renderSquare(5)}
              </div>
              <div className="board-row">
                  {this.renderSquare(6)}
                  {this.renderSquare(7)}
                  {this.renderSquare(8)}
              </div>
            </div>
        );
    }
  }
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      playerX: '#FF0000',
      playerO: '#0300FF',
      classes: Array(9).fill('square'),
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const classes = this.state.classes.slice();

    if(calculateWinner(squares) || squares[i]) {
        return;
    }
    
    if(this.state.xIsNext) {
      classes[i] = 'square x';
      squares[i] = 'X';
    } else {
      classes[i] = 'square o';
      squares[i] = 'O';
    }

    this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        classes: classes,
    });
  }

  pickColor(i) {
    const newColor = String(i.target.value);

    if(i.target.id === 'play-x') {
      this.setState({
        playerX: newColor,
      });
    } else {
      this.setState({
        playerO: newColor,
      });
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let count = 0;

    //map, callback function first two arg is current element being processed in this case object squares: squares
    //second arg is index of current element
    const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
          count++;
        return (
          <li key={move}>
            <button className="history" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
    });

    let status;
    let divStat;

    if(winner) {
      status = 'Winner: ' + winner;
      divStat = 'winner';
    } 
    else if(count === 10) {
      status = 'Draw';
      divStat = 'draw';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      divStat = 'status';
    }

    return (
      <div className="game">
        <div id="game-title">Tic-Tac-Toe</div>
        <div id={divStat}>{status}</div>
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            classes={this.state.classes}
            playerX={this.state.playerX}
            playerO={this.state.playerO}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
        <div id="player-controls">
          <div class="player">Player 1 <input type="color" id="play-x" value={this.state.playerX} onChange={i => {this.pickColor(i)}}></input></div>
          <div class="player">Player 2 <input type="color" id="play-o" value={this.state.playerO} onChange={i => {this.pickColor(i)}}></input></div>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }