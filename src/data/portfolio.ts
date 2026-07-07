import abirHome from "@/assets/abir-home.png";
import abirAbout from "@/assets/abir-about.jpg";

export const profile = {
  name: "Abir Hossen",
  fullName: "Md. Abir Hossen",
  roles: ["Frontend Developer", "Full-Stack Developer", "React Developer", "MERN Stack Developer"],
  intro:
    "Passionate web developer with a degree in Computer Science & Engineering and hands-on experience in developing dynamic web applications.",
  availability: "Available for Full-time & Freelance",
  resumeUrl:
    "https://drive.google.com/uc?export=download&id=1MW35NxWfy-aElkr7o0uS_iPXPgkL3cSZ",
  homeImage: abirHome,
  aboutImage: abirAbout,
  email: "abirhossenkst@gmail.com",
  phone: "01817854737",
  phoneIntl: "+8801817854737",
  whatsapp: "https://wa.me/8801817854737",
  location: "Dhaka, Bangladesh",
  socials: {
    github: "https://github.com/AbirhossenCSE/",
    linkedin: "https://www.linkedin.com/in/abir-hossen-cse/",
    facebook: "https://www.facebook.com/abir.mondol.503",
  },
};

export const aboutParagraphs = [
  "Hi, I'm Abir Hossen, a passionate Full-Stack Developer and Computer Science student at Daffodil International University. I specialize in building modern, scalable, and user-friendly web applications with clean design and performance-driven architecture.",
  "My expertise includes React.js, Node.js, Express.js, and MongoDB, alongside modern tools like Tailwind CSS, Firebase, and Vercel. With real-world experience at Mindsynth Technology and ScaleUp Agency, I have collaborated on projects that combine technical precision with creative problem-solving.",
  "I aspire to grow as a remote Full-Stack Developer, contributing to impactful digital products that create real-world value.",
];

export const aboutTags = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Tailwind CSS",
  "Firebase",
  "Vercel",
  "Git & GitHub",
  "Database Design",
];

export const quickInfo = [
  { label: "Location", value: "Dhaka, Bangladesh" },
  { label: "Education", value: "CSE at Daffodil International University" },
  { label: "Experience", value: "2+ Companies" },
  { label: "Focus", value: "Full-Stack (MERN)" },
];

export const experience = [
  {
    role: "Frontend Developer",
    company: "ScaleUp Agency",
    duration: "May 2025 – Present",
    current: true,
    description:
      "Responsible for building responsive, high-performance frontend interfaces using React.js and Tailwind CSS. Integrated RESTful APIs developed by backend teams, optimized application performance, and implemented interactive UI components. Worked in a fast-paced agency environment, collaborating with designers, developers, and clients to deliver multiple projects on time while maintaining code quality and modern best practices.",
  },
  {
    role: "Trainee Software Engineer",
    company: "Mindsynth Technology",
    duration: "Jan 2025 – Apr 2025",
    current: false,
    description:
      "Developed a full-fledged web application from scratch, handling both frontend and backend. Built dynamic, responsive UIs using React.js and integrated RESTful APIs with Node.js and Express.js. Designed and optimized MongoDB database schemas, implemented authentication, and ensured application performance and security. Collaborated closely with designers and other developers in an agile environment to deliver high-quality, scalable solutions.",
  },
];

