import gql from 'graphql-tag';

export default gql`
  query AssetDetailsQuery($asset: ID!) {
    asset(id: $asset) {
      id
      symbol
      name
      decimals
      priceHistory(orderBy: timestamp) {
        price
        timestamp
      }
      melonNetworkAssetHistory(orderBy: timestamp, orderDirection: asc) {
        timestamp
        assetGav
        amount
      }
      fundAccountings {
        fund {
          id
          name
          holdingsHistory(orderBy: timestamp, orderDirection: desc, first: 11) {
            amount
            assetGav
            timestamp
            asset {
              id
              symbol
              decimals
            }
          }
        }
      }
    }
  }
`;
