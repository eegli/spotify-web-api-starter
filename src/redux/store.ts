import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import logger from 'redux-logger';
import rootReducer from './root.reducer';

const isDev = process.env.NODE_ENV !== 'production';

const defaultMiddleware = getDefaultMiddleware({
  serializableCheck: false,
  immutableCheck: false,
});

// For the demo, the logger is active in all environments. This
// structure is solely to show how different middlewares for different
// environments could be added to the store
const devMiddleware = [logger];
const prodMiddleware = [logger];

const store = configureStore({
  reducer: rootReducer,
  middleware: () =>
    isDev
      ? defaultMiddleware.concat(devMiddleware)
      : defaultMiddleware.concat(prodMiddleware),
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./root.reducer', () => {
    const newRootReducer = require('./root.reducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
