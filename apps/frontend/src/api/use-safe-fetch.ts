/*
useFetch as of version 1.0.15 has absolutely no handling for parallel requests.
When two requests are made, and then two responses return, the second response
does not cause an update because the only thing that would cause an update inside useFetch is
setLoading(false), but loading is already false from when the first response returned.

This could easily be worked around by force updating on every response in useFetch.
However, this does not solve the case of responses returning out of order,
which would require major changes to useFetch in order to ignore
(except for setting them in the cache) responses coming in for old requests.

For now, we make sure useFetch never initiates a new request while still loading an old one,
and abort old requests whenever making a new one.
This is not ideal, because the old requests could be left pending so that
they can at least fill the cache instead of being totally wasted.
This also flashes an outdated data state briefly in the period between
aborting the new request and initiating the new one, where we are in a non-loading state.
In the future, we will need to replace useFetch with a more stable hook.
*/

import useFetch, { UseFetch, IncomingOptions } from 'use-http';
import { useState, useEffect, useRef } from 'react';

function useSafeFetch<T>(url: string, options: IncomingOptions): UseFetch<T> {
  const [currentFetchUrl, setCurrentFetchUrl] = useState(url);

  const useFetchResult = useRef() as React.MutableRefObject<UseFetch<T>>;

  // Important: This effect comes before the effect inside useFetch,
  // otherwise the first request would be immediately aborted
  useEffect(() => {
    useFetchResult.current.abort();
  }, [useFetchResult, url]);

  useFetchResult.current = useFetch(currentFetchUrl, options, [
    currentFetchUrl,
  ]);

  useEffect(() => {
    if (!useFetchResult.current.loading) {
      setCurrentFetchUrl(url);
    }
  }, [url, options, useFetchResult, useFetchResult.current.loading]);

  return useFetchResult.current;
}

export default useSafeFetch;
