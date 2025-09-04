import { Router } from 'express';
import { createNote, deleteNote, editNote, getNoteById, getNotes } from '../controllers/notesController.js';
const router = Router();

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', editNote);
router.delete('/:id', deleteNote);

export default router;
