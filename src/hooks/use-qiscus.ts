import { useAtom } from 'jotai';
import { qiscusAtom } from '../state';

export function useQiscus() {
  let [data] = useAtom(qiscusAtom);
  return data;
}
