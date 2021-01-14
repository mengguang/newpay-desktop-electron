import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { Box, Button, ButtonGroup } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(1),
    backgroundColor: '#00adb5'
  }
}));

function CommonButton (props) {
  let history = useHistory();
  const classes = useStyles();
  return (
    <Box display='flex' flexDirection='row' position="fixed" top={0} bgcolor="#eeeeee" width="100%">
      <Box m={1}>
        <Button
          variant='contained'
          className={classes.button}
          onClick={() => history.push('/keystore_generator')}
        >
          keystore generator
        </Button>
      </Box>
      <Box m={1}>
        <Button
          variant='contained'
          className={classes.button}
          onClick={() => history.push('/keystore_list')}
        >
          keystore list
        </Button>
      </Box>
      <Box m={1}>
        <Button
          variant='contained'
          className={classes.button}
          onClick={() => history.push('/setting')}
        >
          setting
        </Button>
      </Box>
    </Box>
  );
}

CommonButton.propTypes = {};

export default CommonButton;
