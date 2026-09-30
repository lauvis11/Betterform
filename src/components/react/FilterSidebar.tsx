import React, { useState } from 'react';
import { Check, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

export interface FilterItem {
  id: string;
  label: string;
  count: number;
}

export interface FilterSidebarProps {
  selectedMuscles?: string[];
  selectedEquipment?: string[];
  onToggleMuscle?: (id: string) => void;
  onToggleEquipment?: (id: string) => void;
  onClearAll?: () => void;
  muscleCounts?: Record<string, number>;
  equipmentCounts?: Record<string, number>;
  totalCount?: number;
}

const BASE_MUSCLE_GROUPS: Omit<FilterItem, 'count'>[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'pecho', label: 'Pecho' },
  { id: 'espalda', label: 'Espalda' },
  { id: 'piernas', label: 'Piernas' },
  { id: 'hombros', label: 'Hombros' },
  { id: 'brazos', label: 'Brazos' },
  { id: 'abdomen', label: 'Abdomen' },
];

const BASE_EQUIPMENT_LIST: Omit<FilterItem, 'count'>[] = [
  { id: 'barra', label: 'Barra' },
  { id: 'mancuernas', label: 'Mancuernas' },
  { id: 'maquina', label: 'Máquina' },
  { id: 'peso-corporal', label: 'Peso corporal' },
  { id: 'polea', label: 'Polea' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedMuscles: propSelectedMuscles,
  selectedEquipment: propSelectedEquipment,
  onToggleMuscle,
  onToggleEquipment,
  onClearAll,
  muscleCounts,
  equipmentCounts,
  totalCount,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMuscleOpen, setIsMuscleOpen] = useState(true);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(true);

  // Estado interno en caso de usarse en modo no controlado
  const [internalMuscles, setInternalMuscles] = useState<string[]>(['todos']);
  const [internalEquipment, setInternalEquipment] = useState<string[]>([]);

  const selectedMuscles = propSelectedMuscles ?? internalMuscles;
  const selectedEquipment = propSelectedEquipment ?? internalEquipment;

  // Alternar selección de categoría/músculo
  const handleToggleMuscle = (id: string) => {
    if (onToggleMuscle) {
      onToggleMuscle(id);
      return;
    }

    if (id === 'todos') {
      setInternalMuscles(['todos']);
      return;
    }

    setInternalMuscles((prev) => {
      const withoutTodos = prev.filter((m) => m !== 'todos');
      if (withoutTodos.includes(id)) {
        const next = withoutTodos.filter((m) => m !== id);
        return next.length === 0 ? ['todos'] : next;
      } else {
        return [...withoutTodos, id];
      }
    });
  };

  // Alternar selección de equipamiento
  const handleToggleEquipment = (id: string) => {
    if (onToggleEquipment) {
      onToggleEquipment(id);
      return;
    }

    setInternalEquipment((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Limpiar todos los filtros: restablece al estado por defecto con solo "todos"
  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
      return;
    }

    setInternalMuscles(['todos']);
    setInternalEquipment([]);
  };

  // Mapear con conteos reales si se proporcionan
  const muscleGroups: FilterItem[] = BASE_MUSCLE_GROUPS.map((m) => ({
    ...m,
    count:
      m.id === 'todos'
        ? totalCount ?? (muscleCounts ? Object.values(muscleCounts).reduce((a, b) => a + b, 0) : 16)
        : muscleCounts?.[m.id] ?? 0,
  }));

  const equipmentList: FilterItem[] = BASE_EQUIPMENT_LIST.map((e) => ({
    ...e,
    count: equipmentCounts?.[e.id] ?? 0,
  }));

  // Verifica si está en el estado por defecto
  const isDefaultState =
    selectedMuscles.length === 1 &&
    selectedMuscles[0] === 'todos' &&
    selectedEquipment.length === 0;

  // Lista combinada de filtros activos (excluyendo "todos")
  const activeFilters = [
    ...muscleGroups
      .filter((m) => m.id !== 'todos' && selectedMuscles.includes(m.id))
      .map((m) => ({
        id: m.id,
        label: m.label,
        type: 'muscle' as const,
      })),
    ...equipmentList
      .filter((e) => selectedEquipment.includes(e.id))
      .map((e) => ({
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
        } lg:block shrink-0 w-full lg:w-68 bg-dark-800/40 border border-dark-700/80 rounded-xl lg:self-start p-5 z-20 my-4 lg:my-6 shadow-sm`}
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
                      ? handleToggleMuscle(filter.id)
                      : handleToggleEquipment(filter.id)
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
              {muscleGroups.map((muscle) => {
                const isChecked = selectedMuscles.includes(muscle.id);
                return (
                  <div
                    key={muscle.id}
                    onClick={() => handleToggleMuscle(muscle.id)}
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
              {equipmentList.map((equip) => {
                const isChecked = selectedEquipment.includes(equip.id);
                return (
                  <div
                    key={equip.id}
                    onClick={() => handleToggleEquipment(equip.id)}
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
