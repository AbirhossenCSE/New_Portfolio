import { Schema, model, Document } from "mongoose";

interface ISocials {
  github: string;
  linkedin: string;
  facebook: string;
}

interface IQuickInfo {
  label: string;
  value: string;
}

export interface IProfile extends Document {
  name: string;
  fullName: string;
  roles: string[];
  intro: string;
  availability: string;
  resumeUrl: string;
  homeImage: string;
  aboutImage: string;
  email: string;
  phone: string;
  phoneIntl: string;
  whatsapp: string;
  location: string;
  socials: ISocials;
  aboutParagraphs: string[];
  aboutTags: string[];
  quickInfo: IQuickInfo[];
  createdAt: Date;
  updatedAt: Date;
}

const socialsSchema = new Schema<ISocials>(
  {
    github: { type: String, required: true, trim: true },
    linkedin: { type: String, required: true, trim: true },
    facebook: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const quickInfoSchema = new Schema<IQuickInfo>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const profileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [String],
      required: true,
    },
    intro: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: String,
      required: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    homeImage: {
      type: String,
      required: true,
      trim: true,
    },
    aboutImage: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    phoneIntl: {
      type: String,
      required: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    socials: {
      type: socialsSchema,
      required: true,
    },
    aboutParagraphs: {
      type: [String],
      required: true,
    },
    aboutTags: {
      type: [String],
      required: true,
    },
    quickInfo: {
      type: [quickInfoSchema],
      required: true,
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

export const Profile = model<IProfile>("Profile", profileSchema);
