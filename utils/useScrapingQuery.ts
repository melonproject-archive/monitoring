import * as R from 'ramda';
import { useQuery } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import { useEffect } from 'react';

type QueryPair = [DocumentNode, DocumentNode];
type ProceedOrNotFn = (result: any, expected) => boolean;

const deepMerge = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b];
  }

  if (R.is(Object, a) && R.is(Object, b)) {
    return R.mergeDeepWith(deepMerge, a, b);
  }

  return b;
};

export const proceedPaths = (paths: string[]) => (current: any, expected: number): boolean => {
  return R.path([...paths, 'length'], current) === expected;
};

export function useScrapingQuery([query, more]: QueryPair, proceed: ProceedOrNotFn, props?: any) {
  const variables = {
    ...(props && props.variables),
    limit: (props.variables && props.variables.limit) || 1000,
    skip: (props.variables && props.variables.skip) || 0,
  };

  const result = useQuery(query, {
    ...props,
    variables,
  });

  const fetchMore = (data, skip) => {
    if (!proceed(data, skip)) {
      return;
    }

    result.fetchMore({
      query: more,
      variables: {
        ...variables,
        skip,
      },
      updateQuery: (previous, options) => {
        const merged = deepMerge(previous, options.fetchMoreResult);
        fetchMore(merged, skip + variables.limit);
        return merged;
      },
    });
  };

  // The length of the result is a good indicator for whether there are any
  // results at all yet. The loading state is not helpful for that.
  const filled = !!(result && result.data && Object.keys(result.data).length);

  useEffect(() => {
    if (!filled) {
      return;
    }

    // Only after the query is initially filled, we continue.
    fetchMore(result.data, variables.skip + variables.limit);
  }, [filled]);

  return result;
}
