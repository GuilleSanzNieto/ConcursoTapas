-- Solución: Añadir políticas faltantes para INSERT en tapas
-- Este SQL permitirá insertar tapas en la base de datos

-- Primero, verifica si la política existe y elimínala si es necesario
DROP POLICY IF EXISTS "Allow public insert on tapas" ON tapas;

-- Crea la política de INSERT para tapas
CREATE POLICY "Allow public insert on tapas" 
ON tapas 
FOR INSERT 
WITH CHECK (true);

-- También asegurémonos de que UPDATE funciona
DROP POLICY IF EXISTS "Allow public update on tapas" ON tapas;

CREATE POLICY "Allow public update on tapas" 
ON tapas 
FOR UPDATE 
USING (true);

-- Verifica que las políticas estén activas
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tapas';
