import React from 'react';

export interface ExerciseSkeletonProps {
    count?: number;
}

export function ExerciseSkeleton({ count = 3 }: ExerciseSkeletonProps) {
    return (
        <div className="flex flex-col gap-3.5 w-full">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={`skeleton-${index}`}
                    className="w-full bg-dark-800 border border-dark-700/60 rounded-xl p-4 sm:p-5 shadow-md"
                >
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-stretch justify-between w-full">
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:flex-1 items-start min-w-0">
                            {/* Thumbnail skeleton 16:9 con shimmer */}
                            <div className="w-full sm:w-48 md:w-52 aspect-video rounded-lg animate-shimmer border border-dark-700/60 shrink-0" />
                            
                            {/* Metadatos y títulos skeleton */}
                            <div className="flex flex-col justify-between gap-2.5 w-full sm:w-72 self-stretch py-0.5">
                                <div>
                                    <div className="h-6 w-44 sm:w-56 rounded bg-dark-700 animate-shimmer" />
                                    <div className="h-3.5 w-full max-w-60 rounded bg-dark-700/80 animate-shimmer mt-2" />
                                </div>
                                <div className="h-3.5 w-36 rounded bg-dark-700 animate-shimmer" />
                            </div>
                        </div>

                        {/* Badges arriba y flecha abajo a la derecha en skeleton */}
                        <div className="hidden sm:flex flex-col items-end justify-between shrink-0 pl-2 self-stretch py-0.5">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-20 rounded bg-dark-700 animate-shimmer" />
                                <div className="h-4 w-14 rounded bg-dark-700 animate-shimmer" />
                            </div>
                            <div className="w-5 h-5 rounded bg-dark-700 animate-shimmer shrink-0" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
