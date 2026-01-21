-- Añadir el 5º equipo
INSERT INTO equipos (numero, color, nombre) VALUES
  (5, '#A78BFA', 'Equipo Morado')
ON CONFLICT (numero) DO NOTHING;

-- Para ver todos los equipos actuales:
-- SELECT * FROM equipos ORDER BY numero;
