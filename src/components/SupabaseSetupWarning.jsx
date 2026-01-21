import { AlertTriangle } from 'lucide-react';

export default function SupabaseSetupWarning() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card max-w-2xl">
                <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-yellow-500/20 rounded-2xl mb-4">
                        <AlertTriangle className="w-16 h-16 text-yellow-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">
                        Configuración Requerida
                    </h1>
                    <p className="text-white/60 text-lg">
                        Supabase no está configurado
                    </p>
                </div>

                <div className="space-y-4 text-left">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-3">📋 Pasos para configurar:</h2>
                        <ol className="space-y-3 text-white/80 list-decimal list-inside">
                            <li>
                                <strong>Crea una cuenta</strong> en{' '}
                                <a
                                    href="https://supabase.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 underline"
                                >
                                    supabase.com
                                </a>
                            </li>
                            <li>
                                <strong>Crea un nuevo proyecto</strong> en Supabase
                            </li>
                            <li>
                                <strong>Ejecuta el SQL schema:</strong>
                                <div className="mt-2 bg-black/30 rounded p-2 text-sm font-mono">
                                    Ve a SQL Editor → Ejecuta el archivo <code className="text-purple-300">supabase_schema.sql</code>
                                </div>
                            </li>
                            <li>
                                <strong>Habilita Realtime:</strong>
                                <div className="mt-2 bg-black/30 rounded p-2 text-sm">
                                    Database → Replication → Marca la tabla <code className="text-purple-300">participantes</code>
                                </div>
                            </li>
                            <li>
                                <strong>Copia tus credenciales:</strong>
                                <div className="mt-2 bg-black/30 rounded p-2 text-sm">
                                    Settings → API → Copia URL y anon key
                                </div>
                            </li>
                            <li>
                                <strong>Actualiza el archivo <code className="text-purple-300">.env.local</code>:</strong>
                                <div className="mt-2 bg-black/30 rounded p-3 text-sm font-mono overflow-x-auto">
                                    <div>VITE_SUPABASE_URL=tu_url_aqui</div>
                                    <div>VITE_SUPABASE_ANON_KEY=tu_key_aqui</div>
                                </div>
                            </li>
                            <li>
                                <strong>Reinicia el servidor:</strong>
                                <div className="mt-2 bg-black/30 rounded p-2 text-sm font-mono">
                                    Ctrl+C → npm run dev
                                </div>
                            </li>
                        </ol>
                    </div>

                    <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                        <p className="text-sm text-purple-200">
                            💡 <strong>Tip:</strong> El archivo <code className="text-purple-300">supabase_schema.sql</code>{' '}
                            está en la raíz del proyecto y contiene todo el esquema de la base de datos.
                        </p>
                    </div>

                    <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                        <p className="text-sm text-blue-200">
                            📖 <strong>Documentación:</strong> Consulta el archivo <code className="text-blue-300">README.md</code>{' '}
                            para más detalles sobre la configuración.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
