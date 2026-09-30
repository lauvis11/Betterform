import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage = 5
}: PaginationProps) {
    if (totalPages <= 1 && (!totalItems || totalItems <= itemsPerPage)) {
        return null;
    }

    // Calcular rango de números de página visibles
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Siempre mostrar página 1
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Siempre mostrar última página
            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : currentPage * itemsPerPage;

    return (
        <nav
            aria-label="Paginación de ejercicios"
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-4 border-t border-dark-700/80 w-full"
        >
            {/* Información del rango mostrado */}
            <div className="text-xs sm:text-sm text-neutral-400 font-medium">
                {totalItems !== undefined ? (
                    <span>
                        Mostrando <strong className="text-white font-semibold">{startItem}</strong> a{' '}
                        <strong className="text-white font-semibold">{endItem}</strong> de{' '}
                        <strong className="text-white font-semibold">{totalItems}</strong> ejercicios
                    </span>
                ) : (
                    <span>
                        Página <strong className="text-white font-semibold">{currentPage}</strong> de{' '}
                        <strong className="text-white font-semibold">{totalPages}</strong>
                    </span>
                )}
            </div>

            {/* Controles de página */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Botón Anterior */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-700 bg-dark-800 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white hover:bg-dark-700/80 hover:border-dark-600 disabled:opacity-40 disabled:hover:bg-dark-800 disabled:hover:text-neutral-300 disabled:hover:border-dark-700 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                    aria-label="Página anterior"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => {
                        if (typeof page === 'string') {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center text-xs text-neutral-500 font-mono select-none"
                                >
                                    •••
                                </span>
                            );
                        }

                        const isActive = page === currentPage;

                        return (
                            <button
                                key={`page-${page}`}
                                type="button"
                                onClick={() => onPageChange(page)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`w-8 sm:w-9 h-8 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center ${
                                    isActive
                                        ? 'bg-brand-red text-white border border-brand-red shadow-md font-bold'
                                        : 'bg-dark-800 hover:bg-dark-700/80 text-neutral-300 hover:text-white border border-dark-700 hover:border-dark-600'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Botón Siguiente */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-700 bg-dark-800 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white hover:bg-dark-700/80 hover:border-dark-600 disabled:opacity-40 disabled:hover:bg-dark-800 disabled:hover:text-neutral-300 disabled:hover:border-dark-700 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                    aria-label="Página siguiente"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </nav>
    );
}
