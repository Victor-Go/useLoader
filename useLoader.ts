import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type RunnerSetters = {
  setData: Dispatch<SetStateAction<any>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<any>>;
}

const hookRunner = async (loadFunction, { setLoading, setData, setError }: RunnerSetters, params?: any) => {
  try {
    setData(null)
    setError(null)
    setLoading(true)
    const data = await loadFunction(params)
    data && setData(data)
  } catch (err) {
    setError(err)
  } finally {
    setLoading(false)
  }
}

type RunnerCallbacks = {
  onSuccess?: (data: any) => any;
  onError?: (err: any) => any;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const callbackRunner = async (loadFunction, { onSuccess, onError, setLoading }: RunnerCallbacks, params: any) => {
  try {
    setLoading(true)
    const data = await loadFunction(params)
    onSuccess && onSuccess(data)
  } catch (err) {
    onError && onError(err)
  } finally {
    setLoading(false)
  }
}

export type LoaderOptions = {
  defaultParams?: any;
  manual?: boolean;
  onSuccess?: (data: any) => any;
  onError?: (err: any) => any;
}

const useLoader = (loadFunction: (args: any) => any, options?: LoaderOptions) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    (!options || !options.manual) && hookRunner(loadFunction, { setLoading, setData, setError }, options?.defaultParams)
  }, [])

  const run = (params: any) => {
    callbackRunner(loadFunction, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      setLoading
    }, params)
  }

  return { data, loading, error, run }
}

export default useLoader