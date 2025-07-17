import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * A modern, minimalistic, light-themed implementation of a two-player Tic Tac Toe game.
 * Features:
 *   - Create new game
 *   - Two-player local gameplay
 *   - Game board display and player turn indication
 *   - Win/draw detection
 *   - Restart game
 */

const COLORS = {
  primary: "#1976d2",
  secondary: "#eeeeee",
  accent: "#ff4081",
};

const BOARD_SIZE = 3;

// Utility to create a blank game board
function blankBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(""));
}

// Returns 'X', 'O', or '' (draw) if winner detected, else null
function checkWinner(board) {
  // Rows, columns, and diagonals
  const lines = [];

  // Rows & Cols
  for (let i = 0; i < BOARD_SIZE; i++) {
    lines.push(board[i]); // row
    lines.push([board[0][i], board[1][i], board[2][i]]); // col
  }
  // Diagonals
  lines.push([board[0][0], board[1][1], board[2][2]]);
  lines.push([board[0][2], board[1][1], board[2][0]]);

  for (const line of lines) {
    if (line.every((v) => v === "X")) return "X";
    if (line.every((v) => v === "O")) return "O";
  }

  // Draw
  if (board.flat().every((v) => v !== "")) return ""; // Draw

  return null; // Not finished
}

const PLAYER_INFO = [
  { symbol: "X", name: "Player 1", color: COLORS.primary },
  { symbol: "O", name: "Player 2", color: COLORS.accent },
];

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(blankBoard());
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0 for X, 1 for O
  const [winner, setWinner] = useState(null); // "X", "O", "" (draw), or null
  const [showStart, setShowStart] = useState(true);

  // Detect win/draw after every move
  useEffect(() => {
    const result = checkWinner(board);
    if (result !== null) setWinner(result);
  }, [board]);

  // PUBLIC_INTERFACE
  function handleCellClick(row, col) {
    if (board[row][col] || winner) return; // Ignore if not empty or finished

    const newBoard = board.map((r, i) =>
      r.map((v, j) => (i === row && j === col ? PLAYER_INFO[currentPlayer].symbol : v))
    );
    setBoard(newBoard);
    setCurrentPlayer((currentPlayer + 1) % 2);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(blankBoard());
    setWinner(null);
    setCurrentPlayer(0);
    setShowStart(false);
  }

  // PUBLIC_INTERFACE
  function handleStartNewGame() {
    setBoard(blankBoard());
    setWinner(null);
    setCurrentPlayer(0);
    setShowStart(false);
  }

  // UI elements
  function renderPlayerBanner() {
    return (
      <div className="ttt-players" style={{ marginBottom: 24 }}>
        {PLAYER_INFO.map((player, idx) => (
          <div
            key={player.symbol}
            className="ttt-player"
            style={{
              color: player.color,
              fontWeight: currentPlayer === idx && winner === null ? "bold" : "normal",
              opacity: winner !== null && winner !== player.symbol ? 0.6 : 1,
              borderBottom:
                currentPlayer === idx && winner === null
                  ? `3px solid ${player.color}`
                  : "none",
              transition: "border 0.3s",
              minWidth: 90,
              textAlign: "center",
              fontSize: 19,
            }}
          >
            {player.name}{" "}
            <span
              style={{
                fontWeight: "bold",
                fontSize: 22,
                color: player.color,
                marginLeft: 4,
              }}
            >
              {player.symbol}
            </span>
            {currentPlayer === idx && winner === null ? (
              <span title="Current turn" style={{ fontSize: 14, marginLeft: 4 }}>
                ●
              </span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  function renderBoard() {
    return (
      <div className="ttt-board" tabIndex="0">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <button
              aria-label={`Cell ${i},${j}`}
              key={`${i}-${j}`}
              className={`ttt-cell${cell ? " filled" : ""}`}
              onClick={() => handleCellClick(i, j)}
              disabled={!!winner || !!cell}
              style={{
                color: cell === "X" ? COLORS.primary : cell === "O" ? COLORS.accent : "#555",
                backgroundColor:
                  winner &&
                  ((winner === "" && board[i][j]) ||
                    winner === board[i][j])
                    ? COLORS.secondary
                    : "#fff",
              }}
            >
              {cell}
            </button>
          ))
        )}
      </div>
    );
  }

  function renderStatus() {
    let status;
    if (winner === "X" || winner === "O") {
      const winInfo = PLAYER_INFO.find((p) => p.symbol === winner);
      status = (
        <span style={{ color: winInfo.color, fontWeight: "bold" }}>
          {winInfo.name} wins!
        </span>
      );
    } else if (winner === "") {
      status = (
        <span style={{ color: "#333", fontWeight: "bold" }}>
          It's a draw!
        </span>
      );
    } else {
      status = (
        <>
          <span style={{ color: PLAYER_INFO[currentPlayer].color }}>
            {PLAYER_INFO[currentPlayer].name}'s turn ({PLAYER_INFO[currentPlayer].symbol})
          </span>
        </>
      );
    }
    return <div className="ttt-status">{status}</div>;
  }

  function renderRestartButton() {
    return (
      <button className="ttt-restart-btn" onClick={handleRestart}>
        Restart
      </button>
    );
  }

  function renderStartOverlay() {
    return (
      <div className="ttt-overlay">
        <div className="ttt-overlay-content">
          <div className="ttt-title">Tic Tac Toe</div>
          <div className="ttt-subtitle">
            Two Player<br />Local Game
          </div>
          <button className="ttt-start-btn" onClick={handleStartNewGame}>
            Start New Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App" style={{ backgroundColor: "#f9fafe", minHeight: "100vh" }}>
      {showStart && renderStartOverlay()}
      <main className="ttt-container">
        <div style={{ marginBottom: 12 }}>
          <div className="ttt-title" style={{ color: COLORS.primary }}>
            Tic Tac Toe
          </div>
        </div>
        {renderPlayerBanner()}
        {renderBoard()}
        {renderStatus()}
        {renderRestartButton()}
      </main>
    </div>
  );
}

export default App;
