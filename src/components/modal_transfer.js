import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { keystore_transfer } from './keystore_utils';
import { Button, TextField, Input, Container } from '@material-ui/core';
import { Label } from '@material-ui/icons';

function getModalStyle () {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  inputControl: {
    margin: theme.spacing(1),
    width: '42ch'
  },
  button: {
    margin: theme.spacing(1)
  }
}));

function ModalTransfer (props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [valueInNEW, setValueInNEW] = useState(0);
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.handleModalClose();
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleToAddressChange = event => {
    setToAddress(event.target.value);
  };

  const handleValueInNEWChange = event => {
    setValueInNEW(event.target.value);
  };
  const handleSubmit = async event => {
    event.preventDefault();
    console.log(props.file);
    const result = await keystore_transfer(
      props.file,
      toAddress,
      valueInNEW,
      password
    );
    alert(result);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <br />
      <div>
        <h5>From: {props.fromAddress}</h5>
      </div>
      <div>
        <TextField
          className={classes.inputControl}
          name='toAddress'
          id='standard-text-input'
          label='To Address'
          type='text'
          onChange={handleToAddressChange}
        />
      </div>
      <div>
        <TextField
          className={classes.inputControl}
          name='valueInNEW'
          id='standard-text-input'
          label='Value In NEW'
          type='text'
          value={valueInNEW}
          onChange={handleValueInNEWChange}
        />
      </div>
      <div>
        <TextField
          className={classes.inputControl}
          name='password'
          id='standard-password-input'
          label='Password'
          type='password'
          autoComplete='current-password'
          onChange={handlePasswordChange}
        />
      </div>
      <br />
      <Button
        className={classes.button}
        variant='contained'
        onClick={handleSubmit}
        color='primary'
        type='submit'
      >
        OK
      </Button>
      <Button
        className={classes.button}
        variant='contained'
        color='secondary'
        onClick={handleClose}
      >
        Close
      </Button>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
    </div>
  );
}

export default ModalTransfer;
