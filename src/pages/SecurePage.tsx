import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import '../style/style.css';

const SecurePage = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [gamePhase, setGamePhase] = useState<'playing' | 'won' | 'lost'>('playing');
  // Posiciones de las 4 celdas del selector (array de {row, col})
  const [selectorPositions, setSelectorPositions] = useState<Array<{row: number, col: number}>>(
    [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}]
  );
  const [wrongSelection, setWrongSelection] = useState(false);
  const [correctSelection, setCorrectSelection] = useState(false);

  // Generar matriz y secuencia aleatorias
  const generateGame = () => {
    // Generar matriz de números aleatorios de 2 dígitos (10-99)
    const newMatrix: number[][] = [];
    for (let i = 0; i < 8; i++) {
      const row: number[] = [];
      for (let j = 0; j < 10; j++) {
        row.push(Math.floor(Math.random() * 90) + 10); // 10 a 99
      }
      newMatrix.push(row);
    }

    // Generar 4 números aleatorios para la secuencia (10-99)
    const sequence: number[] = [];
    for (let i = 0; i < 4; i++) {
      sequence.push(Math.floor(Math.random() * 90) + 10);
    }

    // Colocar la secuencia consecutiva en una posición aleatoria de la matriz
    // Elegir una fila aleatoria
    const row = Math.floor(Math.random() * 8);
    // Elegir una columna de inicio que permita colocar 4 números (0-6, ya que 10-4=6)
    const startCol = Math.floor(Math.random() * 7); // 0 a 6
    
    // Colocar los 4 números consecutivos
    for (let i = 0; i < 4; i++) {
      newMatrix[row][startCol + i] = sequence[i];
    }

    return { matrix: newMatrix, sequence };
  };

  const [gameData, setGameData] = useState(() => generateGame());
  const [matrix, setMatrix] = useState(gameData.matrix);
  const targetSequence = gameData.sequence;

  // Mover la matriz hacia la izquierda cada segundo
  useEffect(() => {
    if (gamePhase !== 'playing' || showInstructions || correctSelection) return;

    const interval = setInterval(() => {
      setMatrix(prevMatrix => {
        // Aplanar la matriz en un array 1D
        const flatArray: number[] = [];
        for (let i = 0; i < prevMatrix.length; i++) {
          for (let j = 0; j < prevMatrix[i].length; j++) {
            flatArray.push(prevMatrix[i][j]);
          }
        }
        
        // Mover todos los elementos una posición hacia la izquierda (rotar)
        const firstElement = flatArray.shift()!; // Quitar el primer elemento
        flatArray.push(firstElement); // Agregarlo al final
        
        // Reconstruir la matriz 2D
        const newMatrix: number[][] = [];
        let index = 0;
        for (let i = 0; i < prevMatrix.length; i++) {
          const row: number[] = [];
          for (let j = 0; j < prevMatrix[i].length; j++) {
            row.push(flatArray[index]);
            index++;
          }
          newMatrix.push(row);
        }
        
        return newMatrix;
      });
    }, 1000); // Cada 1 segundo

    return () => clearInterval(interval);
  }, [gamePhase, showInstructions, correctSelection]);


  const checkSelection = useCallback(() => {
    // Obtener los 4 números seleccionados
    const selectedNumbers = selectorPositions.map(pos => matrix[pos.row][pos.col]);

    // Verificar si coinciden con la secuencia objetivo
    const isCorrect = selectedNumbers.every((num, idx) => num === targetSequence[idx]);

    if (isCorrect) {
      // Mostrar las celdas en verde
      setCorrectSelection(true);
      // Esperar 2 segundos antes de mostrar el popup
      setTimeout(() => {
        setCorrectSelection(false);
        setGamePhase('won');
      }, 2000);
    } else {
      setWrongSelection(true);
      setTimeout(() => setWrongSelection(false), 300);
      setGamePhase('lost');
    }
  }, [matrix, selectorPositions, targetSequence]);

  // Manejar teclas del teclado
  useEffect(() => {
    if (gamePhase !== 'playing' || showInstructions) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectorPositions(prev => prev.map(pos => ({
            row: pos.row > 0 ? pos.row - 1 : 7,
            col: pos.col
          })));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectorPositions(prev => prev.map(pos => ({
            row: pos.row < 7 ? pos.row + 1 : 0,
            col: pos.col
          })));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectorPositions(prev => prev.map(pos => {
            if (pos.col > 0) {
              return { row: pos.row, col: pos.col - 1 };
            } else {
              // Si está en columna 0, ir a columna 9 y subir una fila
              return {
                row: pos.row > 0 ? pos.row - 1 : 7,
                col: 9
              };
            }
          }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectorPositions(prev => prev.map(pos => {
            if (pos.col < 9) {
              return { row: pos.row, col: pos.col + 1 };
            } else {
              // Si está en columna 9, ir a columna 0 y bajar una fila
              return {
                row: pos.row < 7 ? pos.row + 1 : 0,
                col: 0
              };
            }
          }));
          break;
        case 'Enter':
          e.preventDefault();
          checkSelection();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, showInstructions, checkSelection]);

  const resetGame = () => {
    setGamePhase('playing');
    setSelectorPositions([{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}]);
    setWrongSelection(false);
    setCorrectSelection(false);
    const newGame = generateGame();
    setGameData(newGame);
    setMatrix(newGame.matrix); // Resetear matriz al estado inicial
  };

  const startGame = () => {
    setShowInstructions(false);
  };

  const isInSelector = (rowIndex: number, colIndex: number) => {
    return selectorPositions.some(pos => pos.row === rowIndex && pos.col === colIndex);
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(to bottom right, rgb(10, 35, 40), rgb(29, 126, 115), rgb(10, 35, 40))' }}>
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-28">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="backdrop-blur-xl inline-block px-8 py-4 rounded-2xl shadow-2xl border border-white/10" style={{ background: 'linear-gradient(to right, rgba(29, 126, 115, 0.95), rgba(42, 157, 143, 0.95))' }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white">🔢 Matriz de Seguridad</h1>
            <p className="text-white/80 mt-2">Encuentra la secuencia correcta</p>
          </div>
        </div>

        {/* Tablero del juego */}
        {!showInstructions && (
          <>
            <div className="max-w-4xl mx-auto">
              <div className="backdrop-blur-xl bg-black/70 rounded-2xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-white font-bold text-xl text-center mb-3">Matriz de Seguridad</h2>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6"></div>

                {/* Secuencia a buscar */}
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-6">
                    {targetSequence.map((num, idx) => (
                      <div
                        key={idx}
                        className="font-mono font-bold text-4xl text-red-500"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6"></div>

                {/* Matriz de números */}
                <div className="bg-black/80 p-4 rounded-xl mb-6">
                  <div className="grid gap-1">
                    {matrix.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1 justify-center">
                        {row.map((number, colIndex) => {
                          const inSelector = isInSelector(rowIndex, colIndex);

                          return (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                              className={`
                                w-12 h-12 font-mono text-lg font-bold rounded flex items-center justify-center transition-all duration-200
                                ${
                                  inSelector
                                    ? correctSelection
                                      ? 'text-green-500'
                                      : wrongSelection
                                      ? 'text-red-500'
                                      : 'text-red-500'
                                    : 'text-white/90'
                                }
                              `}
                            >
                              {number < 10 ? `0${number}` : number}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6"></div>

                {/* Instrucciones */}
                <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                  <p className="text-white/80 text-center text-sm mb-2">
                    Usa las flechas para mover el selector y Enter para confirmar
                  </p>
                  <p className="text-white/70 text-center text-sm mb-2">
                    Usa las <span className="text-cyan-400 font-bold">← → ↑ ↓</span> para mover el selector rojo
                  </p>
                  <p className="text-white/70 text-center text-sm">
                    Presiona <span className="text-green-400 font-bold">Enter</span> para confirmar tu selección
                  </p>
                </div>

                {/* Botón Reiniciar */}
                {gamePhase !== 'won' && gamePhase !== 'lost' && (
                  <div className="flex justify-center">
                    <button
                      onClick={resetGame}
                      className="backdrop-blur-xl bg-white/10 hover:bg-white/20 rounded-xl px-8 py-3 border border-white/10 text-white font-semibold transition-all duration-300"
                    >
                      🔄 Reiniciar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de Instrucciones */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md">
            <div className="text-center">
              <div className="text-6xl mb-4">🔢</div>
              <h2 className="text-3xl font-bold text-white mb-4">Matriz de Seguridad</h2>
              <div className="text-white/90 text-center space-y-3 mb-6">
                <p className="font-bold">Instrucciones:</p>
                <p>Los <span className="text-red-400 font-bold">4 números rojos</span> son tu selector</p>
                <p>Usa las <span className="text-cyan-400 font-bold">← → ↑ ↓</span> para moverlo</p>
                <p>Presiona <span className="text-green-400 font-bold">Enter</span> cuando encuentres la secuencia correcta</p>
                <p className="text-yellow-400 font-bold">⚠️ Los números se mueven hacia la izquierda cada segundo</p>
                <p className="text-sm text-white/70">Una selección incorrecta termina el juego</p>
              </div>
              
              <button
                onClick={startGame}
                className="w-full py-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)',
                  boxShadow: '0 10px 30px rgba(42, 157, 143, 0.3)'
                }}
              >
                ¡Empezar a Jugar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Victoria */}
      {gamePhase === 'won' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md animate-scaleIn">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-green-400 mb-4">¡Ganaste!</h2>
              <p className="text-white/80 text-lg mb-6">
                ¡Encontraste la secuencia correcta!
              </p>
              
              <button
                onClick={resetGame}
                className="w-full py-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                }}
              >
                🔄 Jugar de Nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Derrota */}
      {gamePhase === 'lost' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md animate-scaleIn">
            <div className="text-center">
              <div className="text-6xl mb-4">😞</div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">Perdiste</h2>
              <p className="text-white/80 text-lg mb-6">
                ¡Número incorrecto!
              </p>
              
              <button
                onClick={resetGame}
                className="w-full py-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
                }}
              >
                🔄 Intentar de Nuevo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurePage;
