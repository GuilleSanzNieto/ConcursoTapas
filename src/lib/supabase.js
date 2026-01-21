import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
const isConfigured = supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_url_here' &&
    supabaseAnonKey !== 'your_supabase_anon_key_here';

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Database helper functions
export const db = {
    // Equipos (Teams)
    async getEquipos() {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('equipos')
            .select('*')
            .order('numero');
        if (error) throw error;
        return data;
    },

    async getEquipoById(id) {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('equipos')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Participantes (Participants)
    async createParticipante(nombre, equipo_id) {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('participantes')
            .insert({ nombre, equipo_id, estado: false })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getParticipantes() {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('participantes')
            .select('*, equipo:equipos(*)');
        if (error) throw error;
        return data;
    },

    async updateParticipanteEstado(id, estado) {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('participantes')
            .update({ estado })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Tapas
    async createTapas(tapasArray) {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('tapas')
            .insert(tapasArray)
            .select();
        if (error) throw error;
        return data;
    },

    async getTapas() {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('tapas')
            .select('*, equipo:equipos(*)')
            .order('orden');
        if (error) throw error;
        return data;
    },

    async getTapasByEquipo(equipo_id) {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('tapas')
            .select('*, equipo:equipos(*)')
            .eq('equipo_id', equipo_id)
            .order('orden');
        if (error) throw error;
        return data;
    },

    // Votos (Votes)
    async createVoto(votante_id, tapa_id, sabor, originalidad, presentacion) {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('votos')
            .insert({ votante_id, tapa_id, sabor, originalidad, presentacion })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getVotosByVotante(votante_id) {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('votos')
            .select('*, tapa:tapas(*, equipo:equipos(*))')
            .eq('votante_id', votante_id);
        if (error) throw error;
        return data;
    },

    async getAllVotos() {
        if (!supabase) throw new Error('Supabase no configurado');
        const { data, error } = await supabase
            .from('votos')
            .select('*, tapa:tapas(*, equipo:equipos(*))');
        if (error) throw error;
        return data;
    },

    // Real-time subscriptions
    subscribeToParticipantes(callback) {
        if (!supabase) throw new Error('Supabase no configurado');
        return supabase
            .channel('participantes-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'participantes' },
                callback
            )
            .subscribe();
    },
};
