-- Tapas Contest Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================================
-- TABLE: Equipos (Teams)
-- =======================================
CREATE TABLE IF NOT EXISTS equipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero INTEGER NOT NULL UNIQUE,
  color TEXT NOT NULL,
  nombre TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================
-- TABLE: Participantes (Participants)
-- =======================================
CREATE TABLE IF NOT EXISTS participantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  equipo_id UUID NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
  estado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================
-- TABLE: Tapas
-- =======================================
CREATE TABLE IF NOT EXISTS tapas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_tapa TEXT NOT NULL,
  orden INTEGER NOT NULL,
  equipo_id UUID NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(equipo_id, orden)
);

-- =======================================
-- TABLE: Votos (Votes)
-- =======================================
CREATE TABLE IF NOT EXISTS votos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  votante_id UUID NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
  tapa_id UUID NOT NULL REFERENCES tapas(id) ON DELETE CASCADE,
  sabor INTEGER NOT NULL CHECK (sabor >= 1 AND sabor <= 10),
  originalidad INTEGER NOT NULL CHECK (originalidad >= 1 AND originalidad <= 10),
  presentacion INTEGER NOT NULL CHECK (presentacion >= 1 AND presentacion <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(votante_id, tapa_id)
);

-- =======================================
-- INDEXES for Performance
-- =======================================
CREATE INDEX idx_participantes_equipo ON participantes(equipo_id);
CREATE INDEX idx_participantes_estado ON participantes(estado);
CREATE INDEX idx_tapas_equipo ON tapas(equipo_id);
CREATE INDEX idx_votos_votante ON votos(votante_id);
CREATE INDEX idx_votos_tapa ON votos(tapa_id);

-- =======================================
-- ROW LEVEL SECURITY (RLS)
-- =======================================
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE votos ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (since we're using simple localStorage auth)
CREATE POLICY "Allow public read access on equipos" ON equipos FOR SELECT USING (true);
CREATE POLICY "Allow public read access on participantes" ON participantes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tapas" ON tapas FOR SELECT USING (true);
CREATE POLICY "Allow public read access on votos" ON votos FOR SELECT USING (true);

-- Allow public insert/update (simplified for localStorage-based app)
CREATE POLICY "Allow public insert on participantes" ON participantes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on participantes" ON participantes FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on tapas" ON tapas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on votos" ON votos FOR INSERT WITH CHECK (true);

-- =======================================
-- SAMPLE DATA (Teams)
-- Run this to create initial teams
-- =======================================
INSERT INTO equipos (numero, color, nombre) VALUES
  (1, '#FF6B6B', 'Equipo Rojo'),
  (2, '#4ECDC4', 'Equipo Azul'),
  (3, '#FFE66D', 'Equipo Amarillo'),
  (4, '#95E1D3', 'Equipo Verde')
ON CONFLICT (numero) DO NOTHING;

-- =======================================
-- REALTIME SETUP
-- Enable realtime for participantes table
-- =======================================
-- In Supabase Dashboard:
-- 1. Go to Database > Replication
-- 2. Enable replication for 'participantes' table
