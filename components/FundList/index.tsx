import React from 'react';
import { Fund } from '~/types';
import Link from 'next/link';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import moment from 'moment';

export interface FundListProps {
  funds: Fund[];
}

const FundList: React.FunctionComponent<FundListProps> = props => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="left">Name</TableCell>
          <TableCell align="left">Address</TableCell>
          <TableCell align="right">Creation date</TableCell>
          <TableCell align="right">Active</TableCell>
          <TableCell align="right">Share price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(props.funds || []).map(item => (
          <TableRow key={item.id}>
            <TableCell align="left">{item.name}</TableCell>
            <TableCell align="left">
              <Link href={`/fund?address=${item.id}`}>
                <a>{item.id}</a>
              </Link>
            </TableCell>
            <TableCell align="right">{moment(parseInt(item.creationTime!, 10) * 1000).format('MM/DD/YYYY')}</TableCell>
            <TableCell align="right">{item.isShutdown ? 'No' : 'Yes'}</TableCell>
            <TableCell align="right">{parseFloat(item.grossSharePrice!).toFixed(4)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FundList;
