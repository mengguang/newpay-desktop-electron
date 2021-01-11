import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { Box, Button, ButtonGroup } from '@material-ui/core';

function CommonButton (props) {
  let history = useHistory();
  return (
    <Box display='flex' flexDirection='row'>
      <Box m={1}>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => history.push('/keystore_generator')}
        >
          keystore generator
        </Button>
      </Box>
      <Box m={1}>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => history.push('/keystore_list')}
        >
          keystore list
        </Button>
      </Box>
      <Box m={1}>
        <Button
          variant='contained'
          color='secondary'
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
