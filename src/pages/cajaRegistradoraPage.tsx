import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../style/style.css';

type Direction = 'up' | 'down' | 'left' | 'right';

const CajaRegistradoraPage = () => {
  const navigate = useNavigate();
  const gridSize = 14;
  const moveDistance = 2; // Se mueve 2 casillas por movimiento
  const targetSize = 2; // Target ocupa 2x2
  
  const [grid, setGrid] = useState<Direction[][]>([]);
  const [availableCells, setAvailableCells] = useState<{x: number, y: number}[]>([]);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [movesUsed, setMovesUsed] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);
  const [showInstructions, setShowInstructions] = useState(true);
  const [countdown, setCountdown] = useState(0); // Countdown de 5 segundos antes de iniciar

  // Función para generar posiciones aleatorias con distancia variable
  const generatePositions = useCallback(() => {
    // Distancia mínima aleatoria:
    // Cerca: 7-9, Media: 10-12, Lejos: 13-15
    const minDistance = Math.floor(Math.random() * 9) + 7; // 7, 8, 9, 10, 11, 12, 13, 14, 15
    let targetX, targetY, startX, startY;
    let attempts = 0;
    const maxAttempts = 100;

    // Esquinas posibles (siempre en posiciones pares)
    const corners = [
      { x: 0, y: 0 },           // Superior izquierda
      { x: 12, y: 0 },          // Superior derecha
      { x: 0, y: 12 },          // Inferior izquierda
      { x: 12, y: 12 },         // Inferior derecha
      { x: 0, y: 6 },           // Medio izquierda
      { x: 12, y: 6 },          // Medio derecha
      { x: 6, y: 0 },           // Medio superior
      { x: 6, y: 12 }           // Medio inferior
    ];

    do {
      // 80% probabilidad de esquina, 20% posición aleatoria
      const useCorner = Math.random() < 0.8;

      if (useCorner) {
        // Elegir esquinas aleatorias para TARGET e inicio
        const targetCorner = corners[Math.floor(Math.random() * corners.length)];
        targetX = targetCorner.x;
        targetY = targetCorner.y;

        const startCorner = corners[Math.floor(Math.random() * corners.length)];
        startX = startCorner.x;
        startY = startCorner.y;
      } else {
        // Generar posiciones aleatorias (siempre en posiciones pares)
        targetX = Math.floor(Math.random() * (gridSize / 2 - 1)) * 2;
        targetY = Math.floor(Math.random() * (gridSize / 2 - 1)) * 2;
        startX = Math.floor(Math.random() * (gridSize / 2 - 1)) * 2;
        startY = Math.floor(Math.random() * (gridSize / 2 - 1)) * 2;
      }

      // Calcular distancia Manhattan
      const distance = Math.abs(targetX - startX) + Math.abs(targetY - startY);
      
      attempts++;
      
      // Si la distancia es suficiente o hemos intentado muchas veces, aceptar
      if (distance >= minDistance || attempts >= maxAttempts) {
        break;
      }
    } while (true);

    return { targetX, targetY, startX, startY };
  }, [gridSize]);

  // Generar grid con solución garantizada
  const generateGridWithSolution = useCallback((startX: number, startY: number, targetX: number, targetY: number) => {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    const newGrid: Direction[][] = [];
    
    // Inicializar grid con flechas aleatorias
    for (let i = 0; i < gridSize; i++) {
      const row: Direction[] = [];
      for (let j = 0; j < gridSize; j++) {
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        row.push(randomDir);
      }
      newGrid.push(row);
    }

    // Crear un camino válido desde inicio hasta target
    let currentX = startX;
    let currentY = startY;
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts && (Math.abs(currentX - targetX) > 1 || Math.abs(currentY - targetY) > 1)) {
      let direction: Direction;
      
      // Decidir dirección hacia el target
      if (Math.abs(currentX - targetX) > Math.abs(currentY - targetY)) {
        // Moverse horizontalmente
        direction = currentX < targetX ? 'right' : 'left';
      } else {
        // Moverse verticalmente
        direction = currentY < targetY ? 'down' : 'up';
      }

      // Colocar la flecha en una de las celdas del bloque actual
      const cellsInBlock = [
        { x: currentX, y: currentY },
        { x: currentX + 1, y: currentY },
        { x: currentX, y: currentY + 1 },
        { x: currentX + 1, y: currentY + 1 }
      ];

      // Elegir una celda aleatoria del bloque para colocar la dirección correcta
      const randomCell = cellsInBlock[Math.floor(Math.random() * cellsInBlock.length)];
      if (randomCell.y < gridSize && randomCell.x < gridSize) {
        newGrid[randomCell.y][randomCell.x] = direction;
      }

      // Mover el bloque
      switch (direction) {
        case 'up':
          currentY = Math.max(0, currentY - moveDistance);
          break;
        case 'down':
          currentY = Math.min(gridSize - 2, currentY + moveDistance);
          break;
        case 'left':
          currentX = Math.max(0, currentX - moveDistance);
          break;
        case 'right':
          currentX = Math.min(gridSize - 2, currentX + moveDistance);
          break;
      }

      attempts++;
    }

    return newGrid;
  }, [gridSize, moveDistance]);

  // Inicializar grid con flechas aleatorias y posiciones
  useEffect(() => {
    // Generar posiciones aleatorias para target e inicio
    const { targetX, targetY, startX, startY } = generatePositions();
    
    // Generar grid con solución garantizada
    const newGrid = generateGridWithSolution(startX, startY, targetX, targetY);
    setGrid(newGrid);
    
    setTargetPos({ x: targetX, y: targetY });
    setAvailableCells([
      { x: startX, y: startY },
      { x: startX + 1, y: startY },
      { x: startX, y: startY + 1 },
      { x: startX + 1, y: startY + 1 }
    ]);
  }, [generatePositions, generateGridWithSolution]);

  // Obtener símbolo de flecha
  const getArrowSymbol = (direction: Direction) => {
    switch (direction) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'left': return '←';
      case 'right': return '→';
    }
  };

  // Countdown inicial de 5 segundos
  useEffect(() => {
    if (countdown > 0 && !gameWon && !gameLost) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown, gameWon, gameLost]);

  // Temporizador del juego (solo cuando countdown = 0)
  useEffect(() => {
    if (gameWon || gameLost || showInstructions || countdown > 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameLost(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameWon, gameLost, showInstructions, countdown]);

  // Mover jugador al hacer click en una de las celdas disponibles
  const handleCellClick = useCallback((x: number, y: number) => {
    // No permitir movimientos durante el countdown
    if (countdown > 0) return;
    
    // Verificar si la celda clickeada está en las celdas disponibles
    const isAvailable = availableCells.some(cell => cell.x === x && cell.y === y);
    if (!isAvailable) return;
    if (gameWon || gameLost) return;

    // Obtener dirección de la flecha de la celda clickeada
    const direction = grid[y]?.[x];
    if (!direction) return;

    // Mover TODO el bloque en la dirección de la flecha clickeada
    // Calculamos el desplazamiento (siempre múltiplo de 2 para mantener alineación)
    let deltaX = 0;
    let deltaY = 0;

    switch (direction) {
      case 'up':
        deltaY = -moveDistance;
        break;
      case 'down':
        deltaY = moveDistance;
        break;
      case 'left':
        deltaX = -moveDistance;
        break;
      case 'right':
        deltaX = moveDistance;
        break;
    }

    // Calcular nuevas posiciones del bloque
    const newAvailableCells = availableCells.map(cell => ({
      x: cell.x + deltaX,
      y: cell.y + deltaY
    }));

    // Validar que TODAS las celdas del bloque estén dentro del tablero
    const allCellsValid = newAvailableCells.every(cell => 
      cell.x >= 0 && cell.x < gridSize && cell.y >= 0 && cell.y < gridSize
    );

    // Si alguna celda se sale, pierdes el juego
    if (!allCellsValid) {
      setGameLost(true);
      return;
    }

    setAvailableCells(newAvailableCells);

    // Verificar si alguna celda del nuevo bloque llegó al target
    const wonGame = newAvailableCells.some(cell => 
      cell.x >= targetPos.x && cell.x < targetPos.x + targetSize &&
      cell.y >= targetPos.y && cell.y < targetPos.y + targetSize
    );

    if (wonGame) {
      setGameWon(true);
    }

    // Contar movimientos (sin límite)
    setMovesUsed(m => m + 1);
  }, [availableCells, gameWon, gameLost, countdown, grid, targetPos, targetSize, moveDistance, gridSize]);

  // No hay controles de teclado, solo clicks

  // Reiniciar juego
  const resetGame = () => {
    // Generar nuevas posiciones aleatorias para target e inicio
    const { targetX, targetY, startX, startY } = generatePositions();
    
    // Generar grid con solución garantizada
    const newGrid = generateGridWithSolution(startX, startY, targetX, targetY);
    setGrid(newGrid);
    
    setTargetPos({ x: targetX, y: targetY });
    setAvailableCells([
      { x: startX, y: startY },
      { x: startX + 1, y: startY },
      { x: startX, y: startY + 1 },
      { x: startX + 1, y: startY + 1 }
    ]);
    
    setMovesUsed(0);
    setTimeLeft(8);
    setCountdown(5); // Iniciar countdown de 5 segundos
    setGameWon(false);
    setGameLost(false);
  };

  // Verificar si la celda está dentro del área del target
  const isInTargetArea = (x: number, y: number) => {
    return x >= targetPos.x && x < targetPos.x + targetSize &&
           y >= targetPos.y && y < targetPos.y + targetSize;
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(to bottom right, rgb(10, 35, 40), rgb(29, 126, 115), rgb(10, 35, 40))' }}>
      <Navbar />

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{ backgroundColor: '#3BB9AB' }}></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: '#5FEDD8' }}></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 py-8 pt-28">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="backdrop-blur-xl inline-block px-8 py-4 rounded-2xl shadow-2xl border border-white/10" style={{ background: 'linear-gradient(to right, rgba(29, 126, 115, 0.95), rgba(42, 157, 143, 0.95))' }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white">🎮 Caja Registradora</h1>
            <p className="text-white/80 mt-2">Llega al TARGET</p>
          </div>
        </div>

        {/* Mostrar solo si NO hay countdown */}
        {countdown === 0 && (
          <>
            {/* Stats */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-center gap-4 flex-wrap">
              <div className="backdrop-blur-xl bg-white/10 rounded-xl px-6 py-3 border border-white/10">
                <p className="text-white font-semibold">Movimientos: <span className="text-cyan-300">{movesUsed}</span></p>
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-xl px-6 py-3 border border-white/10">
                <p className="text-white font-semibold">Tiempo: <span className={timeLeft <= 3 ? "text-red-400 animate-pulse" : "text-green-400"}>{timeLeft}s</span></p>
              </div>
              <button
                onClick={resetGame}
                className="backdrop-blur-xl bg-white/10 hover:bg-white/20 rounded-xl px-6 py-3 border border-white/10 text-white font-semibold transition-all duration-300"
              >
                🔄 Reiniciar
              </button>
            </div>

            {/* Game Board */}
            <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl p-4 md:p-8 border border-white/10">
            <div 
              className="grid gap-0.5 mx-auto"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                maxWidth: '600px'
              }}
            >
              {grid.map((row, y) => 
                row.map((cell, x) => {
                  const isAvailable = availableCells.some(c => c.x === x && c.y === y);
                  const isTarget = isInTargetArea(x, y);
                  const isTopLeftTarget = x === targetPos.x && y === targetPos.y;
                  const isTopRightTarget = x === targetPos.x + 1 && y === targetPos.y;
                  const isBottomLeftTarget = x === targetPos.x && y === targetPos.y + 1;
                  const isBottomRightTarget = x === targetPos.x + 1 && y === targetPos.y + 1;

                  // Determinar posición en el bloque de jugador
                  let isPlayerTopLeft = false;
                  let isPlayerTopRight = false;
                  let isPlayerBottomLeft = false;
                  let isPlayerBottomRight = false;

                  if (isAvailable && availableCells.length === 4) {
                    const minX = Math.min(...availableCells.map(c => c.x));
                    const minY = Math.min(...availableCells.map(c => c.y));
                    isPlayerTopLeft = x === minX && y === minY;
                    isPlayerTopRight = x === minX + 1 && y === minY;
                    isPlayerBottomLeft = x === minX && y === minY + 1;
                    isPlayerBottomRight = x === minX + 1 && y === minY + 1;
                  }

                  // Clases dinámicas
                  let cellClasses = 'aspect-square flex items-center justify-center text-lg md:text-2xl font-bold transition-all duration-200 relative ';
                  
                  if (isAvailable) {
                    cellClasses += 'game-player-cell cursor-pointer ';
                    if (isPlayerTopLeft) cellClasses += 'game-player-top-left ';
                    if (isPlayerTopRight) cellClasses += 'game-player-top-right ';
                    if (isPlayerBottomLeft) cellClasses += 'game-player-bottom-left ';
                    if (isPlayerBottomRight) cellClasses += 'game-player-bottom-right ';
                  } else if (isTarget) {
                    cellClasses += 'game-target-cell ';
                    if (isTopLeftTarget) cellClasses += 'game-target-top-left ';
                    if (isTopRightTarget) cellClasses += 'game-target-top-right ';
                    if (isBottomLeftTarget) cellClasses += 'game-target-bottom-left ';
                    if (isBottomRightTarget) cellClasses += 'game-target-bottom-right ';
                  } else {
                    cellClasses += 'game-grid-cell rounded';
                  }

                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className={cellClasses}
                      onClick={() => handleCellClick(x, y)}
                      title={isAvailable ? `Click para moverte ${getArrowSymbol(cell)}` : ''}
                    >
                      {isAvailable ? (
                        <span className="text-white font-bold">{getArrowSymbol(cell)}</span>
                      ) : isTopLeftTarget ? (
                        <div className="game-target-content">
                          <div className="game-target-icon">🎯</div>
                          <div className="game-target-text">TARGET</div>
                        </div>
                      ) : isTarget ? (
                        null
                      ) : (
                        <span className="text-white/60">{getArrowSymbol(cell)}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Barra de progreso del tiempo */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="backdrop-blur-xl bg-white/10 rounded-full h-6 overflow-hidden border border-white/20">
                <div 
                  className="h-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(timeLeft / 8) * 100}%`,
                    background: timeLeft <= 3 
                      ? 'linear-gradient(to right, #FF4444, #CC0000)' 
                      : 'linear-gradient(to right, #2A9D8F, #3BB9AB)'
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-bold text-sm">{timeLeft}s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="mt-4 text-center">
              <p className="text-white/80 text-lg font-semibold mb-2">👆 Click en cualquiera de las 4 celdas con borde dorado</p>
              <p className="text-white/60 text-sm">El bloque completo se moverá 2 celdas en la dirección de la flecha</p>
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Modal de Countdown */}
      {countdown > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-9xl font-bold text-white mb-4 animate-pulse">
              {countdown}
            </div>
            <p className="text-3xl text-white/80">Preparándose...</p>
          </div>
        </div>
      )}

      {/* Modal de Instrucciones */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">📖 Instrucciones</h2>
            <div className="space-y-3 text-white/90 text-lg">
              <p>🎯 <strong>Objetivo:</strong> Llega al TARGET (🎯) rojo en 8 segundos</p>
              <p>👆 <strong>Controles:</strong> Haz click en UNA de las 4 celdas con borde dorado</p>
              <p>➡️ <strong>Movimiento:</strong> El bloque completo se mueve 2 celdas según la flecha</p>
              <p>📍 <strong>Bloque 2x2:</strong> Las 4 celdas se mueven juntas manteniéndose alineadas</p>
              <p>⏱️ <strong>Tiempo:</strong> Tienes 8 segundos - ¡apresúrate!</p>
              <p>⚠️ <strong>Cuidado:</strong> Si sales del tablero, ¡pierdes!</p>
            </div>
            <button
              onClick={() => {
                setShowInstructions(false);
                setCountdown(5); // Iniciar countdown de 5 segundos
              }}
              className="w-full mt-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)',
                boxShadow: '0 10px 30px rgba(42, 157, 143, 0.3)'
              }}
            >
              ¡Empezar a Jugar!
            </button>
          </div>
        </div>
      )}

      {/* Modal de Derrota */}
      {gameLost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md animate-slideUp">
            <div className="text-center">
              <div className="text-6xl mb-4">{timeLeft === 0 ? '⏱️' : '💥'}</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                {timeLeft === 0 ? '¡Se acabó el tiempo!' : '¡Perdiste!'}
              </h2>
              <p className="text-xl text-red-400 mb-2">
                {timeLeft === 0 ? 'Tiempo agotado' : 'Saliste del tablero'}
              </p>
              <p className="text-white/80 mb-6">Movimientos usados: {movesUsed}</p>
              
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)',
                    boxShadow: '0 10px 30px rgba(42, 157, 143, 0.3)'
                  }}
                >
                  🔄 Intentar de Nuevo
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-white/10 hover:bg-white/20"
                >
                  ← Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Victoria */}
      {gameWon && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md animate-slideUp">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-4">¡Ganaste!</h2>
              <p className="text-2xl text-cyan-300 mb-2">Movimientos usados: {movesUsed}</p>
              <p className="text-white/80 mb-6">¡Llegaste al TARGET!</p>
              
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)',
                    boxShadow: '0 10px 30px rgba(42, 157, 143, 0.3)'
                  }}
                >
                  🔄 Jugar de Nuevo
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-white/10 hover:bg-white/20"
                >
                  ← Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CajaRegistradoraPage;
