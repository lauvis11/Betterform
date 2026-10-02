import { useState, useEffect } from 'react';
import { Search, SearchX, X, Loader2 } from 'lucide-react';
import ejerciciosData from '../../data/ejercicios.json';
import type { Exercise } from '../../types/exercise';
import { ExerciseCard } from './ExerciseCard';

export type { Exercise };

interface SearchBarProps {
    children?: React.ReactNode;
}

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

export function SearchBar({ children }: SearchBarProps) {
    // inputValue: lo que el usuario está escribiendo en el campo de texto (sin buscar aún)
    const [inputValue, setInputValue] = useState('');
    // searchQuery: la consulta confirmada que se busca tras presionar Enter o Send
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchKey, setSearchKey] = useState(0);

    const isSearching = searchQuery.trim().length > 0;
    const normalizedQuery = normalize(searchQuery);

    // Sensación rápida de carga cuando se ejecuta una búsqueda (Enter o Send)
    useEffect(() => {
        if (!isSearching) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
            setSearchKey((prev) => prev + 1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, isSearching]);

    // Ocultar el Hero cuando se confirma la búsqueda para que los resultados suban
    useEffect(() => {
        const hero = document.getElementById('hero-section');
        if (!hero) return;
        if (isSearching) {
            hero.style.display = 'none';
        } else {
            hero.style.display = 'flex';
        }
    }, [isSearching]);

    // Filtrado con datos reales basado en la consulta confirmada (searchQuery)
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

    // Ejecutar búsqueda explícita (Enter o botón Send)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (trimmed.length > 0) {
            setSearchQuery(trimmed);
        }
    };

    const handleClear = () => {
        setInputValue('');
        setSearchQuery('');
    };

    const handleQuickSearch = (term: string) => {
        setInputValue(term);
        setSearchQuery(term);
    };

    return (
        <div className={`w-full max-w-195 mx-auto flex flex-col gap-4 transition-all duration-300 ${isSearching ? 'pt-6 sm:pt-8' : ''}`}>
            {/* ESTADO 1: INICIAL / IDLE (Hero visible, sin búsqueda activa) */}
            {!isSearching ? (
                <div className="w-full flex flex-col items-center">
                    {/* Formulario de búsqueda con botón de envío */}
                    <form
                        onSubmit={handleSubmit}
                        className="relative flex items-center w-full h-14 sm:h-16 rounded-xl bg-dark-800 border border-dark-700 transition-all duration-200 shadow-xl focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red group"
                    >
                        <div className="pl-4 sm:pl-5 pr-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-brand-red transition-colors">
                            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>

                        <input
                            id="realtime-search-input"
                            name="search"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder='Prueba con "Press banca", "Sentadilla"...'
                            autoComplete="off"
                            spellCheck={false}
                            className="w-full h-full bg-transparent text-white placeholder:text-neutral-500 placeholder:text-xs sm:placeholder:text-base font-sans text-sm sm:text-base focus:outline-none pr-11 [&::-webkit-search-cancel-button]:hidden"
                        />

                        {/* Botón para borrar texto si hay contenido */}
                        {inputValue.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setInputValue('')}
                                className="absolute right-3.5 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-dark-700 transition-colors cursor-pointer"
                                aria-label="Borrar texto"
                                title="Borrar texto"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </form>

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
                /* ESTADO 2: BÚSQUEDA ACTIVA (Input arriba con selector + Resultados) */
                <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
                    {/* Barra de búsqueda superior interactiva */}
                    <form
                        onSubmit={handleSubmit}
                        className="relative w-full flex items-center overflow-hidden rounded-xl bg-dark-800 border border-dark-700 focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red shadow-lg transition-all"
                    >
                        {isLoading ? (
                            <div className="pl-4 pr-3 flex items-center pointer-events-none">
                                <Loader2 className="w-5 h-5 text-brand-red animate-spin" />
                            </div>
                        ) : (
                            <div className="pl-4 pr-3 flex items-center pointer-events-none text-neutral-400">
                                <Search className="w-5 h-5" />
                            </div>
                        )}

                        <input
                            autoFocus
                            id="realtime-search-input-active"
                            name="search"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') handleClear();
                            }}
                            placeholder="Buscar por ejercicio o músculo..."
                            autoComplete="off"
                            spellCheck={false}
                            className="w-full h-12 sm:h-13 bg-transparent text-white placeholder:text-neutral-500 placeholder:text-xs sm:placeholder:text-base font-sans text-sm sm:text-base outline-none pr-11 [&::-webkit-search-cancel-button]:hidden"
                        />

                        {/* Botón de limpiar búsqueda */}
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3.5 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-dark-700 transition-colors cursor-pointer"
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
                    </form>

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
                                    <span className="text-sm font-mono text-white">Búsqueda: "{searchQuery}"</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Resultados: Skeletons durante la carga rápida y cards al finalizar */}
                    {isLoading ? (
                        children || (
                            <div className="flex flex-col gap-3.5 w-full">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={`fallback-skeleton-${index}`}
                                        className="w-full bg-dark-800 border border-dark-700/60 rounded-xl p-4 sm:p-5 shadow-md h-32 animate-pulse"
                                    />
                                ))}
                            </div>
                        )
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
                        /* Estado vacío (Empty State) */
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

                    {/* Atajos de búsqueda rápida al pie */}
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