import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import Messages from './components/Messages';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ListItem, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Welcome from './components/Welcome';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

import List from '@mui/material/List';


const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


  useEffect(() => {
    contract.get_msgs({from_index:0,limit:1000}).then(msg => 
      setMessages(msg));
  }, []);

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Guest Book'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  const onSubmit = (e) => {
    console.log("fuck")
    e.preventDefault();
    const { fieldset, message, donation } = e.target.elements;

    contract.check_exist({account_id:currentUser.accountId}).then(ret => {
      console.log("check_exist:  " + ret);
      if(ret != true){
        contract.add_msg(
          { msg_content: message.value },
          BOATLOAD_OF_GAS,
          Big(donation.value || '0').times(10 ** 24).toFixed()
        ).then(() => {
          contract.get_msgs({from_index:0,limit:1000}).then((ret) => {
            setMessages(ret);
          });
        });
      }else{
        setOpen(true);
      }
      message.value = '';
      donation.value = SUGGESTED_DONATION;
      fieldset.disabled = false;
      message.focus();
    });
  };
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Challenge#4: NEAR Guest Book
          </Typography>
          { currentUser
            ? <Button color="inherit" onClick={signOut}>Logout</Button>
            : <Button color="inherit" onClick={signIn}>Login</Button>
          }
        </Toolbar>
      </AppBar>
      <div>
        <Stack direction="column" spacing={2}>

        <Collapse in={open}>
        <Alert variant="outlined" severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          You can only sign the guest book once
        </Alert>
      </Collapse>

          <Item>
            {currentUser
            ? <Form onSubmit={onSubmit} currentUser={currentUser} />
            : <Welcome />
            }
          </Item>
            
            { currentUser && <Item><List><Messages color="inherit" messages={messages}/> </List></Item>}

        </Stack>
        </div>
      
    </Box>
  )
};

App.propTypes = {
  contract: PropTypes.shape({
    add_msg: PropTypes.func.isRequired,
    check_exist: PropTypes.func.isRequired,
    get_msgs: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
