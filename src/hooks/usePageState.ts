import { useCallback, useState } from 'react';

export type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success' };

export const usePageState = (
  initialState: PageState = { status: 'loading' },
) => {
  const [pageState, setPageState] = useState<PageState>(initialState);

  const setLoading = useCallback(() => setPageState({ status: 'loading' }), []);
  const setSuccess = useCallback(() => setPageState({ status: 'success' }), []);
  const setError = useCallback(
    (message: string) => setPageState({ status: 'error', message }),
    [],
  );
  const setEmpty = useCallback(() => setPageState({ status: 'empty' }), []);

  return {
    pageState,
    setLoading,
    setSuccess,
    setError,
    setEmpty,
    isLoading: pageState.status === 'loading',
    isSuccess: pageState.status === 'success',
    isError: pageState.status === 'error',
    isEmpty: pageState.status === 'empty',
  };
};
