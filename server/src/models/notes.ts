import mongoose, { InferSchemaType } from 'mongoose';

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
}, {
    timestamps: true  // ⏰ Mongoose adds createdAt & updatedAt automatically
});

const Notes = mongoose.model('notes', notesSchema);

export default Notes;
type Note = InferSchemaType<typeof notesSchema>;
export type { Note };