export type SkillCategory = {
  category: string;
  skills: { name: string; description: string; level: number }[];
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      {
        name: "React.js",
        description:
          "I build modern, responsive, and dynamic UIs with React.js. Reusable components & optimized performance for smooth UX.",
        level: 92,
      },
      {
        name: "Next.js",
        description:
          "React framework for production grade applications with server-side rendering and static generation.",
        level: 85,
      },
      {
        name: "TypeScript",
        description:
          "Strongly typed superset of JavaScript that scales codebase safety, refactoring, and readability.",
        level: 88,
      },
      {
        name: "JavaScript",
        description:
          "Core programming language for adding interactivity, logic handling, and building scalable full-stack apps.",
        level: 90,
      },
      {
        name: "HTML5",
        description:
          "Clean, semantic, accessible markup ensuring SEO-friendly, well-structured web pages.",
        level: 95,
      },
      {
        name: "CSS3",
        description:
          "Modern layouts, responsive design, and engaging animations for better UX.",
        level: 90,
      },
      {
        name: "Tailwind CSS",
        description:
          "Fast, utility-first styling for responsive UIs with clean and scalable code.",
        level: 93,
      },
    ],
  },
  {
    category: "Backend",
    skills: [
      {
        name: "Node.js",
        description:
          "Efficient backend services & REST APIs to handle server-side tasks and business logic.",
        level: 85,
      },
      {
        name: "Express.js",
        description:
          "Lightweight APIs with maintainable routes connecting frontend & databases.",
        level: 85,
      },
    ],
  },
  {
    category: "Database & ORM",
    skills: [
      {
        name: "MongoDB",
        description: "NoSQL database for storing & managing data with efficient queries.",
        level: 84,
      },
      {
        name: "PostgreSQL",
        description:
          "Powerful, open-source object-relational database system focused on SQL compliance and extensibility.",
        level: 82,
      },
      {
        name: "Prisma ORM",
        description:
          "Next-generation Node.js and TypeScript ORM for clean schema modeling and type-safe database queries.",
        level: 85,
      },
      {
        name: "Database Management",
        description:
          "Experience with relational & NoSQL databases, schema design, and performance tuning.",
        level: 82,
      },
    ],
  },
  {
    category: "Tools",
    skills: [
      {
        name: "Git & GitHub",
        description:
          "Version control, branching, and collaborative workflows for smooth teamwork.",
        level: 88,
      },
      {
        name: "VS Code",
        description: "My go-to editor with custom extensions & snippets for productivity.",
        level: 92,
      },
      {
        name: "Postman",
        description:
          "API platform for building, testing, documenting, and collaborating on RESTful services.",
        level: 88,
      },
      {
        name: "Figma",
        description:
          "Collaborative interface design tool used to inspect wireframes, export assets, and align UI designs.",
        level: 80,
      },
      {
        name: "Stripe API",
        description:
          "Online payment processing suite for integrating secure subscription billing and checkout systems.",
        level: 82,
      },
      {
        name: "Chart.js",
        description:
          "Simple yet flexible JavaScript charting library for rendering interactive data visualizations.",
        level: 84,
      },
    ],
  },
  {
    category: "Deployment",
    skills: [
      {
        name: "Firebase",
        description:
          "Authentication, hosting, and real-time database solutions for small-to-medium projects.",
        level: 84,
      },
      {
        name: "Vercel",
        description:
          "CI/CD powered deployment for fast, serverless hosting of web projects.",
        level: 86,
      },
    ],
  },
];

export const education = [
  {
    year: "2024",
    degree: "BSc. in Computer Science & Engineering",
    institution: "Daffodil International University",
    description:
      "Focused on full-stack development, algorithms, and database design. Worked on several MERN stack projects.",
  },
  {
    year: "2019",
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Kushtia Govt. Central College",
    description:
      "Studied Science group with major subjects in Physics, Chemistry, and Mathematics.",
  },
  {
    year: "2017",
    degree: "Secondary School Certificate (SSC)",
    institution: "Nobogram High School",
    description:
      "Completed secondary education with distinction, active in extracurricular activities.",
  },
];

export type Project = {
  title: string;
  description: string;
  image: string;
  tech: string[];
  live: string;
  github: string;
};

export const projects: Project[] = [
  {
    title: "Employee Management System",
    description:
      "A management system for monitoring employee workload, salaries, and workflow updates.",
    image: "https://i.ibb.co.com/xSk73sgN/EMPJPG.jpg",
    tech: ["React.js", "Node.js", "MongoDB", "Firebase", "Stripe"],
    live: "https://employee-management-38c38.web.app/",
    github: "https://github.com/AbirhossenCSE/",
  },
  {
    title: "Task Management System",
    description:
      "A simple and efficient Task Management Application built with React, Vite, Firebase authentication, and drag-and-drop functionality for seamless task organization.",
    image: "https://i.ibb.co.com/tTLBMbDd/Task-Management-System.jpg",
    tech: ["React.js", "Firebase", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    live: "https://simple-firebase-df58a.web.app/",
    github: "https://github.com/AbirhossenCSE/",
  },
  {
    title: "Food Planet",
    description:
      "An e-commerce platform selling tech gadgets with authentication, product management, and payment integration.",
    image: "https://i.ibb.co.com/WNCrjp9z/Rmp.jpg",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    live: "https://restaurant-management-b98e1.web.app/",
    github: "https://github.com/AbirhossenCSE/",
  },
  {
    title: "Sports Equipment Store",
    description:
      "A web app providing career guidance and resources based on user preferences and interests.",
    image: "https://i.ibb.co.com/yBsNb4pc/SES.jpg",
    tech: ["React.js", "Firebase", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    live: "https://auth-moha-milon-88362.web.app/",
    github: "https://github.com/AbirhossenCSE/",
  },
  {
    title: "Link Sharing Application",
    description:
      "ShareLink lets users upload files (images, PDFs) and text, generate shareable links, and manage access settings. Supports public/private links with authentication.",
    image: "https://i.ibb.co.com/dw8ddv1J/Share-Link.jpg",
    tech: ["React.js", "Firebase", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    live: "https://sharelink-8fda4.web.app/",
    github: "https://github.com/AbirhossenCSE/",
  },
  {
    title: "Gadget Heaven",
    description:
      "A modern e-commerce website selling electronic gadgets with smooth UI, Firebase authentication, and cart management.",
    image: "https://i.ibb.co.com/nqVMqqPY/gadget-Heaven.jpg",
    tech: ["React.js", "Firebase", "Tailwind CSS", "React Helmet Async"],
    live: "https://abir-smart-shop.surge.sh/",
    github: "https://github.com/AbirhossenCSE/",
  },
];

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
