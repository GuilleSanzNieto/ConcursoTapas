import { useState } from 'react';
import { db } from '../lib/supabase';
import { Plus, Trash2, Send } from 'lucide-react';

export default function GestionTapasPage({ session, onComplete }) {
    const [tapas, setTapas] = useState([{ nombre_tapa: '', orden: 1 }]);
    const [submitting, setSubmitting] = useState(false);

    const addTapa = () => {
        setTapas([...tapas, { nombre_tapa: '', orden: tapas.length + 1 }]);
    };

    const removeTapa = (index) => {
        if (tapas.length > 1) {
            const newTapas = tapas.filter((_, i) => i !== index);
            // Re-order
            newTapas.forEach((tapa, i) => {
                tapa.orden = i + 1;
            });
            setTapas(newTapas);
        }
    };

    const updateTapa = (index, field, value) => {
        const newTapas = [...tapas];
        newTapas[index][field] = value;
        setTapas(newTapas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const isValid = tapas.every(tapa => tapa.nombre_tapa.trim() !== '');
        if (!isValid) {
            alert('Por favor completa todos los nombres de tapas');
            return;
        }

        setSubmitting(true);
        try {
            const tapasToInsert = tapas.map(tapa => ({
                nombre_tapa: tapa.nombre_tapa.trim(),
                orden: tapa.orden,
                equipo_id: session.equipo_id,
            }));

            console.log('Intentando insertar tapas:', tapasToInsert);
            console.log('Session data:', session);

            await db.createTapas(tapasToInsert);
            onComplete();
        } catch (error) {
            console.error('Error creating tapas:', error);
            console.error('Error details:', error.message, error.details, error.hint);

            // Mostrar el error específico si está disponible
            const errorMessage = error.message || 'Error al registrar las tapas';
            alert(`Error: ${errorMessage}\n\nPor favor revisa la consola para más detalles.`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen p-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-block mb-4">
                        <div
                            className="w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-2xl font-bold"
                            style={{ backgroundColor: session.equipo_color }}
                        >
                            {session.equipo_nombre.charAt(0)}
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">
                        Gestión de Tapas
                    </h1>
                    <p className="text-white/60">
                        {session.equipo_nombre} - Registra tus tapas
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {tapas.map((tapa, index) => (
                        <div
                            key={index}
                            className="card animate-in fade-in slide-in-from-bottom-2 duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center font-bold text-xl">
                                    {tapa.orden}
                                </div>

                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={tapa.nombre_tapa}
                                        onChange={(e) => updateTapa(index, 'nombre_tapa', e.target.value)}
                                        placeholder="Nombre de la tapa"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                {tapas.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTapa(index)}
                                        className="flex-shrink-0 p-3 hover:bg-red-500/20 rounded-xl transition-colors text-red-400"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add Button */}
                    <button
                        type="button"
                        onClick={addTapa}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Añadir otra tapa
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-8"
                    >
                        <Send className="w-5 h-5" />
                        {submitting ? 'Enviando...' : 'Continuar a Votación'}
                    </button>
                </form>
            </div>
        </div>
    );
}
