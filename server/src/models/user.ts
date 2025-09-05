import mongoose, { InferSchemaType } from 'mongoose';

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
},
    {
        timestamps: true  // ⏰ Mongoose adds createdAt & updatedAt automatically
    });

const Users = mongoose.model('users', usersSchema);

type User = InferSchemaType<typeof usersSchema> & { _id: mongoose.Types.ObjectId };

export default Users;

export type { User };