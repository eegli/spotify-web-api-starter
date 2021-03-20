import { AnyAction, createSlice } from '@reduxjs/toolkit';
import { ErrorState, PagingObject } from '../types';
import {
  fetchArtistGenres,
  fetchAudioFeatures,
  fetchRecentlyPlayedTracks,
  fetchSavedTracks,
  fetchTopTracks,
} from './library.actions';

type GenreArtistObj = {
  artistId: string;
  genres: string[];
  // Name is just for readability, not needed for the mapping
  name: string;
};

type TopTracksObj = {
  trackId: string;
  title: string;
  artists: string[];
  popularity: number;
};

type RecentlyPlayedTracksObj = {
  trackId: string;
  title: string;
  artists: string[];
  playedAt: string;
};

// * TRACKS holds the basic saved track objects of a users library
//
// * EXTRAS holds all the extra data then can be used to enrich the
// * main data (the user's saved tracks)
//
// TODO: Add audio analysis
interface LibraryState extends ErrorState {
  tracks: PagingObject<SpotifyApi.SavedTrackObject>;
  genres: GenreArtistObj[];
  extras: {
    topTracks: TopTracksObj[];
    audioFeatures: SpotifyApi.AudioFeaturesObject[];
    recentlyPlayedTracks: RecentlyPlayedTracksObj[];
    // TODO: Fetch audio analysis
    audioAnalysis?: any;
  };
  trackCount: number;
}

const initialState: LibraryState = {
  tracks: {
    items: [],
    hasNextPage: true,
  },
  genres: [],
  extras: {
    topTracks: [],
    audioFeatures: [],
    recentlyPlayedTracks: [],
  },
  trackCount: 0,
  error: null,
};

const isSuccessActon = (action: AnyAction) => {
  return action.type.endsWith('success');
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSavedTracks.fulfilled, (state, { payload }) => {
        state.tracks.items = [...state.tracks.items, ...payload.items];
        state.trackCount = payload.total;
        state.tracks.hasNextPage = !!payload.next;
      })
      .addCase(fetchSavedTracks.rejected, (state, { payload }) => {
        if (payload) state.error = payload.error;
      })

      .addCase(fetchTopTracks.fulfilled, (state, { payload }) => {
        // For the demo, we don't need to append to existing top
        // tracks. The initial request is enough
        state.extras.topTracks = payload.items.map(el => ({
          trackId: el.id,
          title: el.name,
          artists: el.artists.map(obj => obj.name),
          popularity: el.popularity,
        }));
      })
      .addCase(fetchTopTracks.rejected, (state, { payload }) => {
        if (payload) state.error = payload.error;
      })

      // For the demo, we don't need to append to existing recently
      // played tracks. The initial request is enough
      .addCase(fetchRecentlyPlayedTracks.fulfilled, (state, { payload }) => {
        state.extras.recentlyPlayedTracks = payload.items.map(el => ({
          trackId: el.track.id,
          title: el.track.name,
          artists: el.track.artists.map(obj => obj.name),
          playedAt: el.played_at,
        }));
      })
      .addCase(fetchRecentlyPlayedTracks.rejected, (state, { payload }) => {
        if (payload) state.error = payload.error;
      })

      // Artist details are always fetched in combination with saved
      // tracks and can therefore safely be appended
      .addCase(fetchArtistGenres.fulfilled, (state, { payload }) => {
        const genreArtists: GenreArtistObj[] = payload.artists.map(e => ({
          artistId: e.id,
          name: e.name,
          genres: e.genres,
        }));

        state.genres = [...state.genres, ...genreArtists];
      })
      .addCase(fetchArtistGenres.rejected, (state, { payload }) => {
        if (payload) state.error = payload.error;
      })

      .addCase(fetchAudioFeatures.fulfilled, (state, { payload }) => {
        state.extras.audioFeatures = [
          ...state.extras.audioFeatures,
          ...payload.audio_features,
        ];
      })
      .addCase(fetchAudioFeatures.rejected, (state, { payload }) => {
        if (payload) state.error = payload.error;
      })
      .addMatcher(isSuccessActon, state => {
        state.error = null;
      });
  },
});

export default librarySlice.reducer;
