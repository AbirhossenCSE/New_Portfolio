import { Schema, model, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  description: string;
  icon?: string;
  badge?: string;
  level?: number;
  category: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "Code",
      trim: true,
    },
    badge: {
      type: String,
      default: "Advanced",
      trim: true,
    },
    level: {
      type: Number,
      default: 90,
      min: 0,
      max: 100,
    },
    category: {
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

export const Skill = model<ISkill>("Skill", skillSchema);
