import React, { useState } from "react";

let noOfSolutions = 0;

const Game = ({ GameState, setGameState, InitialState, setInitialState, Time, setTime, TimerOn, setTimerOn, BottomText, setBottomText, GameRunning, setGameRunning, submitToserver, isLoggedIn, updateLeaderboard }) => {
  let [SolvedGame, setSolvedGame] = useState();

  function deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function handleInputChange(ele, row, col) {
    let value = parseInt(ele.target.value) || -1;
    let game = deepCopy(GameState);

    if (value === -1 || (1 <= value && value <= 9)) {
      game[row][col] = value;
    }

    setGameState(game);
  }

  // Checks if the number val is valid at row, col position
  function checkValid(row, col, val, game) {
    let checkRow = game[row].indexOf(val) === -1;
    let checkCol = !game.map(row => row[col] === val).includes(true);
    let box = []
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        box.push(game[row - (row % 3) + i][col - (col % 3) + j]);
      }
    }
    let checkBox = box.indexOf(val) === -1;
    return (checkRow && checkCol && checkBox);
  }

  // Checks if board has any inconsistencies
  function checkBoard(game) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let val = game[i][j];
        if (val === -1) continue;
        game[i][j] = -1;
        if (!checkValid(i, j, val, game)) return 0;
        game[i][j] = val;
      }
    }
    return 1;
  }

  // Solves the board, stores solved state and returns number of solutions
  function solve(i, j, game, count /*initailly called with 0*/) {
    if (i === 9) {
      i = 0;
      j++;
      if (j === 9) {
        setSolvedGame(deepCopy(game));
        return 1 + count;
      }
    }
    if (game[i][j] !== -1)  // skip filled cells
      return solve(i + 1, j, game, count);
    // search for 2 solutions instead of 1
    // break, if 2 solutions are found
    for (let val = 1; val <= 9 && count <= 5; ++val) {
      if (checkValid(i, j, val, game)) {
        game[i][j] = val;
        // add additional solutions
        count = solve(i + 1, j, game, count);
      }
    }
    game[i][j] = -1; // reset on backtrack
    return count;
  }

  // Starts the game by setting timer on and fixing initial state
  function handleStart() {
    let game = deepCopy(GameState);
    let isValid = checkBoard(game);
    if (!isValid) {
      setBottomText("Invalid Sudoku");
      return;
    }
    noOfSolutions = solve(0, 0, game, 0, SolvedGame);
    setBottomText(noOfSolutions > 5 ? "No. of Solutions > 5" : "No. of Solutions = " + noOfSolutions);
    if (noOfSolutions === 0) return;
    setInitialState(game);
    setTimerOn(true);
    setGameRunning(true);
    updateLeaderboard();
  }

  // Resets the board to initial state
  function handleReset() {
    let initialGame = deepCopy(InitialState);
    setGameState(initialGame);
    setBottomText("Board reset to initial puzzle!");
  }

  // Solves the board
  function handleSolve() {
    setBottomText("Here's a solution");
    setGameState(SolvedGame);
    setTimerOn(false);
  }

  // Helper function to convert 2D array into single string
  function convertGridToString(grid) {
    // Flatten the grid array into a single array
    const flattened = grid.flat();
    // Convert each value in the flattened array to a string
    const strings = flattened.map((value) => value.toString());
    // Join the string values with commas
    return strings.join(',');
  }

  // Submit the solution to server if its valid
  function handleSubmit() {
    let game = deepCopy(GameState);
    let isValid = 1;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let val = game[i][j];
        if (val === -1) isValid = 0;
        game[i][j] = -1;
        if (!checkValid(i, j, val, game)) isValid = 0;
        game[i][j] = val;
      }
    }
    if (isValid) {
      setBottomText("Correct submission!");
      setTimerOn(false);
      if (isLoggedIn) {
        let points;
        if (noOfSolutions === 1) {
          points = 30;
        } else if (noOfSolutions <= 5) {
          points = 20;
        } else {
          points = 10;
        }
        const data = {
          puzzle: convertGridToString(InitialState),
          points: points,
          time: Time,
        };
        submitToserver(data);
      }
    } else {
      setBottomText("Incorrect submission!");
    }
  }

  // JSX
  return (
    <>
      <div className="flex w-[450px] justify-between items-center mb-4" id="titleandclock">
        <h3 className="font-extrabold text-blue-800 text-4xl" id="title">Sudoku</h3>
        <div className="mr-12 font-bold text-blue-800 text-3xl flex items-center" id="timer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-stopwatch" viewBox="0 0 16 16">
            <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z" />
            <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z" />
          </svg>
          {Time}
        </div>
      </div>
      <table className="border-separate border-4 border-blue-800 rounded bg-yellow-100" style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(
              (row, rowInd) => {
                return <tr key={rowInd}
                  className={(row + 1) % 3 === 0 ? "border-b-2 border-blue-800" : ""}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(
                    (col, colInd) => {
                      return <td key={rowInd + colInd}
                        className={(col + 1) % 3 === 0 ? "border-r-2 border-blue-800 p-0" : "p-0"}
                      >
                        <input className="w-[50px] h-[50px] text-2xl font-bold text-center p-0 border border-blue-400 focus:outline-none disabled:bg-gray-200"
                          value={GameState[row][col] === -1 ? "" : GameState[row][col]}
                          onChange={(ele) => handleInputChange(ele, row, col)}
                          disabled={InitialState[row][col] !== -1}
                        />
                      </td>
                    }
                  )}
                </tr>
              }
            )
          }
        </tbody>
      </table>
      <div className="w-[400px] mt-5 mb-5 flex justify-between">
        <button className="w-[100px] text-center px-0 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 border-2 border-blue-700 hover:border-white transition" onClick={handleStart} hidden={GameRunning}>Start</button>
        <button className="w-[100px] text-center px-0 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 border-2 border-blue-700 hover:border-white transition" onClick={handleSubmit} hidden={!GameRunning}>Submit</button>
        <button className="w-[100px] text-center px-0 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 border-2 border-blue-700 hover:border-white transition" onClick={handleReset}>Reset</button>
        <button className="w-[100px] text-center px-0 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 border-2 border-blue-700 hover:border-white transition" onClick={handleSolve}>Solve</button>
      </div>
      <div className="bg-white w-[90%] h-[45px] border-2 border-blue-800 rounded text-blue-800 font-bold text-center flex items-center justify-center mx-auto" id="textBox">
        {BottomText}
      </div>
    </>
  );
};

export default Game; 