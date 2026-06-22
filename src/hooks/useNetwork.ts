import { useEffect, useState, useCallback } from 'react';
import { subscribeToNetworkChanges, checkNetworkConnection } from '@utils/network';
import { useAppDispatch } from './useAppDispatch';
import { setOnlineStatus } from '@store/slices/uiSlice';
import { useAppSelector } from './useAppSelector';

export const useNetwork = () => {
  const dispatch = useAppDispatch();
  const isOnline = useAppSelector(state => state.ui.isOnline);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    const connected = await checkNetworkConnection();
    dispatch(setOnlineStatus(connected));
    setIsChecking(false);
    return connected;
  }, [dispatch]);

  useEffect(() => {
    checkConnection();

    const unsubscribe = subscribeToNetworkChanges(connected => {
      dispatch(setOnlineStatus(connected));
    });

    return unsubscribe;
  }, [checkConnection, dispatch]);

  return { isOnline, isChecking, checkConnection };
};
