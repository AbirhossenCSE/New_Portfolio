import { Schema, model, Document } from "mongoose";

export interface IEducation extends Document {
  year: string;
  degree: string;
  institution: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<IEducation>(
  {
    year: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete (ret as any).__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete (ret as any).__v;
        return ret;
      },
    },
  },
);

export const Education = model<IEducation>("Education", educationSchema);
