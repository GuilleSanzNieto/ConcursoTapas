export default function TeamFilter({ equipos, selectedEquipo, onSelect }) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => onSelect(null)}
                className={`
          px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all
          ${!selectedEquipo
                        ? 'bg-white text-purple-900 shadow-lg scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }
        `}
            >
                Todos
            </button>

            {equipos.map((equipo) => (
                <button
                    key={equipo.id}
                    onClick={() => onSelect(equipo.id)}
                    className={`
            px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all
            flex items-center gap-2
            ${selectedEquipo === equipo.id
                            ? 'shadow-lg scale-105'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }
          `}
                    style={{
                        backgroundColor: selectedEquipo === equipo.id ? equipo.color : undefined,
                        color: selectedEquipo === equipo.id ? '#000' : undefined,
                    }}
                >
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: equipo.color }}
                    />
                    {equipo.nombre}
                </button>
            ))}
        </div>
    );
}
