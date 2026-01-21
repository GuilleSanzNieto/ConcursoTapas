/**
 * Winner Calculation Algorithm for Tapas Contest
 * 
 * Rules:
 * 1. For each vote, calculate average of 3 scores (sabor, originalidad, presentacion)
 * 2. For each tapa, collect all vote averages
 * 3. Remove top 2 and bottom 2 values
 * 4. Calculate final average from remaining values
 * 5. If less than 5 votes, don't remove any values (show warning)
 */

export function calculateWinner(votos, tapas) {
    // Group votes by tapa_id
    const votosPorTapa = {};

    votos.forEach(voto => {
        const tapaId = voto.tapa_id;
        const mediaVoto = (voto.sabor + voto.originalidad + voto.presentacion) / 3;

        if (!votosPorTapa[tapaId]) {
            votosPorTapa[tapaId] = [];
        }
        votosPorTapa[tapaId].push(mediaVoto);
    });

    // Calculate final scores for each tapa
    const resultados = tapas.map(tapa => {
        const votosMedia = votosPorTapa[tapa.id] || [];
        let puntuacionFinal = 0;
        let warning = null;

        if (votosMedia.length === 0) {
            puntuacionFinal = 0;
            warning = 'Sin votos';
        } else if (votosMedia.length < 5) {
            // Less than 5 votes: use all values
            puntuacionFinal = votosMedia.reduce((a, b) => a + b, 0) / votosMedia.length;
            warning = `Solo ${votosMedia.length} votos (no se eliminan valores)`;
        } else {
            // 5 or more votes: remove top 2 and bottom 2
            const sorted = [...votosMedia].sort((a, b) => a - b);
            const filtered = sorted.slice(2, -2); // Remove first 2 and last 2
            puntuacionFinal = filtered.reduce((a, b) => a + b, 0) / filtered.length;
        }

        return {
            tapa,
            puntuacionFinal: parseFloat(puntuacionFinal.toFixed(2)),
            numVotos: votosMedia.length,
            warning,
        };
    });

    // Sort by final score (descending)
    return resultados.sort((a, b) => b.puntuacionFinal - a.puntuacionFinal);
}

export function getTopThree(ranking) {
    return ranking.slice(0, 3);
}
