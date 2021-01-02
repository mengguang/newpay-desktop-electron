import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CommonButton from './common_button';
import { Container } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { promises as fs } from 'fs';
import path from 'path';
import { ipcRenderer } from 'electron';
import { promisify } from 'util';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

async function keystore_list () {
  const keystoreFiles = await ipcRenderer.invoke('keystore:list');
  let results = [];
  await Promise.all(
    keystoreFiles.map(async file => {
      const keystoreJson = await fs.readFile(file);
      const keystoreData = JSON.parse(keystoreJson);
      const address = keystoreData.address;
      results.push({ address, balance: 0, type: 'real', alias: '', note: '' });
    })
  );
  return results;
}

function KeystoreList (props) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  const updateRows = async () => {
    const data = await keystore_list();
    setRows(data);
    console.log(data);
  };

  useEffect(() => {
    updateRows();
  }, []);

  return (
    <Container>
      <CommonButton />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell align='right'>Balance</TableCell>
              <TableCell align='right'>Type</TableCell>
              <TableCell align='right'>AliasName</TableCell>
              <TableCell align='right'>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.address}>
                <TableCell component='th' scope='row'>
                  {row.address}
                </TableCell>
                <TableCell align='right'>{row.balance}</TableCell>
                <TableCell align='right'>{row.type}</TableCell>
                <TableCell align='right'>{row.alias}</TableCell>
                <TableCell align='right'>{row.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

KeystoreList.propTypes = {};

export default KeystoreList;
