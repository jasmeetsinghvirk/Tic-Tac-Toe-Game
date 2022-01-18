import { useEffect, useRef, useState } from "react";
import "./App.css";



function App() {
  const intervalRef = useRef(null);
  const [grid, setGrid] = useState(3);
  const [time, setTime] = useState(60);
  const [userPref, setUserPref] = useState(1);
  const [startGame, setStartGame] = useState(false);
  const [isCompEditing, setIsCompEditing] = useState(false);
  const [isFirst, setIsFirst] = useState(false);

  let initial = {
    player: 1,
    board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    gameOver: false,
    winner: undefined,
    steps: 0
  };

  let [boardState, setBoardState] = useState(initial);

  useEffect(() => {
    if (boardState.steps !== 0 && boardState.steps !== grid*grid && boardState.steps % 2 === 1) {
      setIsCompEditing(true);
      let row = Math.ceil(Math.random() * (grid));
      let col = Math.ceil(Math.random() * (grid));
      while(boardState.steps < (grid*grid) && boardState.board[row-1][col-1] !== 0){
        row = Math.ceil(Math.random() * (grid));
        col = Math.ceil(Math.random() * (grid));
      }
      console.log("***************")
      console.log(row, col)
      console.log("***************")
      let copyState = { ...boardState };
      if (copyState.board[row - 1][col - 1] === 0) {
        setTimeout(() => {
          copyState.board[row - 1][col - 1] = copyState.player;
          let result = gameLogin(copyState.board, copyState.player, row - 1, col - 1);
          if (result) {
            copyState.gameOver = true;
            copyState.winner = copyState.player;
            clearInterval(intervalRef.current);
            setStartGame(false);
          }
          copyState.steps += 1;      
          if (copyState.steps === (grid*grid)) {
            if (!result) {
              copyState.winner = "Draw";
              clearInterval(intervalRef.current);
              setStartGame(false);
            }
            copyState.gameOver = true;
          }      
          copyState.player = -copyState.player;
          setBoardState(copyState);
          setIsCompEditing(false);
        }, 1000)
      }     
    }
  // eslint-disable-next-line
  }, [boardState]);


  useEffect(() => {
    if (startGame) {
      intervalRef.current = setInterval(() => {
        setTime((t) => t - 1);
      }, 1000);
    }
    // eslint-disable-next-line
  }, [startGame]);

  useEffect(() => {
    if (time <= 0) {
      clearInterval(intervalRef.current);
      // alert("Match Draw");
      setBoardState(initial);
      setGrid(3);
      setTime(60);
      setStartGame(false);
    }
  // eslint-disable-next-line
  }, [time]);

  useEffect(
    () => {
      const board3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      const board4 = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      const board5 = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      let a;
      if (grid === 3) {
        a = board3;
      } else if (grid === 4) {
        a = board4;
      } else if (grid === 5) {
        a = board5;
      }
      setBoardState({
        ...boardState,
        board: a
      });
    },
    // eslint-disable-next-line
    [grid]
  );

  const handleGridChange = (noGrid) => {
    setStartGame(false);
    clearInterval(intervalRef.current);
    setBoardState(initial)
    setGrid(noGrid);
    setTime(noGrid === 5 ? 120 : noGrid === 4 ? 90 : 60);
  }

  const handleClick = (cindex, i) => {
    setStartGame(true);
    let copyState = { ...boardState };
    console.log(boardState)
    if (copyState.board[i][cindex] === 0) {
      copyState.board[i][cindex] = copyState.player;
      let result = gameLogin(copyState.board, copyState.player, i, cindex);
      if (result) {
        copyState.gameOver = true;
        copyState.winner = copyState.player;
        clearInterval(intervalRef.current);
        setStartGame(false);
      } else {
        copyState.winner = 0;
      }
      copyState.steps += 1;

      if (copyState.steps === (grid*grid)) {
        if (!result) {
          copyState.winner = "Draw";
          clearInterval(intervalRef.current);
          setStartGame(false);
        }
        copyState.gameOver = true;
      }

      copyState.player = -copyState.player;
      setBoardState(copyState);
    }
  };

  let gameLogin = (board, player, row, col) => {
    let rCount = 0;
    for (let r = 0; r < grid; r++) {
      if (board[r][col] === player) {
        rCount += 1;
      }
    }
    if (rCount === grid) {
      return true;
    }

    let cCount = 0;
    for (let c = 0; c < grid; c++) {
      if (board[row][c] === player) {
        cCount += 1;
      }
    }
    if (cCount === grid) {
      return true;
    }

    let lCount = 0;
    for (let l = 0; l < grid; l++) {
      if (board[l][l] === player) {
        lCount += 1;
      }
    }
    if (lCount === grid) {
      return true;
    }

    let drCount = 0;
    for (let dr = 0; dr < grid; dr++) {
      if (board[dr][grid - 1 - dr] === player) {
        drCount += 1;
      }
    }
    if (drCount === grid) {
      return true;
    }

    return false;
  };

  return (
    <div className="App">

    {!isFirst && (
      <div className="text-center">
        <h1>Welcome to Tic Tac Toe Game!!</h1>
        <p className="font-weight-bold">Please Choose</p>
        <button className="btn btn-primary mr-2" onClick={function() { setBoardState({...boardState, player: 1}); setUserPref(1); setIsFirst(true)}}>O</button> or
        <button className="btn btn-warning ml-2" onClick={function() { setBoardState({...boardState, player: -1}); setUserPref(-1); setIsFirst(true)}}>X</button>
      </div>
    )}
      


      {isFirst && (
        <>
        <div>
          <h1>Enjoy The Game!!</h1>
        </div>
        <div className="timer">
          <p>Time left: <span className="font-weight-bold text-danger">{time}</span> seconds</p>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <h6 className="mt-2">Select Maze:</h6>
        <button className="btn btn-danger " onClick={() => handleGridChange(3)}>3x3</button>
        <button className="btn btn-primary " onClick={() => handleGridChange(4)}>4x4</button>
        <button className="btn btn-success " onClick={() => handleGridChange(5)}>5x5</button>
      </div>
      <div className="tictac_container">
        {boardState &&
          boardState.board.map((row, i) =>
            <div className="ticRow" key={i}>
              {row.map((item, cindex) => {
                return (
                  <button
                    key={cindex}
                    className="tictacbtn"
                    disabled={isCompEditing || boardState.gameOver}
                    onClick={() => handleClick(cindex, i)}
                  >
                    {item === 0 ? undefined : item === 1 ? "O" : "X"}
                  </button>
                );
              })}
            </div>
          )}
      </div>
      {!boardState.gameOver &&
        <h4>
          Current Move: <span className="text-success">Player {boardState.player === 1 ? "O" : "X"}</span>
        </h4>}
        <h4>
          You are: Player {userPref === 1 ? "O" : "X"}
        </h4>
      {boardState.gameOver &&
        <div>
          <h1>
            {(boardState.winner === 1 && "Winner is O") ||
              (boardState.winner === -1 && "Winner is X") ||
              boardState.winner}
          </h1>
        </div>}
      <button className="btn btn-warning" onClick={function() { setBoardState(initial); setTime(60); clearInterval(intervalRef.current); }}>Reset</button>
      </>
      )}
      
    </div>
  );
}

export default App;
