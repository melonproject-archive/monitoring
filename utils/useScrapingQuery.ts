import { useQuery } from '@apollo/react-hooks';
import { useRef, useEffect } from 'react';
import { DocumentNode } from 'graphql';

type QueryPair = [DocumentNode, DocumentNode?];

type ProceedOrNotFn = (result: any, expected: number) => boolean;

export function useScrapingQuery([query, more = query]: QueryPair, proceed: ProceedOrNotFn, props?: any) {
  const limit = (props.variables && props.variables.limit) || 100;
  const skip = useRef((props.variables && props.variables.skip) || 0);
  const result = useQuery(query, {
    ...props,
    variables: {
      ...(props && props.variables),
      limit,
      skip,
    },
  });

  useEffect(() => {
    if (!!result.loading || !proceed(result.data, skip.current + limit)) {
      return;
    }

    result.fetchMore({
      query: more,
      variables: {
        ...result.variables,
        skip: skip.current + limit,
      },
      updateQuery: (previous, options) => {
        skip.current = skip.current + limit;

        const moreResult = options.fetchMoreResult;
        const output = Object.keys(moreResult).reduce(
          (carry, current) => ({
            ...carry,
            [current]: carry[current].concat(moreResult[current] || []),
          }),
          previous,
        );

        return output;
      },
    });
  }, [result, skip.current]);

  return result;
}
