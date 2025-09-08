import type { Request, Response } from 'express';
import Notes, { Note } from '../models/notes';
import { ApiResponse, AuthRequest } from '../types/api';

// Mock data store (replace with DB integration)
let notes: { id: number; title: string; content: string }[] = [];

// Get all notes
export const getNotes = async (req: AuthRequest,
    res: Response<ApiResponse<Note[] | []>>
): Promise<void> => {
    console.log("req.body.userId:::", req.userId);
    try {
        const notes = await Notes.find({
            userId: req.userId
        });
        if (!notes) {
            res.status(200).json({ success: true, data: [] });
            return;
        }
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
};

// Create a new note
export const createNote = (req: AuthRequest<{}, {}, { title: string, content: string }>, res: Response<ApiResponse<Note>>) => {
    try {
        if (!req.userId) {
            res.status(401).json({ message: 'Unauthorized', success: false });
            return;
        }
        if ( !req.body || !req.body.title || !req.body.content) {
            res.status(400).json({ message: 'Title and content are required', success: false });
            return;
        }
        const newNote = new Notes({
            title: req.body.title,
            content: req.body.content,
            userId: req.userId
        });
        newNote.save();
        res.status(201).json({ success: true, data: newNote });
        return;
    } catch (error) {
        res.status(500).json({ message: error?.toString() || 'Server error', success: false });
    }


};
// Get a single note by ID
export const getNoteById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const note = notes.find(n => n.id === id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
};


// Edit a note
export const editNote = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, content } = req.body;
    const note = notes.find(n => n.id === id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (title) note.title = title;
    if (content) note.content = content;
    res.json(note);
};

// Delete a note
export const deleteNote = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return res.status(404).json({ message: 'Note not found' });
    notes.splice(index, 1);
    res.status(204).send();
};