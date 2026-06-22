import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { showToast } from '../slices/uiSlice';
import { logger } from '@utils/logger';

export const apiMiddleware: Middleware = store => next => action => {
  if (isRejectedWithValue(action)) {
    const message =
      typeof action.payload === 'string'
        ? action.payload
        : 'An unexpected error occurred';

    logger.error('Redux async action rejected', {
      type: action.type,
      payload: action.payload,
    });

    store.dispatch(
      showToast({
        message,
        type: 'error',
      })
    );
  }

  return next(action);
};
