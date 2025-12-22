import { useState } from 'react';

export type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success' };

export const usePageState = (
  initialState: PageState = { status: 'loading' },
) => {
  const [pageState, setPageState] = useState<PageState>(initialState);

  return {
    pageState,
    setLoading: () => setPageState({ status: 'loading' }),
    setSuccess: () => setPageState({ status: 'success' }),
    setError: (message: string) => setPageState({ status: 'error', message }),
    setEmpty: () => setPageState({ status: 'empty' }),
    isLoading: pageState.status === 'loading',
    isSuccess: pageState.status === 'success',
    isError: pageState.status === 'error',
    isEmpty: pageState.status === 'empty',
  };
};
