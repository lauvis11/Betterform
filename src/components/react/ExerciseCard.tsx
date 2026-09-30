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

export const ExerciseCard = React.memo(function ExerciseCard({
    exercise,
    index = 0,
    staggerDelayMs = 60,
    animate = true
}: ExerciseCardProps) {
    return (
        <a
            href={`/exercises/${exercise.id}`}
            style={animate ? { animationDelay: `${index * staggerDelayMs}ms` } : undefined}
            className={`${animate ? 'animate-card-in' : ''} group block w-full bg-dark-800 hover:bg-dark-700/80 border border-dark-700 hover:border-brand-red rounded-xl p-4 sm:p-5 transition-all shadow-md cursor-pointer`}
        >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-stretch w-full">
                {/* Frame de previsualización 16:9 con mayor anchura */}
                <div className="relative w-full sm:w-48 md:w-52 aspect-video rounded-lg overflow-hidden bg-dark-950 border border-dark-700/70 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-linear-to-br from-dark-900 via-dark-800 to-dark-950 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-dark-800/90 border border-dark-700 flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                        </div>
                    </div>

                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white font-mono text-[10px] rounded uppercase font-semibold tracking-wider">
                        {exercise.video_type}
                    </div>
                </div>

                {/* Información y metadatos ocupando todo el ancho restante */}
                <div className="flex flex-col justify-between gap-2 min-w-0 flex-1 self-stretch py-0.5 w-full">
                    <div>
                        {/* Fila 1: Título a la izquierda y Badges pegadas a la derecha */}
                        <div className="flex items-center justify-between gap-3 flex-wrap mb-1.5 w-full">
                            <h2 className="text-base sm:text-xl font-bold text-white">
                                {exercise.name}
                            </h2>
                            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 leading-tight rounded-sm bg-brand-red border border-transparent text-white font-bold text-center whitespace-nowrap text-[10px] sm:text-[11px]">
                                    {exercise.category}
                                </span>
                                <span className="text-neutral-500 select-none text-[10px] sm:text-[11px]">-</span>
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 leading-tight rounded-sm bg-dark-700/60 border border-dark-600 text-neutral-300 font-medium capitalize text-center whitespace-nowrap text-[10px] sm:text-[11px]">
                                    {exercise.equipment}
                                </span>
                            </div>
                        </div>

                        {/* Fila 2: Extracto de instrucciones ocupando todo el ancho disponible */}
                        {exercise.instructions && (
                            <p className="text-xs sm:text-[13px] text-neutral-400 line-clamp-1 sm:line-clamp-2 leading-relaxed w-full">
                                {exercise.instructions}
                            </p>
                        )}
                    </div>

                    {/* Fila 3: Canal de YouTube y Tipo de Video a la izquierda, flecha a la derecha */}
                    <div className="flex items-center justify-between gap-2 pt-0.5 w-full">
                        <div className="flex items-center gap-2 text-xs sm:text-sm truncate">
                            <img 
                                src={typeof youtubeIcon === 'string' ? youtubeIcon : (youtubeIcon as any).src} 
                                alt="YouTube" 
                                className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 brightness-0 invert opacity-90" 
                            />
                            <span className="text-white font-medium truncate">
                                {exercise.channel.name}
                            </span>
                            {exercise.video_type && (
                                <>
                                    <span className="text-neutral-500 select-none">•</span>
                                    <span className="text-neutral-400 shrink-0">
                                        Tipo: <span className="text-white font-medium capitalize">{exercise.video_type}</span>
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="hidden sm:block text-neutral-500 group-hover:text-brand-red transition-colors shrink-0">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
});
