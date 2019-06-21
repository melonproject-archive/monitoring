import * as R from 'ramda';
import { useQuery } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import { useState } from 'react';

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
  const variables = {
    ...(props && props.variables),
    limit: (props.variables && props.variables.limit) || 100,
    skip: (props.variables && props.variables.skip) || 0,
  };

  const result = useQuery(query, {
    ...props,
    variables,
    onCompleted: (data: any) => {
      const fetchMore = (merged: any, skip: number) => {
        if (!proceed(merged, skip)) {
          return false;
        }

        result.fetchMore({
          query: more,
          variables: {
            ...variables,
            skip,
          },
          updateQuery: (previous, options) => {
            const output = deepMerge(previous, options.fetchMoreResult);
            if (!fetchMore(output, skip + variables.limit)) {
              setLoading(false);
            }

            return output;
          },
        });

        return true;
      };

      if (!fetchMore(data, variables.skip + variables.limit)) {
        setLoading(false);
      }
    },
  });

  const [loading, setLoading] = useState(result.loading);

  return {
    ...result,
    loading: result.error ? result.loading : loading,
  };
}
