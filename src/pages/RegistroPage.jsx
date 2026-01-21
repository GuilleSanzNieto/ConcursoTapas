import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { ChefHat, Users } from 'lucide-react';

export default function RegistroPage({ onRegister }) {
    const [nombre, setNombre] = useState('');
    const [equipoId, setEquipoId] = useState('');
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadEquipos();
    }, []);

    const loadEquipos = async () => {
        try {
            const data = await db.getEquipos();
            setEquipos(data);
        } catch (error) {
            console.error('Error loading teams:', error);
            alert('Error al cargar los equipos. Verifica tu configuración de Supabase.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre.trim() || !equipoId) {
            alert('Por favor completa todos los campos');
            return;
        }

        setSubmitting(true);
        try {
            const participante = await db.createParticipante(nombre.trim(), equipoId);
            const equipo = equipos.find(e => e.id === equipoId);

            onRegister({
                participante_id: participante.id,
                nombre: participante.nombre,
                equipo_id: equipo.id,
                equipo_nombre: equipo.nombre,
                equipo_color: equipo.color,
            });
        } catch (error) {
            console.error('Error creating participant:', error);
            alert('Error al registrarse. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 animate-float">
                        <ChefHat className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold text-gradient mb-2">
                        Concurso de Tapas
                    </h1>
                    <p className="text-white/60">
                        Regístrate para comenzar
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Tu Nombre
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Team Selection */}
                        <div>
                            <label className="block text-white font-medium mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Selecciona tu Equipo
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {equipos.map((equipo) => (
                                    <label
                                        key={equipo.id}
                                        className={`
                      cursor-pointer p-4 rounded-xl border-2 transition-all
                      ${equipoId === equipo.id
                                                ? 'border-white bg-white/20 scale-105 shadow-lg'
                                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                                            }
                    `}
                                    >
                                        <input
                                            type="radio"
                                            name="equipo"
                                            value={equipo.id}
                                            checked={equipoId === equipo.id}
                                            onChange={(e) => setEquipoId(e.target.value)}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-8 h-8 rounded-full shadow-lg"
                                                style={{ backgroundColor: equipo.color }}
                                            />
                                            <div>
                                                <p className="font-bold text-white">{equipo.nombre}</p>
                                                <p className="text-sm text-white/60">Equipo #{equipo.numero}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting || !nombre.trim() || !equipoId}
                            className="btn-primary w-full mt-6"
                        >
                            {submitting ? 'Registrando...' : 'Continuar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
