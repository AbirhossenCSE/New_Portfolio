export interface MessageItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: "Unread" | "Read" | "Important";
}

export interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  live: string;
  github: string;
  featured: boolean;
  order: number;
}

export interface SkillItem {
  _id: string;
  name: string;
  description: string;
  level: number;
  category: string;
  order: number;
}

export interface ExperienceItem {
  _id: string;
  role: string;
  company: string;
  duration: string;
  current: boolean;
  description: string;
  order: number;
}

export interface EducationItem {
  _id: string;
  year: string;
  degree: string;
  institution: string;
  description: string;
  order: number;
}

export interface ProfileItem {
  _id?: string;
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
  socials: {
    github: string;
    linkedin: string;
    facebook: string;
  };
  aboutParagraphs: string[];
  aboutTags: string[];
  quickInfo: {
    label: string;
    value: string;
  }[];
}
