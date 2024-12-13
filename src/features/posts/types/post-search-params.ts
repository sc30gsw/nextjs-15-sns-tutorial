import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const postSearchParamsCache = createSearchParamsCache({
  content: parseAsString.withDefault(''),
})
