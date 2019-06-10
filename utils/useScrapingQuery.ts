import * as R from 'ramda';
import { useQuery } from '@apollo/react-hooks';
import { useRef, useEffect } from 'react';
import { DocumentNode } from 'graphql';

type QueryPair = [DocumentNode, DocumentNode];

type ProceedOrNotFn = (result: any, expected: number) => boolean;

const deepMerge = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b];
  }

  if (R.is(Object, a) && R.is(Object, b)) {
    return R.mergeDeepWith(deepMerge, a, b);
  }

  return b;
};

export const proceedPaths = (paths: string[]) => (current: any, expected: number) => {
  return R.path([...paths, 'length'], current) === expected;
};

export function useScrapingQuery([query, more]: QueryPair, proceed: ProceedOrNotFn, props?: any) {
  const limit = (props.variables && props.variables.limit) || 100;
  const skip = useRef((props.variables && props.variables.skip) || 0);
  const result = useQuery(query, {
    ...props,
    variables: {
      ...(props && props.variables),
      limit,
      skip: skip.current,
    },
  });

  const loading = useRef(result.loading);

  useEffect(() => {
    if (!!result.loading || !!result.error || !proceed(result.data, skip.current + limit)) {
      loading.current = false;
      return;
    }

    loading.current = true;

    result.fetchMore({
      query: more,
      variables: {
        ...result.variables,
        skip: skip.current + limit,
      },
      updateQuery: (previous, options) => {
        skip.current = skip.current + limit;
        return deepMerge(previous, options.fetchMoreResult);
      },
    });
  }, [result, skip.current]);

  return {
    ...result,
    loading: loading.current,
  };
}
