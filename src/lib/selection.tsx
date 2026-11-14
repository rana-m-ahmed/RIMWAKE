import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
export type Selection = {
  a: string;
  b: string;
  index: number;
  mode: 'coarse' | 'refined';
  mobile: 'A' | 'B';
};
const initial: Selection = { a: 'im1', b: 'im2', index: 0, mode: 'coarse', mobile: 'A' };
const SelectionContext = createContext<{
  selection: Selection;
  setSelection: Dispatch<SetStateAction<Selection>>;
}>({ selection: initial, setSelection: () => {} });
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState(initial);
  return <SelectionContext value={{ selection, setSelection }}>{children}</SelectionContext>;
}
export const useSelection = () => useContext(SelectionContext);
