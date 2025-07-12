import React, { useEffect, useState } from "react";
import Game from "./components/Game/Game";
import IModal from "./components/IModal";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import axios from "axios";
import TEST_PUZZLES from "./data/puzzles";
import "./App.css";

const serverPort = 8000;
const serverURL = "http://localhost:" + serverPort;

const emptyGame = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
];

function App() {
  // App state variables
  const [difficulty, setDifficulty] = useState(1);
  const [InitialState, setInitialState] = useState(emptyGame);
  const [GameState, setGameState] = useState(emptyGame);
  const [Time, setTime] = useState(0);
  const [TimerOn, setTimerOn] = useState(false);
  const [BottomText, setBottomText] = useState("");
  const [GameRunning, setGameRunning] = useState(false);
  const [Scores, setScores] = useState([]);
  const [Games, setGames] = useState([]);
  const [Times, setTimes] = useState([]);
  const [usrname, setUsrname] = useState("");
  const [pass, setPass] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [myDetails, setmyDetails] = useState({ username: "", Score: 0, Games: 0 });
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Timer increment logic
  useEffect(() => {
    let interval;
    if (TimerOn) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [TimerOn]);

  // Update leaderboard at load
  useEffect(() => {
    updateLeaderboard();
  }, []);

  function resetTimer() {
    setTime(0);
    setTimerOn(false);
  }

  function loadGame(gameStr) {
    let gameArr = gameStr.split(",");
    if (gameArr.length !== 81) return false;
    const game = [];
    for (let i = 0; i < gameArr.length; i += 9) {
      const chunk = gameArr.slice(i, i + 9);
      for (let j = 0; j < chunk.length; j++) {
        const num = parseInt(chunk[j]);
        if (num !== -1 && (isNaN(num) || num < 1 || num > 9 || !Number.isInteger(num))) {
          return false;
        }
        chunk[j] = num;
      }
      game.push(chunk);
    }
    setGameState(JSON.parse(JSON.stringify(game)));
    setInitialState(JSON.parse(JSON.stringify(game)));
    return true;
  }

  function handleFileChange(e) {
    let file;
    if (e.target.files) {
      file = e.target.files[0];
    }
    const Reader = new FileReader();
    Reader.readAsText(file);
    Reader.onload = (e) => {
      let loaded = loadGame(Reader.result);
      if (loaded) {
        setBottomText("Game loaded! You can now submit your solution.");
        resetTimer();
        setGameRunning(true); // Allow submit immediately
        setTimerOn(false);   // Timer stays off
        setInitialState(emptyGame); // Make all cells editable
      } else {
        setBottomText("Invalid Input");
      }
    };
    e.target.value = "";
  }

  function handleGenerate() {
    let r = Math.floor(Math.random() * TEST_PUZZLES.length);
    let generatedPuzzle = TEST_PUZZLES[r];
    if (difficulty === 2) {
      generatedPuzzle = adjustPuzzleForMediumDifficulty(generatedPuzzle);
    } else if (difficulty === 3) {
      generatedPuzzle = adjustPuzzleForHighDifficulty(generatedPuzzle);
    }
    loadGame(generatedPuzzle);
    setBottomText("Game Generated!");
    resetTimer();
    setGameRunning(false);
  }

  function adjustPuzzleForMediumDifficulty(puzzle) {
    puzzle = puzzle.split(',').map(Number);
    for (let i = 0; i < 20; i++) {
      const idx = Math.floor(Math.random() * 81);
      if (puzzle[idx] !== -1) {
        puzzle[idx] = -1;
      } else {
        i--;
      }
    }
    return puzzle.join(',');
  }

  function adjustPuzzleForHighDifficulty(puzzle) {
    puzzle = puzzle.split(',').map(Number);
    for (let i = 0; i < 30; i++) {
      const idx = Math.floor(Math.random() * 81);
      if (puzzle[idx] !== -1) {
        puzzle[idx] = -1;
      } else {
        i--;
      }
    }
    return puzzle.join(',');
  }

  function convertGridToString(grid) {
    const flattened = grid.flat();
    const strings = flattened.map((value) => value.toString());
    return strings.join(",");
  }

  function updateLeaderboard() {
    fetch(serverURL + "/leaderboards?puzzle=" + convertGridToString(GameState))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setScores(data.Scores || []);
        setGames(data.Games || []);
        setTimes(data.Time || []);
      })
      .catch((error) => {
        console.error("❌ Failed to fetch leaderboard:", error.message);
      });
  }

  function handleRegister() {
    console.log('Register clicked');
    axios
      .post(serverURL + "/register", { username: usrname, password: pass })
      .then((response) => {
        if (response.data.message === "Success") {
          setisLoggedIn(true);
          setBottomText("Successfully registered and logged in!");
          getDetails();
        } else {
          setBottomText(response.data.message || "Registration failed.");
        }
      })
      .catch((error) => {
        setBottomText("Registration error: " + (error.response?.data?.message || error.message));
        console.error(error);
      });
  }

  function handleLogin() {
    axios
      .post(serverURL + "/login", { username: usrname, password: pass })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("token", token);
        if (response.data.message === "Success") {
          setisLoggedIn(true);
          alert("Successfully logged in!");
          getDetails();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getDetails() {
    axios
      .get(serverURL + "/getDetails", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        setmyDetails(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function handleLogout() {
    setisLoggedIn(false);
    localStorage.removeItem("token");
  }

  function submitToserver(data) {
    if (isLoggedIn) {
      const info = data;
      const config = {
        headers: { "x-access-token": localStorage.getItem("token") },
      };
      axios
        .post(serverURL + "/solution", info, config)
        .then((response) => {
          if (response.data.message === "Success") {
            updateLeaderboard();
            getDetails();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <IModal isOpen={showInstructionsModal} onClose={() => setShowInstructionsModal(false)} />
      <header className="w-full max-w-6xl px-4 py-8">
        {/* Top Buttons */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <button className="mybutton" onClick={handleGenerate}>
            New Game
          </button>
          <label className="mybutton cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileChange} />
            Load Game
          </label>
          <button
            className="mybutton"
            type="button"
            onClick={() => setShowInstructionsModal(true)}
          >
            Instructions
          </button>
        </div>
        {/* Game Board */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <Game
              GameState={GameState}
              setGameState={setGameState}
              InitialState={InitialState}
              setInitialState={setInitialState}
              Time={Time}
              setTime={setTime}
              TimerOn={TimerOn}
              setTimerOn={setTimerOn}
              BottomText={BottomText}
              setBottomText={setBottomText}
              GameRunning={GameRunning}
              setGameRunning={setGameRunning}
              submitToserver={submitToserver}
              isLoggedIn={isLoggedIn}
              updateLeaderboard={updateLeaderboard}
            />
            <div className="w-full max-w-xs mt-4">
              <label className="block text-blue-800 font-bold mb-2">Difficulty Level</label>
              <input
                type="range"
                min={1}
                max={3}
                value={difficulty}
                onChange={(event) => setDifficulty(parseInt(event.target.value))}
                className="w-full accent-blue-700"
              />
            </div>
          </div>
          {/* Leaderboard and login/register */}
          <div className="flex-1 flex flex-col gap-6">
            <Leaderboard
              Scores={Scores}
              setScores={setScores}
              Games={Games}
              setGames={setGames}
              Times={Times}
              setTimes={setTimes}
            />
            <div className="bg-white rounded-lg shadow p-4" hidden={isLoggedIn}>
              <div className="text-blue-800 font-bold mb-2">Login/Register</div>
              <input
                type="text"
                placeholder="Enter username"
                value={usrname}
                onChange={(event) => setUsrname(event.target.value)}
                className="w-full mb-2 px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={pass}
                onChange={(event) => setPass(event.target.value)}
                className="w-full mb-2 px-3 py-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  className="mybutton flex-1"
                  onClick={handleRegister}
                >
                  Register
                </button>
                <button
                  className="mybutton flex-1"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4" hidden={!isLoggedIn}>
              <ul className="mb-2">
                <li>Username: {myDetails.username}</li>
                <li>Score: {myDetails.Score}</li>
                <li>Games played: {myDetails.Games}</li>
              </ul>
              <button onClick={handleLogout} className="mybutton">
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>
      <footer className="w-full text-center py-4 text-gray-500 text-sm border-t mt-8">
        Created by Somesh Shukla. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
