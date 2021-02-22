import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// * The app slice is used to control UI components and set general
// * conditions, e.g. if something is downloading (= disable buttons) or
// * if fetching is allowed

interface AppState {
  isFetchAllowed: boolean;
  isDownloading: boolean;
  showFullLibrary: boolean;
  dataToDisplay: any;
  failOnPurpose: boolean;
}

const initialState: AppState = {
  isFetchAllowed: true,
  isDownloading: false,
  failOnPurpose: false,
  showFullLibrary: false,
  dataToDisplay: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Boolean to control the dispatching of actions when downloading
    // the library recursively. This action can be dispatched in order
    // to stop downloading. Some thunks receive a condition callback
    // (app.isFetchAllowed). If it evaluates to false, the promise is
    // rejected and we break out of the recursive fetching. Remember
    // to re-enable fetching afterwards!
    // https://redux-toolkit.js.org/api/createAsyncThunk#canceling-before-execution

    setIsFetchAllowed: (state, action: PayloadAction<boolean>) => {
      state.isFetchAllowed = action.payload;
    },
    setIsDownloading: (state, action: PayloadAction<boolean>) => {
      state.isDownloading = action.payload;
    },
    setFailOnPurpose: (state, action: PayloadAction<boolean>) => {
      state.failOnPurpose = action.payload;
    },
    setShowFullLibrary: (state, action: PayloadAction<boolean>) => {
      state.showFullLibrary = action.payload;
    },
    setDataToDisplay: (state, action: PayloadAction<any>) => {
      state.dataToDisplay = action.payload;
    },
  },
});

export default appSlice.reducer;
export const {
  setIsFetchAllowed,
  setIsDownloading,
  setFailOnPurpose,
  setDataToDisplay,
  setShowFullLibrary,
} = appSlice.actions;
