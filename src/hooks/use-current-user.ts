import { useAtom } from 'jotai';
import { currentUserAtom } from '../state';
import type { User } from '../types';

export function useCurrentUser(): User | undefined {
  let [data] = useAtom(currentUserAtom);
  return data;
}
