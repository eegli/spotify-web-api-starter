// Regular Error Object from the Spotify Web API
interface SpotifyRegularError {
  readonly status: number;
  readonly message: string;
}

export interface ValidationErrors {
  error: SpotifyRegularError;
}

export interface ErrorState {
  error: null | SpotifyRegularError;
}

// Explicitly type the PagingObject until it's fixed on DefinitelyTyped
export type PagingObject<T> = Pick<SpotifyApi.PagingObject<T>, 'items'> & {
  hasNextPage: boolean;
};

export interface SavedTracksParams {
  market?: string;
  limit?: number;
  offset?: number;
}

export interface TopTracksParams {
  time_range?: 'long_term' | 'medium_term' | 'short_term';
  limit?: number;
}

export interface MultipleArtistsParams {
  ids: string;
}

export interface MultipleAudioFeaturesParams {
  ids: string;
}
