import { useState } from 'react';
import { Search } from 'lucide-react';

const POPULAR_SEARCHES = ['Press banca', 'Sentadilla', 'Peso Muerto', 'Remo'] as const;

export function SearchBar() {
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) return;
    };

    const handleQuickSearch = (term: string) => {
        setQuery(term);
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            {/* Formulario de búsqueda estilo Stitch */}
            <form role="search" onSubmit={handleSearch} className="w-full relative">
                <label htmlFor="search-exercise" className="sr-only">
                    Buscar ejercicios
                </label>

                <div className="relative flex items-center w-full h-14 sm:h-16 rounded-xl bg-dark-800 border border-dark-700 transition-all duration-200 shadow-xl focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red group">
                    {/* Icono de búsqueda con feedback de foco */}
                    <div className="pl-4 sm:pl-5 pr-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-brand-red transition-colors">
                        <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    
                    {/* Campo de texto principal */}
                    <input 
                        id="search-exercise"
                        name="search"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Prueba con "Press banca" o "Sentadilla"...'
                        autoComplete="off"
                        spellCheck={false}
                        className="w-full h-full bg-transparent text-white placeholder:text-neutral-500 font-sans text-sm sm:text-base focus:outline-none pr-5 [&::-webkit-search-cancel-button]:hidden"
                    />
                </div>
            </form>

            {/* Chips de sugerencias rápidas estilo Stitch */}
            <div className="w-full max-w-3xl mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2">
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
    );
}