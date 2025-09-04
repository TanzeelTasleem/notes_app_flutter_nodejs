import type { Request, Response } from 'express';

// Mock data store (replace with DB integration)
let notes: { id: number; title: string; content: string }[] = [];
let nextId = 1;

// Get all notes
export const getNotes = (req: Request, res: Response) => {
    res.json(notes);
};

// Get a single note by ID
export const getNoteById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const note = notes.find(n => n.id === id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
};

// Create a new note
export const createNote = (req: Request, res: Response) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
    const note = { id: nextId++, title, content };
    notes.push(note);
    res.status(201).json(note);
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