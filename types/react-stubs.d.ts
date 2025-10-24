declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;
  export type InputHTMLAttributes<T> = Record<string, any>;
  export type ButtonHTMLAttributes<T> = Record<string, any>;
  export type LabelHTMLAttributes<T> = Record<string, any>;
  export type DetailedHTMLProps<E, T> = E;
  export type ForwardedRef<T> = any;
  export type ChangeEvent<T = Element> = { target: T & { value: any; checked?: boolean } };

  export const useState: any;
  export const useMemo: any;
  export const useCallback: any;
  export const useEffect: any;
  export const forwardRef: any;
  const React: any;
  export default React;
}

declare module 'react-dom/client' {
  export const createRoot: any;
}

declare module 'react-dom/test-utils' {
  export const act: any;
}
