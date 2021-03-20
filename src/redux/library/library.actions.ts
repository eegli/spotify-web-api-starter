import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Endpoints as E, instance } from '../../api';
import { RootState } from '../root.reducer';
import {
  MultipleArtistsParams,
  MultipleAudioFeaturesParams,
  RecentlyPlayedTracksParams,
  SavedTracksParams,
  TopTracksParams,
  ValidationErrors,
} from '../types';

type SavedTracksResponse = SpotifyApi.UsersSavedTracksResponse;
type TopTracksResponse = SpotifyApi.UsersTopTracksResponse;
type MultipleArtistsResponse = SpotifyApi.MultipleArtistsResponse;
type MultipleAudioFeaturesResponse = SpotifyApi.MultipleAudioFeaturesResponse;
type RecentlyPlayedTracksResponse = SpotifyApi.UsersRecentlyPlayedTracksResponse;

export const fetchAudioFeatures = createAsyncThunk<
  MultipleAudioFeaturesResponse,
  MultipleAudioFeaturesParams,
  { rejectValue: ValidationErrors; state: RootState }
>('library/fetchAudioFeatures', async (params, { rejectWithValue }) => {
  const axios = instance<MultipleAudioFeaturesParams>({
    params: { ids: params.ids },
  });

  try {
    const res = await axios.get<MultipleAudioFeaturesResponse>(
      E.GetMultipleAudioFeatures
    );
    return res.data;
  } catch (err) {
    let error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const fetchArtistGenres = createAsyncThunk<
  MultipleArtistsResponse,
  MultipleArtistsParams,
  {
    rejectValue: ValidationErrors;
    state: RootState;
  }
>('library/fetchArtistGenres', async (params, { rejectWithValue }) => {
  const axios = instance<MultipleArtistsParams>({
    params: { ids: params.ids },
  });

  try {
    const res = await axios.get<MultipleArtistsResponse>(E.GetMultipleArtists);
    return res.data;
  } catch (err) {
    let error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const fetchSavedTracks = createAsyncThunk<
  SavedTracksResponse,
  // This thunk accepts an optional url to do follow up requests on
  // the paginated endpoint to fetch the whole library. If we want
  // optional arguments like here, they need to be passed as an object
  // with optional types
  SavedTracksParams | void,
  {
    rejectValue: ValidationErrors;
    state: RootState;
  }
>(
  'library/fetchSavedTracks',
  async (params, { rejectWithValue, getState }) => {
    const offset = getState().library.tracks.items.length;
    const axios = instance<SavedTracksParams>({
      params: { limit: 50, ...params, offset },
    });

    try {
      const res = await axios.get<SavedTracksResponse>(E.GetSavedTracks);
      return res.data;
    } catch (err) {
      let error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  },
  {
    condition: (_, { getState }) => {
      const { library, app } = getState();

      if (!library.tracks.hasNextPage || !app.isFetchAllowed) {
        return false;
      }
    },
    dispatchConditionRejection: true,
  }
);

export const fetchTopTracks = createAsyncThunk<
  TopTracksResponse,
  TopTracksParams | void,
  {
    rejectValue: ValidationErrors;
    state: RootState;
  }
>('library/fetchTopTracks', async (params, { rejectWithValue }) => {
  const axios = instance<TopTracksParams>({
    params: {
      limit: 50,
      time_range: 'short_term',
      ...params,
    },
  });

  try {
    const res = await axios.get<TopTracksResponse>(E.GetTopTracks);
    return res.data;
  } catch (err) {
    let error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const fetchRecentlyPlayedTracks = createAsyncThunk<
  RecentlyPlayedTracksResponse,
  RecentlyPlayedTracksParams | void,
  {
    rejectValue: ValidationErrors;
    state: RootState;
  }
>('library/fetchRecentlyPlayedTracks', async (params, { rejectWithValue }) => {
  const axios = instance<RecentlyPlayedTracksParams>({
    params: {
      limit: 50,
      ...params,
    },
  });

  try {
    const res = await axios.get<RecentlyPlayedTracksResponse>(E.GetRecentlyPlayedTracks);
    return res.data;
  } catch (err) {
    let error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});
