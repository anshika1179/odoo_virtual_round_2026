import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { makeCurrency } from './currency';

export default function useCurrency() {
  const { user } = useAuth();
  return useMemo(() => makeCurrency(user?.country), [user?.country]);
}
