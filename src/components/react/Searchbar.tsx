import { useState, useEffect } from 'react';
import { Search, SearchX, X, Loader2 } from 'lucide-react';
import ejerciciosData from '../../data/ejercicios.json';
import type { Exercise } from '../../types/exercise';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseSkeleton } from './ExerciseSkeleton';

export type { Exercise };

const POPULAR_SEARCHES = ['Press de banca', 'Sentadilla', 'Peso muerto', 'Dominadas', 'Press militar'] as const;

const SPANISH_SYNONYMS: Record<string, string> = {
    '0001': 'pecho plano',
    '0002': 'piernas cuadriceps',
    '0003': 'espalda baja lumbar',
    '0004': 'espalda alta jalon',
    '0005': 'deltoides hombros'
};

const normalize = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchKey, setSearchKey] = useState(0);

    const isSearching = query.trim().length > 0;
    const normalizedQuery = normalize(query);

    // Sensación rápida de carga al escribir
    useEffect(() => {
        if (!isSearching) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
            setSearchKey((prev) => prev + 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [query, isSearching]);

    // Ocultar el Hero cuando se está buscando para que el input suba arriba
    useEffect(() => {
        const hero = document.getElementById('hero-section');
        if (!hero) return;
        if (isSearching) {
            hero.style.display = 'none';
        } else {
            hero.style.display = 'flex';
        }
    }, [isSearching]);

    // Filtrado en tiempo real con datos reales
    const filteredExercises = (ejerciciosData as Exercise[]).filter((exercise) => {
        if (!normalizedQuery) return true;

        const nameMatch = normalize(exercise.name).includes(normalizedQuery);
        const spanishMatch = SPANISH_SYNONYMS[exercise.id]
            ? normalize(SPANISH_SYNONYMS[exercise.id]).includes(normalizedQuery)
            : false;
        const bodyPartMatch = normalize(exercise.body_part).includes(normalizedQuery);
        const categoryMatch = normalize(exercise.category).includes(normalizedQuery);
        const equipmentMatch = normalize(exercise.equipment).includes(normalizedQuery);

        return nameMatch || spanishMatch || bodyPartMatch || categoryMatch || equipmentMatch;
    });

    const handleClear = () => {
        setQuery('');
    };

    const handleQuickSearch = (term: string) => {
        setQuery(term);
    };

    return (
        <div className={`w-full max-w-195 mx-auto flex flex-col gap-4 transition-all duration-300 ${isSearching ? 'pt-6 sm:pt-8' : ''}`}>
            {/* ESTADO 1: INICIAL / IDLE (Solo input amplio y recomendaciones) */}
            {!isSearching ? (
                <div className="w-full flex flex-col items-center">
                    {/* Input principal estilo Hero */}
                    <div className="relative flex items-center w-full h-14 sm:h-16 rounded-xl bg-dark-800 border border-dark-700 transition-all duration-200 shadow-xl focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red group">
                        <div className="pl-4 sm:pl-5 pr-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-brand-red transition-colors">
                            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        
                        <input 
                            id="realtime-search-input"
                            name="search"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder='Prueba con "Press de banca", "Sentadilla" o "Dominadas"...'
                            autoComplete="off"
                            spellCheck={false}
                            className="w-full h-full bg-transparent text-white placeholder:text-neutral-500 font-sans text-sm sm:text-base focus:outline-none pr-5 [&::-webkit-search-cancel-button]:hidden"
                        />
                    </div>

                    {/* Recomendaciones / Chips populares bajo el input */}
                    <div className="w-full mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2">
                        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 mr-1 select-none">
                            Populares:
                        </span>
                        {POPULAR_SEARCHES.map((term) => (
                            <button 
                                key={term} 
                                type="button" 
                                onClick={() => handleQuickSearch(term)}
                                className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white hover:border-brand-red hover:bg-dark-700 transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                /* ESTADO 2: BÚSQUEDA ACTIVA (Input arriba con selector + Pantalla de Stitch de resultados) */
                <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
                    {/* Barra de búsqueda interactiva superior */}
                    <div className="relative w-full flex items-center overflow-hidden rounded-xl">
                        {isLoading ? (
                            <Loader2 className="absolute left-4 w-5 h-5 text-brand-red animate-spin pointer-events-none" />
                        ) : (
                            <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none transition-colors" />
                        )}
                        
                        <input 
                            autoFocus
                            id="realtime-search-input-active"
                            name="search"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') handleClear();
                            }}
                            placeholder="Buscar ejercicio, grupo muscular o equipo..."
                            autoComplete="off"
                            spellCheck={false}
                            className="w-full h-12 sm:h-13 pl-11 pr-10 bg-dark-800 border border-dark-700 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-white placeholder:text-neutral-500 font-sans text-sm sm:text-base rounded-xl outline-none transition-all shadow-lg"
                        />

                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-dark-700 transition-colors cursor-pointer"
                            aria-label="Limpiar búsqueda (Esc)"
                            title="Limpiar búsqueda (Esc)"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Línea sutil de progreso animada al cargar */}
                        {isLoading && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden bg-dark-700/50">
                                <div className="w-1/3 h-full bg-brand-red animate-loading-beam rounded-full" />
                            </div>
                        )}
                    </div>

                    {/* Meta Bar: Contador de resultados */}
                    <div className="flex items-center py-1 px-1 text-xs text-neutral-400">
                        <div className="flex items-center gap-2">
                            {isLoading ? (
                                <span className="flex items-center gap-1.5 text-brand-red font-medium animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-ping" />
                                    Buscando ejercicios...
                                </span>
                            ) : (
                                <>
                                    <span className="text-sm font-semibold text-white">
                                        {filteredExercises.length} {filteredExercises.length === 1 ? 'ejercicio encontrado' : 'ejercicios encontrados'}
                                    </span>
                                    <span className="text-neutral-500">•</span>
                                    <span className="text-sm font-mono text-white">Búsqueda: "{query}"</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Live Results: Skeletons durante la carga rápida y cards una por una al finalizar */}
                    {isLoading ? (
                        <ExerciseSkeleton count={3} />
                    ) : filteredExercises.length > 0 ? (
                        <div className="flex flex-col gap-3.5 w-full">
                            {filteredExercises.map((exercise, index) => (
                                <ExerciseCard
                                    key={`${exercise.id}-${searchKey}`}
                                    exercise={exercise}
                                    index={index}
                                    staggerDelayMs={60}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Estado vacío (Empty State de Stitch) */
                        <div className="animate-card-in flex flex-col items-center justify-center py-12 px-4 bg-dark-800 border border-dark-700 rounded-xl text-center shadow-lg">
                            <div className="w-12 h-12 rounded-full bg-dark-700/80 flex items-center justify-center mb-3 text-neutral-400">
                                <SearchX className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">
                                No encontramos ejercicios para tu búsqueda
                            </h3>
                            <p className="text-sm text-neutral-400 max-w-105 mb-5">
                                Verifica la ortografía o intenta buscar por músculo, equipo o términos generales.
                            </p>
                            <div className="flex items-center flex-wrap justify-center gap-1.5">
                                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mr-1">
                                    Sugerencias:
                                </span>
                                {POPULAR_SEARCHES.map((term) => (
                                    <button
                                        key={term}
                                        type="button"
                                        onClick={() => handleQuickSearch(term)}
                                        className="px-2.5 py-1 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-brand-red rounded text-white font-mono text-xs transition-colors cursor-pointer"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Atajos de búsqueda rápida al pie (Stitch) */}
                    <div className="mt-2 pt-4 border-t border-dark-700/60 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Atajos de búsqueda rápida:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {POPULAR_SEARCHES.map((term) => (
                                <button
                                    key={term}
                                    type="button"
                                    onClick={() => handleQuickSearch(term)}
                                    className="px-2.5 py-1 rounded bg-dark-800 border border-dark-700 hover:border-neutral-400 text-neutral-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}