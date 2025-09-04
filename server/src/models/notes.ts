import mongoose, { InferSchemaType } from 'mongoose';

const notesSchema = new mongoose.Schema({
    title: String,
    content: String,
    userId: String,
}, {
    timestamps: true  // ⏰ Mongoose adds createdAt & updatedAt automatically
});

const Notes = mongoose.model('notes', notesSchema);

export default Notes;
type notes = InferSchemaType<typeof notesSchema>;
export type { notes };
