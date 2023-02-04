import express from 'express';
import mongoose from 'mongoose';

import postIdeas from '../models/postIdeas.js';

const router = express.Router();

export const getIdeas = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; 
    
        const total = await postIdeas.countDocuments({});
        const posts = await postIdeas.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export default router;