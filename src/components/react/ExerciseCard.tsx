import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import type { Exercise } from '../../types/exercise';
import youtubeIcon from '../../assets/icons/youtube-svgrepo-com.svg';

export interface ExerciseCardProps {
    exercise: Exercise;
    index?: number;
    staggerDelayMs?: number;
    animate?: boolean;
}

const categoryGradients: Record<string, string> = {
    Pecho: "from-red-950/40 via-dark-900 to-dark-950",
    Piernas: "from-emerald-950/40 via-dark-900 to-dark-950",
    Espalda: "from-blue-950/40 via-dark-900 to-dark-950",
    Hombros: "from-amber-950/40 via-dark-900 to-dark-950",
    Brazos: "from-purple-950/40 via-dark-900 to-dark-950",
    Core: "from-cyan-950/40 via-dark-900 to-dark-950",
    Abdomen: "from-cyan-950/40 via-dark-900 to-dark-950",
};

export const ExerciseCard = React.memo(function ExerciseCard({
    exercise,
    index = 0,
    staggerDelayMs = 60,
    animate = true
}: ExerciseCardProps) {
    const gradientClass = categoryGradients[exercise.category] || "from-dark-900 via-dark-850 to-dark-950";

    return (
        <a
            href={`/exercises/${exercise.id}`}
            style={animate ? { animationDelay: `${index * staggerDelayMs}ms` } : undefined}
            className={`${animate ? 'animate-card-in' : ''} group block w-full bg-dark-800 hover:bg-dark-700/80 border border-dark-700/80 hover:border-brand-red rounded-xl overflow-hidden sm:p-5 transition-all shadow-md cursor-pointer`}
        >
            <div className="flex flex-col sm:flex-row sm:gap-4 items-stretch w-full">
                {/* Frame superior en móvil (aspect-4/3 con gradiente y textura estilo recomendado) / Lateral 16:9 en desktop */}
                <div className="relative w-full aspect-4/3 sm:aspect-video sm:w-48 md:w-52 bg-dark-950 border-b sm:border border-dark-700/60 sm:border-dark-700/70 sm:rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <div className={`absolute inset-0 bg-linear-to-br ${gradientClass}`} />

                    {/* Patrón de malla de fondo sutil para dar textura deportiva */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[12px_12px]" />

                    {/* Botón Play central */}
                    <div className="relative z-10 w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-dark-900/90 sm:bg-dark-800/90 border border-dark-700 flex items-center justify-center text-white shadow-lg">
                        <Play className="w-5 h-5 sm:w-4 sm:h-4 text-white fill-current ml-0.5" />
                    </div>

                    {/* Badge de Tipo de video (esquina inferior derecha) */}
                    {exercise.video_type && (
                        <div className="absolute bottom-2 right-2 sm:bottom-1.5 sm:right-1.5 z-10 px-1.5 py-0.5 bg-black/80 backdrop-blur-xs text-neutral-300 sm:text-white font-mono text-[9px] sm:text-[10px] rounded uppercase font-semibold tracking-wider border border-white/5 sm:border-transparent">
                            {exercise.video_type}
                        </div>
                    )}
                </div>

                {/* Información y metadatos: p-4 en móvil (como recomendados), sin padding extra en desktop */}
                <div className="p-4 sm:p-0 sm:py-0.5 flex flex-col justify-between flex-1 gap-3 sm:gap-2 min-w-0 self-stretch w-full">
                    {/* Estructura Móvil (< sm): Exactamente como la tarjeta de recomendados */}
                    <div className="block sm:hidden">
                        {/* Etiquetas arriba */}
                        <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-brand-red text-white text-[10px] font-bold tracking-wider">
                                {exercise.category}
                            </span>
                            <span className="text-neutral-500 select-none text-[10px]">-</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-dark-700/60 border border-dark-600/60 text-neutral-300 text-[10px] font-medium capitalize">
                                {exercise.equipment}
                            </span>
                        </div>

                        {/* Nombre del ejercicio */}
                        <h2 className="text-base font-bold text-white line-clamp-1 leading-snug">
                            {exercise.name}
                        </h2>

                        {/* Breve snippet de instrucciones */}
                        {exercise.instructions && (
                            <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                                {exercise.instructions}
                            </p>
                        )}
                    </div>

                    {/* Estructura Desktop (>= sm): Título a la izquierda y Badges a la derecha */}
                    <div className="hidden sm:block">
                        <div className="flex items-start justify-between gap-3 mb-1.5 w-full">
                            <h2 className="text-xl font-bold text-white leading-snug min-w-0 flex-1">
                                {exercise.name}
                            </h2>
                            <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 leading-tight rounded-sm bg-brand-red border border-transparent text-white font-bold text-center whitespace-nowrap text-[11px]">
                                    {exercise.category}
                                </span>
                                <span className="text-neutral-500 select-none text-[11px]">-</span>
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 leading-tight rounded-sm bg-dark-700/60 border border-dark-600 text-neutral-300 font-medium capitalize text-center whitespace-nowrap text-[11px]">
                                    {exercise.equipment}
                                </span>
                            </div>
                        </div>

                        {exercise.instructions && (
                            <p className="text-[13px] text-neutral-400 line-clamp-2 leading-relaxed w-full">
                                {exercise.instructions}
                            </p>
                        )}
                    </div>

                    {/* Footer de la tarjeta: En móvil idéntico a recomendados (pt-2.5 border-t + 'Ver ->') */}
                    <div className="pt-2.5 sm:pt-0.5 border-t sm:border-t-0 border-dark-700/60 flex items-center justify-between text-xs sm:text-sm w-full">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2 sm:pr-0 truncate">
                            <img 
                                src={typeof youtubeIcon === 'string' ? youtubeIcon : (youtubeIcon as any).src} 
                                alt="YouTube" 
                                className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0 brightness-0 invert" 
                            />
                            <span className="text-white font-medium truncate text-[11px] sm:text-sm">
                                {exercise.channel.name}
                            </span>
                            {exercise.video_type && (
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="text-neutral-500 select-none">•</span>
                                    <span className="text-neutral-400 shrink-0 text-xs">
                                        Tipo: <span className="text-white font-medium capitalize">{exercise.video_type}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* CTA en móvil (Ver -> en rojo como recomendados) */}
                        <div className="inline-flex sm:hidden items-center gap-1 text-brand-red font-semibold text-[11px] shrink-0">
                            <span>Ver</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>

                        {/* Icono flecha en desktop */}
                        <div className="hidden sm:block text-neutral-500 group-hover:text-brand-red transition-colors shrink-0">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
});
