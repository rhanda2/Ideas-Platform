import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

import { uploadJSONToIPFS } from '../../pinata-utils/pinata.js';
import Platform from '../../Platform.json';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();
  const ethers = require('ethers')

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [] });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      const ipfsHash = await listNFT(postData)
      dispatch(createPost({ ...postData, address: user?.result?.address, ipfsHash }, history));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, address: user?.result?.address }));
      clear();
    }
  };

  if (!user?.result?.userName) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    );
  }

  async function listNFT(postData) {
    // e.preventDefault();

    //Upload data to IPFS
    try{
          const nftMeta = {
            title: postData.title,
            description: postData.message
          }

          const ipfsResponse = await uploadJSONToIPFS(nftMeta);
          console.log(ipfsResponse)
          console.log(Platform);
          //After adding your Hardhat network to your metamask, this code will get providers and signers
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          console.log(window.ethereum);
          const signer = provider.getSigner();
          // updateMessage("Please wait.. uploading (upto 5 mins)")

          //Pull the deployed contract instance
          let contract = new ethers.Contract(Platform.address, Platform.abi, signer)
          
          //massage the params to be sent to the create NFT request
          // let listingPrice = await contract.getListPrice()
          // listingPrice = listingPrice.toString()

          //actually create the NFT
          // console.log(ipfsResponse.pinataUrl);
          let transaction = await contract.createToken(ipfsResponse.pinataURL);
          // let transaction = await contract.getLatestIdToListedToken();
          console.log(transaction)
          console.log("transaction chalaaa")
          await transaction.wait();

          alert("Successfully listed your NFT!");
          // updateMessage("");
          // updateFormParams({ name: '', description: '', price: ''});
          clear();
          window.location.replace("/")
          return ipfsResponse.pinataHash;
    }
    catch(e) {
        alert( "Upload error"+e )
        console.log(e)
    }
}

  const handleAddChip = (tag) => {
    setPostData({ ...postData, tags: [...postData.tags, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
        </div>
        {/* <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div> */}
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
