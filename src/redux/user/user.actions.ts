import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Endpoints, instance } from '../../api';
import { RootState } from '../root.reducer';
import { ValidationErrors } from '../types';

type UsersProfileResponse = SpotifyApi.CurrentUsersProfileResponse;

export const fetchUserProfile = createAsyncThunk<
  UsersProfileResponse,
  void,
  { rejectValue: ValidationErrors; state: RootState }
>('user/fetchUserProfile', async (_, { rejectWithValue, getState }) => {
  const shouldFail = getState().app.failOnPurpose;
  const axios = instance({
    shouldFail,
  });
  try {
    const res = await axios.get<UsersProfileResponse>(Endpoints.GetCurrentUsersProfile);
    return res.data;
  } catch (err) {
    let error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});
