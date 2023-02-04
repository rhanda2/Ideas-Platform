import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

export const checkSignUpSignin = async (walletAddress) => {
  try{
    // const walletObj = await connectWallet();
    let userData;
    try{
      userData = api.signIn(walletAddress);
    } catch(err){
      userData = {}
    }
    
    // userData = {
    //   result: {
    //     "fun":"ny"
    //   }
    // }
    console.log(userData["result"]);
    if(!userData["result"]){
      return {
        signUp : true,
        user: userData.result,
        token: userData.token
      }; 
    } else {
      return {
        signUp : false
      };
    }
  } catch(err){
    console.log(err);
  }
  
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        // status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
        success: true,
      };
      return obj
    } catch (err) {
      console.log(err);
      return {
        status: err.message,
        success: false 
      };
    }
  } else {
    return {
      address: "",
      status:
              //  <a target="_blank" href={`https://metamask.io/download.html`}>
              "You must install MetaMask, a virtual Ethereum wallet, in your browser. Go to https://metamask.io/download.html",
              // </a> 
      success: false,
    };
  }
}

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      })
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        }
      } else {
        return {
          address: "",
          status: "🦊 Connect to MetaMask using the top right button.",
        }
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      }
    }
  } else {
    return {
      address: "",
      status: "You must install MetaMask, a virtual Ethereum wallet, in your browser. https://metamask.io/download.html",
    }
  }
}