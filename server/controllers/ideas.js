import express from 'express';
import mongoose from 'mongoose';

import postIdeas from '../models/ideas.js';
// import { uploadJSONToIPFS } from '../pinata-utils/pinata.js';
import Platform from '../Platform.json' assert { type: "json" };

const router = express.Router();

export const getIdeas = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await postIdeas.countDocuments({});
        const ideas = await postIdeas.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: ideas, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getIdeasBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const ideas = await postIdeas.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: ideas });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getIdeasByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const ideas = await postIdeas.find({ name });

        res.json({ data: ideas });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getIdea = async (req, res) => { 
    const { id } = req.params;

    try {
        const idea = await postIdeas.findById(id);
        
        res.status(200).json(idea);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createIdea = async (req, res) => {
    const { address, title, message, tags, ipfsHash } = req.body;

    const newPostMessage = new postIdeas({ ipfsHash, address: address, tags, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const likeIdea = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const idea = await postIdeas.findById(id);

    const index = idea.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      idea.likes.push(req.userId);
    } else {
      idea.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedIdea = await postIdeas.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedIdea);
}

export const commentIdea = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const idea = await postIdeas.findById(id);

    idea.comments.push(value);

    const updatedIdea = await postIdeas.findByIdAndUpdate(id, idea, { new: true });

    res.json(updatedIdea);
};

export default router;