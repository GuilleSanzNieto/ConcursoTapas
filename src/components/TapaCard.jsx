import { Check } from 'lucide-react';

export default function TapaCard({ tapa, isVoted, isDisabled, onClick }) {
    const borderColor = tapa.equipo?.color || '#ffffff';

    return (
        <div
            onClick={isDisabled ? undefined : onClick}
            className={`
        ${isDisabled ? 'tapa-card-disabled' : isVoted ? 'tapa-card-voted' : 'tapa-card'}
        relative overflow-hidden
      `}
            style={{
                borderLeftWidth: '4px',
                borderLeftColor: borderColor,
            }}
        >
            {/* Voted indicator */}
            {isVoted && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Disabled overlay */}
            {isDisabled && (
                <div className="absolute top-2 right-2 bg-gray-500 rounded-full px-2 py-1 text-xs">
                    Tu equipo
                </div>
            )}

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: borderColor }}
                    />
                    <span className="text-xs text-white/60 font-medium">
                        {tapa.equipo?.nombre || 'Equipo'}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                    {tapa.nombre_tapa}
                </h3>

                <p className="text-sm text-white/70">
                    Tapa #{tapa.orden}
                </p>
            </div>
        </div>
    );
}
