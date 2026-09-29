export interface ExerciseStep {
    title: string;
    desc: string;
}

export interface Exercise {
    id: string;
    name: string;
    category: string;
    body_part: string;
    equipment: string;
    instructions: string;
    secondary_muscles: string[];
    video_url: string;
    video_type: string;
    channel: {
        name: string;
        url: string;
    };
    steps?: ExerciseStep[];
    common_mistake?: string;
    level?: string;
    movement_pattern?: string;
}

