import { useState, useEffect } from 'react';
import { useSession } from './hooks/useSession';
import RegistroPage from './pages/RegistroPage';
import GestionTapasPage from './pages/GestionTapasPage';
import VotacionPage from './pages/VotacionPage';
import EsperaPage from './pages/EsperaPage';
import ResultadosPage from './pages/ResultadosPage';

function App() {
  const { session, loading, saveSession } = useSession();
  const [currentScreen, setCurrentScreen] = useState('registro');

  useEffect(() => {
    // Determine which screen to show based on session
    if (session) {
      // User is logged in, check if they've already finalized
      if (session.finalized) {
        setCurrentScreen('espera');
      } else if (session.tapas_registered) {
        setCurrentScreen('votacion');
      } else {
        setCurrentScreen('gestion');
      }
    } else {
      setCurrentScreen('registro');
    }
  }, [session]);

  const handleRegister = (sessionData) => {
    saveSession({
      ...sessionData,
      tapas_registered: false,
      finalized: false,
    });
    // Don't manually set screen - let useEffect handle it
  };

  const handleTapasComplete = () => {
    saveSession({
      ...session,
      tapas_registered: true,
    });
    // Don't manually set screen - let useEffect handle it
  };

  const handleVotingFinalize = () => {
    saveSession({
      ...session,
      finalized: true,
    });
    // Don't manually set screen - let useEffect handle it
  };

  const handleAllReady = () => {
    setCurrentScreen('resultados');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentScreen === 'registro' && (
        <RegistroPage onRegister={handleRegister} />
      )}

      {currentScreen === 'gestion' && session && (
        <GestionTapasPage
          session={session}
          onComplete={handleTapasComplete}
        />
      )}

      {currentScreen === 'votacion' && session && (
        <VotacionPage
          session={session}
          onFinalize={handleVotingFinalize}
        />
      )}

      {currentScreen === 'espera' && (
        <EsperaPage onAllReady={handleAllReady} />
      )}

      {currentScreen === 'resultados' && (
        <ResultadosPage />
      )}
    </div>
  );
}

export default App;
