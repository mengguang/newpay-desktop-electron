import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup } from '@material-ui/core';

function CommonButton (props) {
  let history = useHistory();
  return (
    <div>
      <ButtonGroup>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => history.push('/keystore_processor')}
        >
          keystore processor
        </Button>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => history.push('/keystore_generator')}
        >
          keystore generator
        </Button>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => history.push('/keystore_list')}
        >
          keystore list
        </Button>
      </ButtonGroup>
    </div>
  );
}

CommonButton.propTypes = {};

export default CommonButton;
