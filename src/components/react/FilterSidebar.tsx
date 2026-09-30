import React, { useState } from 'react';
import { Check, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface FilterItem {
  id: string;
  label: string;
  count: number;
}

const MUSCLE_GROUPS: FilterItem[] = [
  { id: 'todos', label: 'Todos', count: 110 },
  { id: 'pecho', label: 'Pecho', count: 14 },
  { id: 'espalda', label: 'Espalda', count: 22 },
  { id: 'piernas', label: 'Piernas', count: 28 },
  { id: 'hombros', label: 'Hombros', count: 16 },
  { id: 'brazos', label: 'Brazos', count: 19 },
  { id: 'abdomen', label: 'Abdomen', count: 11 },
];

const EQUIPMENT_LIST: FilterItem[] = [
  { id: 'barra', label: 'Barra', count: 18 },
  { id: 'mancuernas', label: 'Mancuernas', count: 24 },
  { id: 'maquina', label: 'Máquina', count: 15 },
  { id: 'peso-corporal', label: 'Peso corporal', count: 12 },
  { id: 'polea', label: 'Polea', count: 10 },
];

export const FilterSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMuscleOpen, setIsMuscleOpen] = useState(true);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(true);

  // Por defecto solo uno activado: "todos"
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['todos']);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  // Alternar selección de categoría/músculo
  const toggleMuscle = (id: string) => {
    if (id === 'todos') {
      setSelectedMuscles(['todos']);
      return;
    }

    setSelectedMuscles((prev) => {
      const withoutTodos = prev.filter((m) => m !== 'todos');
      if (withoutTodos.includes(id)) {
        const next = withoutTodos.filter((m) => m !== id);
        // Si no queda ninguna categoría seleccionada, regresa a "todos"
        return next.length === 0 ? ['todos'] : next;
      } else {
        return [...withoutTodos, id];
      }
    });
  };

  // Alternar selección de equipamiento
  const toggleEquipment = (id: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Limpiar todos los filtros: restablece al estado por defecto con solo "todos"
  const handleClearAll = () => {
    setSelectedMuscles(['todos']);
    setSelectedEquipment([]);
  };

  // Verifica si está en el estado por defecto
  const isDefaultState =
    selectedMuscles.length === 1 &&
    selectedMuscles[0] === 'todos' &&
    selectedEquipment.length === 0;

  // Lista combinada de filtros activos (excluyendo "todos")
  const activeFilters = [
    ...MUSCLE_GROUPS.filter(
      (m) => m.id !== 'todos' && selectedMuscles.includes(m.id)
    ).map((m) => ({
      id: m.id,
      label: m.label,
      type: 'muscle' as const,
    })),
    ...EQUIPMENT_LIST.filter((e) => selectedEquipment.includes(e.id)).map((e) => ({
      id: e.id,
      label: e.label,
      type: 'equipment' as const,
    })),
  ];

  const totalActive = activeFilters.length;

  return (
    <>
      {/* Barra móvil para ajustar filtros */}
      <div className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-dark-800/80 border-b border-dark-700 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white tracking-tight">Filtros</span>
          <span className="px-2 py-0.5 rounded-sm bg-brand-red/20 text-brand-red text-xs font-semibold">
            {totalActive} activo{totalActive !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-dark-900 border border-dark-700 text-white text-xs font-medium hover:border-brand-red transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-300" />
          <span>{isMobileOpen ? 'Cerrar filtros' : 'Ajustar filtros'}</span>
        </button>
      </div>

      {/* SIDEBAR: FILTERS */}
      <aside
        id="filtersDrawer"
        className={`${
          isMobileOpen ? 'block' : 'hidden'
        } lg:block shrink-0 w-full lg:w-65 bg-dark-800/40 border-r border-dark-700 lg:sticky lg:top-20 p-5 z-20`}
      >
        {/* Encabezado del filtro y botón Limpiar filtros */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-700">
          <h2 className="text-lg font-bold text-white tracking-tight">Filtros</h2>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={isDefaultState}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              !isDefaultState
                ? 'text-brand-red hover:underline'
                : 'text-neutral-600 cursor-not-allowed opacity-50'
            }`}
          >
            Limpiar filtros
          </button>
        </div>

        {/* RESUMEN DE FILTROS ACTIVOS */}
        {totalActive > 0 && (
          <div className="pt-4 pb-2">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
              Filtros activos
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeFilters.map((filter) => (
                <button
                  key={`${filter.type}-${filter.id}`}
                  type="button"
                  onClick={() =>
                    filter.type === 'muscle'
                      ? toggleMuscle(filter.id)
                      : toggleEquipment(filter.id)
                  }
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-dark-950 border border-brand-red text-white text-xs font-medium hover:border-brand-red/70 transition-colors group cursor-pointer"
                  title={`Quitar filtro ${filter.label}`}
                >
                  <span>{filter.label}</span>
                  <X className="w-3.5 h-3.5 text-brand-red group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN 1: GRUPO MUSCULAR (Desplegable y seleccionable) */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setIsMuscleOpen(!isMuscleOpen)}
            className="w-full flex items-center justify-between py-1 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase hover:text-white transition-colors cursor-pointer select-none group"
          >
            <span>Grupo Muscular</span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 group-hover:text-white transition-transform duration-200 ${
                isMuscleOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isMuscleOpen && (
            <div className="space-y-2.5 mt-3">
              {MUSCLE_GROUPS.map((muscle) => {
                const isChecked = selectedMuscles.includes(muscle.id);
                return (
                  <div
                    key={muscle.id}
                    onClick={() => toggleMuscle(muscle.id)}
                    className="flex items-center justify-between py-1 cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-brand-red border border-brand-red text-white'
                            : 'bg-dark-950 border border-dark-700 group-hover:border-neutral-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-3" />}
                      </span>
                      <span
                        className={`text-sm transition-colors ${
                          isChecked
                            ? 'font-medium text-white'
                            : 'text-neutral-400 group-hover:text-white'
                        }`}
                      >
                        {muscle.label}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                      ({muscle.count})
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="border-t border-dark-700 my-4"></div>

        {/* SECCIÓN 2: EQUIPAMIENTO (Desplegable y seleccionable) */}
        <div>
          <button
            type="button"
            onClick={() => setIsEquipmentOpen(!isEquipmentOpen)}
            className="w-full flex items-center justify-between py-1 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase hover:text-white transition-colors cursor-pointer select-none group"
          >
            <span>Equipamiento</span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 group-hover:text-white transition-transform duration-200 ${
                isEquipmentOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isEquipmentOpen && (
            <div className="space-y-2.5 mt-3">
              {EQUIPMENT_LIST.map((equip) => {
                const isChecked = selectedEquipment.includes(equip.id);
                return (
                  <div
                    key={equip.id}
                    onClick={() => toggleEquipment(equip.id)}
                    className="flex items-center justify-between py-1 cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-brand-red border border-brand-red text-white'
                            : 'bg-dark-950 border border-dark-700 group-hover:border-neutral-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-3" />}
                      </span>
                      <span
                        className={`text-sm transition-colors ${
                          isChecked
                            ? 'font-medium text-white'
                            : 'text-neutral-400 group-hover:text-white'
                        }`}
                      >
                        {equip.label}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                      ({equip.count})
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
