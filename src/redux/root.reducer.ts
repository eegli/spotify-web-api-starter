import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './app/app.slice';
import libraryReducer from './library/library.reducers';
import tokenReducer from './token/token.slice';
import userReducer from './user/user.reducers';

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  token: tokenReducer,
  library: libraryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
