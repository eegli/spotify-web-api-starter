import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Endpoints as E, instance } from '../../api';
import { RootState } from '../root.reducer';
import {
  MultipleArtistsParams,
  MultipleAudioFeaturesParams,
  SavedTracksParams,
  TopTracksParams,
  ValidationErrors,
} from '../types';

type SavedTracksResponse = SpotifyApi.UsersSavedTracksResponse;
type TopTracksResponse = SpotifyApi.UsersTopTracksResponse;
type MultipleArtistsResponse = SpotifyApi.MultipleArtistsResponse;
type MultipleAudioFeaturesResponse = SpotifyApi.MultipleAudioFeaturesResponse;

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

export const fetchUsersSavedTracks = createAsyncThunk<
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
  'library/fetchUsersSavedTracks',
  async (params, { rejectWithValue, getState }) => {
    const offset = getState().library.tracks.items.length;
    const axios = instance<SavedTracksParams>({
      params: { limit: 50, ...params, offset },
    });

    try {
      const res = await axios.get<SavedTracksResponse>(E.GetUsersSavedTracks);
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

export const fetchUsersTopTracks = createAsyncThunk<
  TopTracksResponse,
  TopTracksParams | void,
  {
    rejectValue: ValidationErrors;
    state: RootState;
  }
>('library/fetchUsersTopTracks', async (params, { rejectWithValue }) => {
  const axios = instance<TopTracksParams>({
    params: {
      limit: 50,
      time_range: 'short_term',
      ...params,
    },
  });

  try {
    const res = await axios.get<TopTracksResponse>(E.GetUsersTopTracks);
    return res.data;
  } catch (err) {
    let error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});
