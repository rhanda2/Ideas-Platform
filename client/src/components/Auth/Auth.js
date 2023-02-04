import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

// import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Icon from './icon';
import { signin, signup, connectWallet, checkSignUpSignin, getCurrentWalletConnected } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './Input';

const initialState = { email: '', userName: '' , bio: '', interests: ''};

const SignUp = () => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("Click on the button to connect your wallet to our site.");
  const [form, setForm] = useState(initialState);
  // const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    async function fetchWallet() {
      const { address, status } = await getCurrentWalletConnected()
      setWallet(address)
      setStatus(status)
    }
    fetchWallet()
    
    
    
  }, [])

  // const setSignUpPage(){
  //   const userResponse = await checkSignUpSignin(walletAddress);
  //   console.log(userResponse.signUp);
  //   setIsSignup(userResponse.signUp);
  //   console.log(isSignup);
  // }
  // const [showPassword, setShowPassword] = useState(false);
  // const handleShowPassword = () => setShowPassword(!showPassword);

  // const switchMode = () => {
  //   setForm(initialState);
  //   setIsSignup((prevIsSignup) => !prevIsSignup);
  //   // setShowPassword(false);
  // };
  // const switchMode = async () => {
  //   const walletObj = await checkSignUpSignin();
  //   setIsSignup(walletObj.signUp);
  //   form.walletAddress = walletObj.address;
  // }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
    const userResponse = await checkSignUpSignin(walletResponse.address);
    // setIsSignup(userResponse.user.signUp);
    if(!userResponse.signUp){
      dispatch({ type: AUTH, data: { result: userResponse.user, token: userResponse.token } });

      history.push('/');
    }
  }

  const handleSubmit = async (e) => {

    form.address = walletAddress;
    dispatch(signup(form, history));
    history.push('/');
    console.log(form);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="xs">
      {walletAddress.length < 1 ? 
      <Paper>
        <Typography>{status}</Typography>
        <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={connectWalletPressed}>Connect Wallet</Button>
      </Paper>
       :
      <Paper className={classes.paper} elevation={6}>
        {/* <Typography variant='h1'>walletAddress is {walletAddress}</Typography> */}
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{ 'Sign up'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <>
              <Grid container spacing={2}>
                <Input name="userName" label="Username" handleChange={handleChange} autoFocus />
                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                <Input name="bio" label="Bio" handleChange={handleChange} />
                <Input name="interest" label="Interests" handleChange={handleChange} />
              </Grid>
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                Sign Up 
              </Button> 
          </>
        </form>
      </Paper>}
    </Container>
  );
};

export default SignUp;
