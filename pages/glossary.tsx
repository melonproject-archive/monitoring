import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Card, CardContent } from '@material-ui/core';
import Layout from '~/components/Layout';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

const fundTerms = [
  {
    term: 'AUM',
    description: `Assets Under Management. 
    Assets under management. 
    This refers to the total assets being managed in a fund, expressed in the denomination currency.`,
  },
  {
    term: 'GAV',
    description: `Gross asset value of the fund's positions (i.e. management and performance 
      fee have not been deducted)`,
  },
  {
    term: 'NAV',
    description: 'NAV: Net asset value (i.e. after deducting management and performance fee)',
  },
  {
    term: 'Share Price',
    description: 'NAV divided by the number of outstanding shares of the fund.',
  },
  {
    term: 'Rank',
    description: 'Rank of a fund in comparison with its peers based on their share price.',
  },
  {
    term: 'Protocol version',
    description: 'Version of the Melon protocol under which a fund was created',
  },
];

const engineTerms = [
  {
    term: 'amgu',
    description: `Asset management gas units. 
      Amgus are collected in ETH on certain actions performed on the protocol, 
      and sent to the Melon engine as frozen ETH.`,
  },
  {
    term: 'Engine Premium',
    description: 'Premium at which the Melon engine buys MLN. ',
  },
  {
    term: 'ETH consumed',
    description: 'Total ETH collected by the Melon engine (since the initial deployment)',
  },
  {
    term: 'Frozen ETH',
    description: 'ETH collected by the Melon engine are frozen during one month (30 days)',
  },
  {
    term: 'Liquid ETH',
    description: `Thawed ETH held by the Melon engine. 
      Liquid ETH can be bought at a discount in exchange for MLN by Melon funds.`,
  },
  {
    term: 'MLN burnt',
    description: 'MLN burnt by the Melon engine (after acquiring MLN by selling liquid ETH).',
  },
];

const TermList = props => {
  const t = props.terms;

  const listItems = t
    // .sort((a, b) => a.term.localeCompare(b.term))
    .map(item => (
      <div key={item.term}>
        <br />
        <Typography variant="body1">
          <strong>{item.term}</strong>
        </Typography>
        <Typography variant="body2">{item.description}</Typography>
      </div>
    ));
  return <div>{listItems}</div>;
};

type GlossaryProps = WithStyles<typeof styles>;

const Glossary: React.FunctionComponent<GlossaryProps> = props => {
  return (
    <Layout title="Glossary" page="glossary">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Funds
            </Typography>
            <Typography variant="body2">
              To learn more about Melon funds accounting practices, see:{' '}
              <a
                href="https://www.docs.melonport.com/chapters/fund.html#accounting"
                target="_blank"
                rel="noopener noreferrer"
                className={props.classes.aStyle}
              >
                https://www.docs.melonport.com/chapters/fund.html#accounting
              </a>
            </Typography>
            <TermList terms={fundTerms} />
            <br />
            <br />
            <Typography variant="h5" component="h2">
              Engine
            </Typography>
            <Typography variant="body2">
              For more details on the below, see:{' '}
              <a
                href="https://www.docs.melonport.com/chapters/melon_engine.html#watermelon-engine-mechanics"
                target="_blank"
                rel="noopener noreferrer"
                className={props.classes.aStyle}
              >
                https://www.docs.melonport.com/chapters/melon_engine.html#watermelon-engine-mechanics
              </a>
            </Typography>
            <TermList terms={engineTerms} />
          </CardContent>
        </Card>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Glossary);
