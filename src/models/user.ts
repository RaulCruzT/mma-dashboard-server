import { Schema, InferSchemaType, model } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    role: { type: String, required: true, default: 'user', enum: ['user', 'manager', 'admin']},
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);