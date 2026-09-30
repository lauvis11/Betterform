import React, { useState, useMemo } from 'react';
import { Dumbbell } from 'lucide-react';
import ejerciciosData from '../../data/ejercicios.json';
import type { Exercise } from '../../types/exercise';
import { FilterSidebar } from './FilterSidebar';
import { ExerciseCard } from './ExerciseCard';
import { Pagination } from './Pagination';

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_]+/g, '-')
    .trim();

const ITEMS_PER_PAGE = 5;

export const ExercisesExplorer: React.FC = () => {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['todos']);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const exercises = ejerciciosData as Exercise[];

  // Conteos dinámicos por grupo muscular basados en los datos
  const muscleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ex of exercises) {
      const catKey = normalize(ex.category);
      counts[catKey] = (counts[catKey] || 0) + 1;

      if (ex.body_part) {
        const bodyKey = normalize(ex.body_part);
        if (bodyKey !== catKey) {
          counts[bodyKey] = (counts[bodyKey] || 0) + 1;
        }
      }
    }
    return counts;
  }, [exercises]);

  // Conteos dinámicos por equipamiento basados en los datos
  const equipmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ex of exercises) {
      const eqKey = normalize(ex.equipment);
      counts[eqKey] = (counts[eqKey] || 0) + 1;
    }
    return counts;
  }, [exercises]);

  // Manejo de selección de músculos
  const handleToggleMuscle = (id: string) => {
    setCurrentPage(1);
    if (id === 'todos') {
      setSelectedMuscles(['todos']);
      return;
    }

    setSelectedMuscles((prev) => {
      const withoutTodos = prev.filter((m) => m !== 'todos');
      if (withoutTodos.includes(id)) {
        const next = withoutTodos.filter((m) => m !== id);
        return next.length === 0 ? ['todos'] : next;
      } else {
        return [...withoutTodos, id];
      }
    });
  };

  // Manejo de selección de equipamiento
  const handleToggleEquipment = (id: string) => {
    setCurrentPage(1);
    setSelectedEquipment((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Limpiar todos los filtros
  const handleClearAll = () => {
    setCurrentPage(1);
    setSelectedMuscles(['todos']);
    setSelectedEquipment([]);
  };

  // Filtrado de ejercicios en tiempo real
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // 1. Filtro de grupo muscular
      const matchMuscle =
        selectedMuscles.includes('todos') ||
        selectedMuscles.length === 0 ||
        selectedMuscles.some(
          (m) =>
            normalize(ex.category) === m ||
            (ex.body_part && normalize(ex.body_part) === m)
        );

      // 2. Filtro de equipamiento
      const matchEquipment =
        selectedEquipment.length === 0 ||
        selectedEquipment.some((e) => normalize(ex.equipment) === e);

      return matchMuscle && matchEquipment;
    });
  }, [exercises, selectedMuscles, selectedEquipment]);

  // Paginación
  const totalFiltered = filteredExercises.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));

  const paginatedExercises = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExercises.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredExercises, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resumen legible de filtros activos para la cabecera
  const activeSummary = useMemo(() => {
    const parts: string[] = [];

    const activeMuscles = selectedMuscles.filter((m) => m !== 'todos');
    if (activeMuscles.length > 0) {
      parts.push(activeMuscles.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(', '));
    }

    if (selectedEquipment.length > 0) {
      parts.push(selectedEquipment.map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(', '));
    }

    return parts.join(' + ');
  }, [selectedMuscles, selectedEquipment]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full min-h-[calc(100vh-5rem)] pb-12 sm:pb-16 px-4 sm:px-6 lg:px-4">
      {/* Sidebar de Filtros interactivo */}
      <FilterSidebar
        selectedMuscles={selectedMuscles}
        selectedEquipment={selectedEquipment}
        onToggleMuscle={handleToggleMuscle}
        onToggleEquipment={handleToggleEquipment}
        onClearAll={handleClearAll}
        muscleCounts={muscleCounts}
        equipmentCounts={equipmentCounts}
        totalCount={exercises.length}
      />

      {/* Área Principal de la Sección de Ejercicios */}
      <main className="flex-1 w-full py-4 lg:py-6 max-w-5xl">
        {/* Encabezado de Resultados y Filtros Activos */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-dark-700 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {totalFiltered} {totalFiltered === 1 ? 'ejercicio encontrado' : 'ejercicios encontrados'}
            </h1>
            {activeSummary && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-dark-800 border border-dark-700 text-xs font-mono text-neutral-300">
                Filtrado: <span className="text-brand-red ml-1 font-semibold">{activeSummary}</span>
              </span>
            )}
          </div>

          {/* Indicador de página rápida en cabecera */}
          {totalPages > 1 && (
            <span className="text-xs font-mono text-neutral-400">
              Página {currentPage} de {totalPages}
            </span>
          )}
        </div>

        {/* Lista de Resultados con ExerciseCard */}
        {totalFiltered > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3.5 w-full">
              {paginatedExercises.map((exercise, index) => (
                <ExerciseCard
                  key={`${exercise.id}-${currentPage}`}
                  exercise={exercise}
                  index={index}
                  staggerDelayMs={45}
                  animate={true}
                />
              ))}
            </div>

            {/* Componente de Paginación (5 resultados por página) */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalFiltered}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        ) : (
          /* Estado Vacío cuando ningún ejercicio coincide con los filtros */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-dark-800/40 border border-dark-700 rounded-xl text-center shadow-lg animate-card-in">
            <div className="w-14 h-14 rounded-full bg-dark-700/60 border border-dark-600 flex items-center justify-center mb-4 text-neutral-400 shadow-inner">
              <Dumbbell className="w-7 h-7 text-brand-red" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No hay ejercicios con los filtros seleccionados
            </h3>
            <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
              Prueba desmarcando algunos filtros de grupo muscular o equipamiento para explorar más ejercicios.
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-red text-white text-sm font-semibold hover:bg-brand-red/90 transition-all cursor-pointer shadow-md"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
