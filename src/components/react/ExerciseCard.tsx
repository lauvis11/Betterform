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
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-stretch justify-between w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:flex-1 items-start min-w-0">
                    {/* Frame de previsualización 16:9 con mayor anchura */}
                    <div className="relative w-full sm:w-48 md:w-52 aspect-video rounded-lg overflow-hidden bg-dark-950 border border-dark-700/70 shrink-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-950 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-dark-800/90 border border-dark-700 flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                            </div>
                        </div>

                        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white font-mono text-[10px] rounded uppercase font-semibold tracking-wider">
                            {exercise.video_type}
                        </div>
                    </div>

                    {/* Información y metadatos */}
                    <div className="flex flex-col justify-between gap-2 min-w-0 flex-1 self-stretch py-0.5">
                        <div>
                            {/* En móviles: Categoría y equipamiento arriba */}
                            <div className="flex sm:hidden items-center gap-2 mb-1.5">
                                <span className="px-2.5 py-0.5 rounded bg-dark-950 text-white text-xs font-semibold border border-dark-700">
                                    {exercise.category}
                                </span>
                                <span className="text-dark-600 select-none">•</span>
                                <span className="text-white text-xs font-medium capitalize">
                                    {exercise.equipment}
                                </span>
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                                {exercise.name}
                            </h2>

                            {/* Extracto breve de instrucciones limitado */}
                            {exercise.instructions && (
                                <p className="text-xs sm:text-[13px] text-neutral-400 line-clamp-1 sm:line-clamp-2 leading-relaxed mt-1 max-w-xl">
                                    {exercise.instructions.length > 95
                                        ? `${exercise.instructions.slice(0, 95).trim()}...`
                                        : exercise.instructions}
                                </p>
                            )}
                        </div>

                        {/* Canal de YouTube en texto blanco con archivo SVG de YouTube */}
                        <div className="flex items-center gap-2 text-xs pt-0.5">
                            <img 
                                src={typeof youtubeIcon === 'string' ? youtubeIcon : (youtubeIcon as any).src} 
                                alt="YouTube" 
                                className="w-3.5 h-3.5 shrink-0 brightness-0 invert opacity-90" 
                            />
                            <span className="text-white font-medium truncate">
                                {exercise.channel.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Lado derecho en desktop: Arriba categoría + equipamiento, abajo flecha */}
                <div className="hidden sm:flex flex-col items-end justify-between shrink-0 pl-2 self-stretch py-0.5">
                    {/* Arriba a la derecha */}
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-dark-950 text-white text-xs sm:text-sm font-semibold border border-dark-700">
                            {exercise.category}
                        </span>
                        <span className="text-dark-600 select-none">•</span>
                        <span className="text-white text-xs sm:text-sm font-medium capitalize">
                            {exercise.equipment}
                        </span>
                    </div>

                    {/* Flecha de navegación abajo a la derecha */}
                    <div className="text-neutral-500 group-hover:text-brand-red transition-colors">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </a>
    );
});
