import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';

export function useRealtimeParticipants() {
    const [participantes, setParticipantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allReady, setAllReady] = useState(false);

    useEffect(() => {
        // Initial fetch
        fetchParticipantes();

        // Set up real-time subscription
        const subscription = db.subscribeToParticipantes((payload) => {
            console.log('Real-time update:', payload);
            fetchParticipantes();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchParticipantes = async () => {
        try {
            const data = await db.getParticipantes();
            setParticipantes(data);

            // Check if all participants are ready
            if (data.length > 0) {
                const allReady = data.every(p => p.estado === true);
                setAllReady(allReady);
            }
        } catch (error) {
            console.error('Error fetching participants:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        participantes,
        loading,
        allReady,
        refresh: fetchParticipantes,
    };
}
