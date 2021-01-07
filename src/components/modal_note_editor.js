import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { keystore_transfer } from './keystore_utils';
import { Button, TextField, Input, Container } from '@material-ui/core';
import { Label } from '@material-ui/icons';

import Store from 'electron-store';

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
  }
}));

function ModalNoteEditor (props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');

  const store = new Store();

  useEffect(() => {
    setOpen(props.open);
    if (store.has(`notes.${props.address}`)) {
      setNote(store.get(`notes.${props.address}`));
    }
  }, [props.open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.handleModalClose();
  };

  const handleNoteChange = event => {
    setNote(event.target.value);
  };
  
  const handleSubmit = async event => {
    event.preventDefault();
    console.log(props.address);
    console.log(note);
    store.set(`notes.${props.address}`, note);
    handleClose();
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <br />
      <div>
        <h5>Address: {props.address}</h5>
      </div>
      <div>
        <TextField
          className={classes.inputControl}
          name='note'
          id='standard-text-input'
          label='Note'
          type='text'
          value={note}
          onChange={handleNoteChange}
        />
      </div>
      <br />
      <Button
        variant='contained'
        onClick={handleSubmit}
        color='primary'
        type='submit'
      >
        OK
      </Button>
      <Button variant='contained' color='secondary' onClick={handleClose}>
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

export default ModalNoteEditor;
