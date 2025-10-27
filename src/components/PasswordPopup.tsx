import React, { useState, useEffect } from 'react';
import { validatePassword, saveAuthentication, isAuthenticated } from '../utils/auth';

interface PasswordPopupProps {
  onAuthenticated: () => void;
}

const PasswordPopup: React.FC<PasswordPopupProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Verificar si ya está autenticado al montar
  useEffect(() => {
    if (isAuthenticated()) {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePassword(password)) {
      saveAuthentication();
      setError('');
      onAuthenticated();
    } else {
      setError('❌ Contraseña incorrecta');
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    // Overlay con el mismo fondo gradiente que la home
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, rgb(10, 35, 40), rgb(29, 126, 115), rgb(10, 35, 40))' }}>
      <div 
        className={`rounded-3xl shadow-2xl p-8 max-w-md w-full ${shake ? 'animate-shake' : ''}`}
        style={{
          background: 'linear-gradient(135deg, rgba(6,78,59,1), rgba(16,120,116,1))',
          border: '1px solid rgba(255,255,255,0.06)',
          animation: shake ? 'shake 0.5s' : 'none'
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/ChangosLogo.png" 
            alt="Changos Logo" 
            className="w-32 h-32 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            🔐 Gang Web Changos
          </h2>
          <p className="text-white/80 text-lg">
            Ingresa la contraseña para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Contraseña"
              autoFocus
              style={{ caretColor: '#ffffff' }}
              className="w-full px-6 py-4 rounded-xl bg-transparent border border-white/20 text-white text-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-xl px-4 py-3 text-center">
              <p className="text-red-200 font-semibold">{error}</p>
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/10"
          >
            🚀 Entrar
          </button>
        </form>

        {/* Info adicional */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            🔒 Acceso protegido | Gang Web Changos
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default PasswordPopup;
