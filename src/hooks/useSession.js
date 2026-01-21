import { useState, useEffect } from 'react';

const SESSION_KEY = 'tapas_user_session';

export function useSession() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load session from localStorage on mount
        const savedSession = localStorage.getItem(SESSION_KEY);
        if (savedSession) {
            try {
                setSession(JSON.parse(savedSession));
            } catch (error) {
                console.error('Error parsing session:', error);
                localStorage.removeItem(SESSION_KEY);
            }
        }
        setLoading(false);
    }, []);

    const saveSession = (sessionData) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        setSession(sessionData);
    };

    const clearSession = () => {
        localStorage.removeItem(SESSION_KEY);
        setSession(null);
    };

    return {
        session,
        loading,
        saveSession,
        clearSession,
        isLoggedIn: !!session,
    };
}
