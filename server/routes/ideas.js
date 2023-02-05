import express from 'express';

import { getIdeas, getIdeasBySearch, getIdeasByCreator, getIdea, createIdea, likeIdea, commentIdea } from '../controllers/ideas.js';

const router = express.Router();
// import auth from "../middleware/auth.js";

router.get('/author', getIdeasByCreator);
router.get('/search', getIdeasBySearch);
router.get('/', getIdeas);
router.get('/:id', getIdea);

router.post('/', createIdea);
router.patch('/:id/likeIdea', likeIdea);
router.post('/:id/commentIdea', commentIdea);

export default router;