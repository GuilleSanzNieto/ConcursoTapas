import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { calculateWinner, getTopThree } from '../utils/winnerCalculation';
import Confetti from 'react-confetti';
import { Trophy, Award, Medal } from 'lucide-react';

export default function ResultadosPage() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        loadResults();

        // Stop confetti after 10 seconds
        const timer = setTimeout(() => setShowConfetti(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    const loadResults = async () => {
        try {
            const [votos, tapas] = await Promise.all([
                db.getAllVotos(),
                db.getTapas(),
            ]);

            const results = calculateWinner(votos, tapas);
            setRanking(results);
        } catch (error) {
            console.error('Error loading results:', error);
            alert('Error al cargar resultados');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    const topThree = getTopThree(ranking);

    return (
        <div className="min-h-screen p-4 py-8">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={true}
                    numberOfPieces={200}
                />
            )}

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl mb-4 animate-float">
                        <Trophy className="w-16 h-16 text-yellow-900" />
                    </div>
                    <h1 className="text-5xl font-bold text-gradient mb-2">
                        ¡Resultados Finales!
                    </h1>
                    <p className="text-white/60 text-lg">
                        Felicidades a los ganadores
                    </p>
                </div>

                {/* Podium */}
                {topThree.length >= 3 && (
                    <div className="mb-12 grid grid-cols-3 gap-4 items-end animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {/* 2nd Place */}
                        <PodiumPlace
                            place={2}
                            result={topThree[1]}
                            icon={Medal}
                            iconColor="text-gray-400"
                            bgGradient="from-gray-400 to-gray-500"
                            delay={400}
                        />

                        {/* 1st Place */}
                        <PodiumPlace
                            place={1}
                            result={topThree[0]}
                            icon={Trophy}
                            iconColor="text-yellow-400"
                            bgGradient="from-yellow-400 to-yellow-600"
                            delay={200}
                            isFirst
                        />

                        {/* 3rd Place */}
                        <PodiumPlace
                            place={3}
                            result={topThree[2]}
                            icon={Award}
                            iconColor="text-orange-600"
                            bgGradient="from-orange-400 to-orange-600"
                            delay={600}
                        />
                    </div>
                )}

                {/* Full Ranking */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Ranking Completo
                    </h2>

                    {ranking.map((result, index) => (
                        <div
                            key={result.tapa.id}
                            className="card animate-in fade-in slide-in-from-bottom-2 duration-300"
                            style={{
                                animationDelay: `${800 + index * 50}ms`,
                                borderLeftWidth: '4px',
                                borderLeftColor: result.tapa.equipo?.color || '#fff',
                            }}
                        >
                            <div className="flex items-center gap-4">
                                {/* Position */}
                                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl
                  ${index < 3
                                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900'
                                        : 'bg-white/10 text-white/60'
                                    }
                `}>
                                    #{index + 1}
                                </div>

                                {/* Tapa Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-white truncate">
                                        {result.tapa.nombre_tapa}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: result.tapa.equipo?.color }}
                                        />
                                        <span className="text-sm text-white/60">
                                            {result.tapa.equipo?.nombre} · Tapa #{result.tapa.orden}
                                        </span>
                                    </div>
                                    {result.warning && (
                                        <p className="text-xs text-yellow-400 mt-1">
                                            ⚠️ {result.warning}
                                        </p>
                                    )}
                                </div>

                                {/* Score */}
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-gradient">
                                        {result.puntuacionFinal.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-white/40">
                                        {result.numVotos} votos
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {ranking.length === 0 && (
                        <div className="card text-center text-white/60">
                            No hay resultados disponibles
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PodiumPlace({ place, result, icon: Icon, iconColor, bgGradient, delay, isFirst }) {
    const heights = { 1: 'h-64', 2: 'h-48', 3: 'h-40' };

    return (
        <div
            className="animate-in fade-in slide-in-from-bottom-8 duration-500"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`${heights[place]} bg-gradient-to-b ${bgGradient} rounded-t-2xl p-4 flex flex-col justify-between ${isFirst ? 'scale-110' : ''}`}>
                <div className="text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${iconColor}`} />
                    <div className="text-4xl font-bold text-white mb-1">
                        {place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉'}
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                        {result.puntuacionFinal.toFixed(1)}
                    </div>
                    <div className="text-sm font-semibold text-white/90 truncate px-2">
                        {result.tapa.nombre_tapa}
                    </div>
                    <div className="text-xs text-white/70 mt-1">
                        {result.tapa.equipo?.nombre}
                    </div>
                </div>
            </div>
        </div>
    );
}
