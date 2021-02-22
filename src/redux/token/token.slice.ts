import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessTokenObj } from '../../utils/urlParams';

type TokenState = {
  pending: boolean;
  accessToken: string;
  tokenError: string | null;
};

const initialState: TokenState = {
  pending: false,
  accessToken: '',
  tokenError: null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    storeTokenStart: state => {
      state.pending = true;
    },
    storeTokenSuccess: (state, action: PayloadAction<AccessTokenObj>) => {
      state.accessToken = action.payload.token;
      state.tokenError = null;
      state.pending = false;
    },
    storeTokenFailure: (state, action: PayloadAction<AccessTokenObj>) => {
      state.tokenError = action.payload.error;
      state.pending = false;
    },
  },
});

export const {
  storeTokenStart,
  storeTokenSuccess,
  storeTokenFailure,
} = tokenSlice.actions;
export default tokenSlice.reducer;
