import { atom, Getter, useAtom } from 'jotai';

export function useComputedAtomValue<R>(cb: (get: Getter) => R) {
  let [data] = useAtom(atom(cb));
  return data;
}

export function useComputedAtom<R>(cb: (get: Getter) => R) {
  return useAtom(atom(cb));
}
