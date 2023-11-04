import { Schema, InferSchemaType, model } from 'mongoose';

const cultureMediumSchema = new Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User", select: false },
}, { timestamps: true });

type CultureMedium = InferSchemaType<typeof cultureMediumSchema>;

export default model<CultureMedium>("CultureMedium", cultureMediumSchema);