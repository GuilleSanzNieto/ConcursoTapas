import { useEffect } from 'react';
import { useRealtimeParticipants } from '../hooks/useRealtimeParticipants';
import { Loader2 } from 'lucide-react';

export default function EsperaPage({ onAllReady }) {
    const { participantes, allReady, loading } = useRealtimeParticipants();

    useEffect(() => {
        if (allReady && participantes.length > 0) {
            // All participants are ready, navigate to results
            onAllReady();
        }
    }, [allReady, participantes.length, onAllReady]);

    const readyCount = participantes.filter(p => p.estado).length;
    const totalCount = participantes.length;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                {/* Animated Spinner */}
                <div className="mb-8 animate-in zoom-in duration-500">
                    <div className="relative inline-block">
                        <Loader2 className="w-24 h-24 text-purple-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-4xl font-bold text-gradient mb-4 animate-pulse-slow">
                    CALCULANDO GANADOR...
                </h1>

                <p className="text-white/60 text-lg mb-8">
                    Esperando a que todos los participantes terminen
                </p>

                {/* Progress */}
                {!loading && totalCount > 0 && (
                    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">Participantes listos:</span>
                                <span className="font-bold text-xl text-gradient">
                                    {readyCount} / {totalCount}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 rounded-full"
                                    style={{ width: `${(readyCount / totalCount) * 100}%` }}
                                />
                            </div>

                            {/* Participants List */}
                            <div className="mt-6 space-y-2 max-h-64 overflow-y-auto">
                                {participantes.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: p.equipo?.color || '#fff' }}
                                            />
                                            <span className="text-white text-sm">{p.nombre}</span>
                                        </div>
                                        {p.estado ? (
                                            <span className="text-green-400 text-xs">✓ Listo</span>
                                        ) : (
                                            <span className="text-white/40 text-xs">Esperando...</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Manual button to proceed */}
                            <button
                                onClick={onAllReady}
                                className="btn-primary w-full mt-4"
                            >
                                Ver Resultados Ahora
                            </button>
                            <p className="text-xs text-white/40 text-center mt-2">
                                O espera a que todos terminen
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
