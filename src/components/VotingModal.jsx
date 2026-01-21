import { useState } from 'react';
import { X } from 'lucide-react';

export default function VotingModal({ tapa, onClose, onSubmit }) {
    const [sabor, setSabor] = useState(5);
    const [originalidad, setOriginalidad] = useState(5);
    const [presentacion, setPresentacion] = useState(5);

    const handleSubmit = () => {
        onSubmit({
            sabor,
            originalidad,
            presentacion,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="card w-full max-w-md animate-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gradient">
                            {tapa.nombre_tapa}
                        </h2>
                        <p className="text-white/60 text-sm mt-1">
                            {tapa.equipo?.nombre} - Tapa #{tapa.orden}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scoring sliders */}
                <div className="space-y-6">
                    <ScoreSlider
                        label="Sabor"
                        value={sabor}
                        onChange={setSabor}
                        emoji="😋"
                    />
                    <ScoreSlider
                        label="Originalidad"
                        value={originalidad}
                        onChange={setOriginalidad}
                        emoji="✨"
                    />
                    <ScoreSlider
                        label="Presentación"
                        value={presentacion}
                        onChange={setPresentacion}
                        emoji="🎨"
                    />
                </div>

                {/* Average display */}
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-center">
                        <p className="text-white/60 text-sm mb-1">Puntuación Media</p>
                        <p className="text-3xl font-bold text-gradient">
                            {((sabor + originalidad + presentacion) / 3).toFixed(1)}
                        </p>
                    </div>
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    className="btn-primary w-full mt-6"
                >
                    Guardar Voto
                </button>
            </div>
        </div>
    );
}

function ScoreSlider({ label, value, onChange, emoji }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-white font-medium flex items-center gap-2">
                    <span className="text-xl">{emoji}</span>
                    {label}
                </label>
                <span className="text-2xl font-bold text-gradient">{value}</span>
            </div>
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none 
                   [&::-webkit-slider-thumb]:w-6 
                   [&::-webkit-slider-thumb]:h-6 
                   [&::-webkit-slider-thumb]:bg-gradient-to-r 
                   [&::-webkit-slider-thumb]:from-purple-500 
                   [&::-webkit-slider-thumb]:to-pink-500 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-lg
                   [&::-webkit-slider-thumb]:transition-transform
                   [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <div className="flex justify-between text-xs text-white/40">
                <span>1</span>
                <span>10</span>
            </div>
        </div>
    );
}
