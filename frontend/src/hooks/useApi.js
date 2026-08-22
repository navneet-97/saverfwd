import { useState, useCallback } from 'react';

export function useApi(apiFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn(...args);
        // Result is already unwrapped by the API layer
        setData(result);
        return result;
      } catch (err) {
        const apiError = {
          status: err.response?.status,
          message: getErrorMessage(err),
          data: err.response?.data,
        };
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [apiFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, setData, reset };
}

function getErrorMessage(error) {
  if (error.message) return error.message;
  if (error.response?.status === 401) return 'Please log in again.';
  if (error.response?.status === 403) return "You don't have permission to perform this action.";
  if (error.response?.status === 404) return 'The requested resource was not found.';
  if (error.response?.status === 409) return 'This food has already been claimed.';
  if (error.response?.status === 400) return 'Please check your input and try again.';
  if (error.response?.status >= 500) return 'Something went wrong. Please try again.';
  if (error.message === 'Network Error') return 'Network error. Please check your connection.';
  return 'Something went wrong. Please try again.';
}

export default useApi;
