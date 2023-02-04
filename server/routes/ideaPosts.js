import express from 'express';

import { getIdeas, getIdeasBySearch, getIdeasByAuthor, getIdea, createIdea, likeIdea, commentIdea } from '../controllers/ideas.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/author', getIdeasByAuthor);
router.get('/search', getIdeasBySearch);
router.get('/', getIdeas);
router.get('/:id', getIdea);

router.post('/', auth,  createIdea);
router.patch('/:id/likeIdea', auth, likeIdea);
router.post('/:id/commentIdea', commentIdea);

export default router;