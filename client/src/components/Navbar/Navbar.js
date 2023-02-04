import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import * as actionType from '../../constants/actionTypes';
import { signin, checkSignUpSignin, getCurrentWalletConnected } from '../../actions/auth';
import useStyles from './styles';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [walletAddress, setWallet] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/auth');

    setUser(null);
  };
  useEffect(() => {
    async function fetchWallet() {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
    }
    fetchWallet()
 
  }, [])
  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  const getAuth = async () => {
    if(!user?.result){
      const userData = await checkSignUpSignin(walletAddress);
      if(!userData.result){
        history.push('/auth');
        console.log(userData);
      } else {
        // console.log(userData);
        // console.log("signin");
        dispatch(signin({ address: walletAddress }, history));
        const token = user?.token;

        if (token) {
          const decodedToken = decode(token);

          if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
      }
    }
  }

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <Typography className={classes.heading}>Ideas Platform</Typography>
      </Link>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user?.result.userName} >{user?.result.userName.charAt(0)}</Avatar>
            <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button variant="contained" color="primary" onClick={getAuth} >Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
