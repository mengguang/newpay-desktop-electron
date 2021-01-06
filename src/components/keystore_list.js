import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CommonButton from './common_button';
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  NativeSelect,
  Button
} from '@material-ui/core';

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
import { ipcRenderer, clipboard } from 'electron';
import { promisify } from 'util';

import { ethers } from 'ethers';

import ModalTransfer from './modal_transfer';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  }
}));

function pretty_balance (balance) {
  return ethers.utils.formatEther(balance);
}

const rpc_url = 'https://rpc2.newchain.cloud.diynova.com';
const provider = new ethers.providers.JsonRpcProvider(rpc_url);

async function keystore_list () {
  const keystoreFiles = await ipcRenderer.invoke('keystore:list');
  let results = [];
  await Promise.all(
    keystoreFiles.map(async file => {
      const keystoreJson = await fs.readFile(file);
      const keystoreData = JSON.parse(keystoreJson);
      const address = '0x' + keystoreData.address;
      results.push({file, address, balance: 0, type: 'real', alias: '', note: '' });
    })
  );
  return results;
}

async function keystore_list_results_fill_balance (results) {
  const results_with_balance = await Promise.all(
    results.map(async row => {
      const { address } = row;
      const balance = await provider.getBalance(address);
      const balance_of_new = pretty_balance(balance);
      console.log(`Balance of NEW: ${balance_of_new}`);
      row.balance = balance_of_new;
      return row;
    })
  );
  return results_with_balance;
}

function KeystoreRow (props) {
  const [action, setAction] = useState('transfer');
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  let row = props.row;

  function handleActionChange (e) {
    console.log(e.target.value);
    setAction(e.target.value);
  }

  
  const handleModalClose = () => {
    setOpen(false);
  };

  function handleActionButtonClick (e) {
    console.log(`button clicked, action: ${action}, address: ${row.address}`);
    if (action === 'copy-address') {
      clipboard.writeText(row.address);
    }
    if (action === 'transfer') {
      setOpen(true);
    }
  }

  return (
    <TableRow key={row.address}>
      <TableCell component='th' scope='row'>
        {row.address}
      </TableCell>
      <TableCell align='right'>{row.balance}</TableCell>
      <TableCell align='right'>{row.note}</TableCell>
      <TableCell align='right'>
        <FormControl className={classes.formControl}>
          <NativeSelect
            defaultValue={'transfer'}
            onChange={handleActionChange}
            inputProps={{
              name: 'action',
              id: 'uncontrolled-native'
            }}
          >
            <option value={'transfer'}>Transfer</option>
            <option value={'copy-address'}>Copy Address</option>
            <option value={'edit-note'}>Edit Note</option>
          </NativeSelect>
        </FormControl>
        <Button
          onClick={handleActionButtonClick}
          className={classes.button}
          variant='contained'
          color='primary'
        >
          OK
        </Button>
        <ModalTransfer open={open} file={row.file} fromAddress={row.address} handleModalClose={handleModalClose} />
      </TableCell>
    </TableRow>
  );
}

function KeystoreList (props) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  const updateRows = async () => {
    let data = await keystore_list();
    data = await keystore_list_results_fill_balance(data);
    console.log(data);
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
              <TableCell align='right'>Balance(NEW)</TableCell>
              <TableCell align='right'>Note</TableCell>
              <TableCell align='right'>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <KeystoreRow row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

KeystoreList.propTypes = {};

export default KeystoreList;
