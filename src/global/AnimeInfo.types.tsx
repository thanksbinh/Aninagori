export interface AnimeInfo {
  list_status: {
    is_rewatching: boolean;
    num_episodes_watched: number;
    num_times_rewatched: number;
    status: string;
    updated_at: string;
    score?: number;
    start_date?: string;
    finish_date?: string;
    tags?: string[];
  };
  node: {
    id: number;
    main_picture: {
      medium: string;
      large: string;
    };
    num_episodes: number;
    title: string;
  };
}
