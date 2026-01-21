import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import TapaCard from '../components/TapaCard';
import VotingModal from '../components/VotingModal';
import TeamFilter from '../components/TeamFilter';
import { Vote, CheckCircle2 } from 'lucide-react';

export default function VotacionPage({ session, onFinalize }) {
    const [tapas, setTapas] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [votos, setVotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTapa, setSelectedTapa] = useState(null);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tapasData, equiposData, votosData] = await Promise.all([
                db.getTapas(),
                db.getEquipos(),
                db.getVotosByVotante(session.participante_id),
            ]);

            setTapas(tapasData);
            setEquipos(equiposData);
            setVotos(votosData);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (scores) => {
        try {
            await db.createVoto(
                session.participante_id,
                selectedTapa.id,
                scores.sabor,
                scores.originalidad,
                scores.presentacion
            );

            // Reload votes
            const votosData = await db.getVotosByVotante(session.participante_id);
            setVotos(votosData);
            setSelectedTapa(null);
        } catch (error) {
            console.error('Error voting:', error);
            alert('Error al guardar el voto. Puede que ya hayas votado esta tapa.');
        }
    };

    const handleFinalize = async () => {
        if (!canFinalize) return;

        setSubmitting(true);
        try {
            await db.updateParticipanteEstado(session.participante_id, true);
            onFinalize();
        } catch (error) {
            console.error('Error finalizing:', error);
            alert('Error al finalizar');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredTapas = selectedEquipo
        ? tapas.filter(t => t.equipo_id === selectedEquipo)
        : tapas;

    const tapasOtrosEquipos = tapas.filter(t => t.equipo_id !== session.equipo_id);
    const votedTapaIds = new Set(votos.map(v => v.tapa_id));
    const canFinalize = tapasOtrosEquipos.every(t => votedTapaIds.has(t.id));
    const votedCount = votos.length;
    const totalCount = tapasOtrosEquipos.length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 py-8 pb-32">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Vote className="w-6 h-6 text-purple-400" />
                        <h1 className="text-3xl font-bold text-gradient">
                            Votación
                        </h1>
                    </div>
                    <p className="text-white/60">
                        Vota por las tapas (excepto las de tu equipo)
                    </p>

                    {/* Progress */}
                    <div className="mt-4 card inline-block">
                        <div className="flex items-center gap-3">
                            <div className="text-sm">
                                <span className="font-bold text-2xl text-gradient">{votedCount}</span>
                                <span className="text-white/60">/{totalCount}</span>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="text-xs text-white/60">
                                tapas votadas
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Filter */}
                <div className="mb-6">
                    <TeamFilter
                        equipos={equipos}
                        selectedEquipo={selectedEquipo}
                        onSelect={setSelectedEquipo}
                    />
                </div>

                {/* Tapas Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {filteredTapas.map((tapa) => {
                        const isOwnTeam = tapa.equipo_id === session.equipo_id;
                        const isVoted = votedTapaIds.has(tapa.id);

                        return (
                            <TapaCard
                                key={tapa.id}
                                tapa={tapa}
                                isVoted={isVoted}
                                isDisabled={isOwnTeam}
                                onClick={() => !isVoted && setSelectedTapa(tapa)}
                            />
                        );
                    })}
                </div>

                {filteredTapas.length === 0 && (
                    <div className="text-center text-white/60 py-12">
                        No hay tapas para mostrar
                    </div>
                )}
            </div>

            {/* Fixed Footer Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={handleFinalize}
                        disabled={!canFinalize || submitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        {submitting ? 'Finalizando...' : canFinalize ? 'FINALIZAR' : `Falta votar ${totalCount - votedCount} tapas`}
                    </button>
                </div>
            </div>

            {/* Voting Modal */}
            {selectedTapa && (
                <VotingModal
                    tapa={selectedTapa}
                    onClose={() => setSelectedTapa(null)}
                    onSubmit={handleVote}
                />
            )}
        </div>
    );
}
