import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';

import IdeaMessage from '../models/ideas.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    const { page } = req.query;
    const data = req.body;
    // console.log("req", req);
    
    try {
        // const LIMIT = 8;
        // const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        // console.log("data[0]", data);
        const ideas = await Promise.all(data.map(async url => {
            const nftDataResp = await axios.get(url);
            const nftData = { title: nftDataResp.data.title, description: nftDataResp.data.description }
            const hash = url.split("/").pop();;
            const mdbData = await IdeaMessage.findOne({ ipfsHash: hash })
            const idea = { ...mdbData._doc, ...nftData};
            return idea;
        }));
        
        console.log(ideas);

        const total = ideas.length;
        // const posts = await IdeaMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: ideas, });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await IdeaMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const posts = await IdeaMessage.find({ name });

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await IdeaMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newIdeaMessage = new IdeaMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newIdeaMessage.save();

        res.status(201).json(newIdeaMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await IdeaMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await IdeaMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await IdeaMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await IdeaMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await IdeaMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await IdeaMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export default router;