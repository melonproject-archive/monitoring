import React from 'react';
import * as R from 'ramda';
import { withStyles, WithStyles } from '@material-ui/core';
import Layout from '~/components/Layout';

import EventList from '~/components/EventList';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { EventsQuery } from '~/queries/EventsQuery';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type EventProps = WithStyles<typeof styles>;

const Events: React.FunctionComponent<EventProps> = (props) => {
  const eventListResult = useScrapingQuery([EventsQuery, EventsQuery], proceedPaths(['events']), {
    ssr: false,
  });

  const events = R.pathOr([], ['data', 'events'], eventListResult);

  return (
    <Layout title="Events" page="events">
      <EventList events={events} loading={eventListResult.loading} />
    </Layout>
  );
};

export default withStyles(styles)(Events);
