import { createSlice } from '@reduxjs/toolkit';
import { ErrorState } from '../types';
import { fetchUserProfile } from './user.actions';

interface UserState extends ErrorState {
  profileData: SpotifyApi.CurrentUsersProfileResponse | {};
}

const initialState: UserState = {
  profileData: {},
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.profileData = action.payload;
      state.error = null;
    });

    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      // For the purpose of the demo, user data is reset in case of an error
      state.profileData = {};
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = { message: 'unknown', status: 99 };
      }
    });
  },
});

export default userSlice.reducer;
