import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';

const [nROWS, nCOLS] = [100, 100];

const OPS = [
  [1, 0],
  [1, -1],
  [1, 1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [0, -1],
  [0, 1]
];

function App() {

  const [grid, setGrid] = useState(() => {
    let rows: number[][] = [];
    for(let i = 0; i < nROWS; i++) {
      rows = [...rows, Array.from(Array(nCOLS), () => 0)];
    }
    return rows;
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSim = useCallback(() => {
    if (!runningRef.current) return;

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < nROWS; i++) {
          for (let j = 0; j < nCOLS; j++) {
            let neighbors = 0;
            
            OPS.forEach(([x,y]) => {
              const nI = i + x;
              const nJ = j + y;
              if (nI >= 0 && nI < nROWS && nJ >= 0 && nJ < nCOLS) neighbors += g[nI][nJ];
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      })
    })

    

    setTimeout(runSim, 50)
  }, []);

  return (
    <>
      <button
        onClick = { () => {
          setRunning(!running);
          if(!running) {
            runningRef.current = true;
            runSim();
          }
        }}
      >
        { running ? `Stop` : `Start`}
      </button>
      <div 
        style = {{
          display: 'grid',
          gridTemplateColumns: `repeat(${nCOLS}, 10px)`
        }}
      >
        {grid.map(
          (row, i) => row.map( 
            (col, k) => <div 
                          style={
                            {
                              width: 10,
                              height: 10,
                              backgroundColor: grid[i][k] ? 'pink' : 'darkcyan',
                              border: 'solid 1px black'
                            }
                          } 
                          key={`r${i}:c${k}`}
                          onClick={ () => {
                            const newGrid = produce(grid, gridCopy => {
                              gridCopy[i][k] = grid[i][k] ? 0 : 1;
                            });

                            setGrid(newGrid);
                          }}
                          >

                        </div>
          )
        )}
      </div>
    </>
  );
}

export default App;
