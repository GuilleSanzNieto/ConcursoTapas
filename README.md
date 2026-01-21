# Concurso de Tapas - Web App

Una aplicación web móvil para concursos de tapas con votación en tiempo real.

## 🚀 Características

- ✨ **Diseño Mobile-First** con glassmorphism y animaciones premium
- 🔄 **Sincronización en Tiempo Real** usando Supabase
- 🗳️ **Sistema de Votación Interactivo** con validación de equipos
- 🏆 **Cálculo Automático de Ganadores** con algoritmo especializado
- 🎊 **Pantalla de Resultados** con podio y confeti
- 💾 **Gestión de Sesión** con localStorage

## 📋 Configuración Inicial

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve al **SQL Editor** y ejecuta el contenido de `supabase_schema.sql`
4. Habilita **Realtime** para la tabla `participantes`:
   - Ve a Database → Replication
   - Marca la tabla `participantes`

### 2. Variables de Entorno

Copia el archivo `.env.local` y completa con tus credenciales:

```bash
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

Puedes encontrar estos valores en:
- Supabase Dashboard → Settings → API

### 3. Instalar y Ejecutar

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🎮 Flujo de la Aplicación

1. **Registro**: Usuario ingresa nombre y selecciona su equipo
2. **Gestión de Tapas**: Cada equipo registra sus tapas con nombre y orden
3. **Votación**: Usuarios votan tapas de otros equipos (sabor, originalidad, presentación 1-10)
4. **Espera**: Pantalla con spinner esperando a que todos finalicen
5. **Resultados**: Podio con ganadores y ranking completo

## 🏆 Algoritmo de Puntuación

Para cada tapa:
1. Calcula la media de cada voto: `(sabor + originalidad + presentación) / 3`
2. Recopila todas las medias
3. **Elimina los 2 valores más altos y los 2 más bajos**
4. Calcula la media final de los valores restantes

⚠️ Si una tapa tiene menos de 5 votos, no se eliminan valores.

## 📱 Tecnologías

- **React** con Vite
- **Tailwind CSS** para estilos
- **Supabase** para base de datos y tiempo real
- **Lucide React** para iconos
- **React Confetti** para celebraciones

## 📊 Estructura de la Base de Datos

- **equipos**: id, numero, color, nombre
- **participantes**: id, nombre, equipo_id, estado (listo)
- **tapas**: id, nombre_tapa, orden, equipo_id
- **votos**: id, votante_id, tapa_id, sabor, originalidad, presentacion

## 🔒 Seguridad

La aplicación usa localStorage para gestión de sesión sin autenticación formal. Es adecuada para entornos controlados de concursos. Las políticas RLS de Supabase están configuradas para permitir acceso público a todas las operaciones.

## 📝 Notas

- La app está optimizada para Safari (iOS) y Chrome (Android)
- Diseñada para funcionar en dispositivos móviles principalmente
- Requiere conexión a internet activa para sincronización en tiempo real

## 🐛 Troubleshooting

**Error al cargar equipos**: Verifica que hayas ejecutado el SQL schema y que las variables de entorno sean correctas.

**Real-time no funciona**: Asegúrate de habilitar Replication en la tabla `participantes` en Supabase.

**Estilos no se cargan**: Ejecuta `npm run dev` nuevamente y limpia la caché del navegador.
