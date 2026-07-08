import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import ts from 'typescript';
import vm from 'vm';
import dns from 'dns';
import { Project } from '../models/Project';
import { Skill } from '../models/Skill';
import { Experience } from '../models/Experience';

// Force Node.js to use Google's public DNS servers for resolving MongoDB's SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables from server/.env
dotenv.config();

const portfolioPath = path.join(__dirname, '../../../src/data/portfolio.ts');

const loadStaticData = () => {
  if (!fs.existsSync(portfolioPath)) {
    throw new Error(`Static portfolio data file not found at: ${portfolioPath}`);
  }

  const tsCode = fs.readFileSync(portfolioPath, 'utf8');

  // Replace asset image imports which node.js vm context can't load,
  // mapping them to mock empty strings instead.
  const cleanedCode = tsCode
    .replace(/import\s+abirHome\s+from\s+['"]@\/assets\/abir-home\.png['"];?/g, 'const abirHome = "";')
    .replace(/import\s+abirAbout\s+from\s+['"]@\/assets\/abir-about\.jpg['"];?/g, 'const abirAbout = "";');

  // Transpile TypeScript to JavaScript utilizing ts compiler
  const result = ts.transpileModule(cleanedCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });

  // Evaluate in vm sandbox context to avoid importing it in module graph
  const sandbox = {
    exports: {} as any,
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(result.outputText, sandbox);

  return {
    projects: sandbox.exports.projects || [],
    skillCategories: sandbox.exports.skillCategories || [],
    experience: sandbox.exports.experience || [],
  };
};

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(uri, { dbName: 'PortfolioDB' });
    console.log('Database connected successfully.');

    // Load static data from frontend
    console.log('Reading static portfolio data...');
    const { projects, skillCategories, experience } = loadStaticData();

    let projectsInserted = 0;
    let skillsInserted = 0;
    let experiencesInserted = 0;

    // 1. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount > 0) {
      console.warn('Projects collection already populated. Skipping project seeding.');
    } else if (projects.length === 0) {
      console.log('No static projects data found.');
    } else {
      console.log(`Seeding ${projects.length} projects...`);
      const projectsToInsert = projects.map((p: any, index: number) => ({
        title: p.title,
        description: p.description,
        image: p.image,
        tech: p.tech,
        live: p.live,
        github: p.github,
        featured: p.featured ?? false,
        order: p.order ?? index,
      }));
      await Project.insertMany(projectsToInsert);
      projectsInserted = projectsToInsert.length;
      console.log('Projects seeded successfully.');
    }

    // 2. Seed Skills (Flattening skillCategories)
    const skillCount = await Skill.countDocuments();
    if (skillCount > 0) {
      console.warn('Skills collection already populated. Skipping skill seeding.');
    } else if (skillCategories.length === 0) {
      console.log('No static skill categories data found.');
    } else {
      const skillsToInsert: any[] = [];
      let categoryOrder = 0;
      for (const cat of skillCategories) {
        let skillOrder = 0;
        for (const sk of cat.skills) {
          skillsToInsert.push({
            name: sk.name,
            description: sk.description,
            level: sk.level,
            category: cat.category,
            order: skillOrder++,
          });
        }
        categoryOrder++;
      }
      console.log(`Seeding ${skillsToInsert.length} flattened skills...`);
      await Skill.insertMany(skillsToInsert);
      skillsInserted = skillsToInsert.length;
      console.log('Skills seeded successfully.');
    }

    // 3. Seed Experience
    const experienceCount = await Experience.countDocuments();
    if (experienceCount > 0) {
      console.warn('Experience collection already populated. Skipping experience seeding.');
    } else if (experience.length === 0) {
      console.log('No static experience data found.');
    } else {
      console.log(`Seeding ${experience.length} experience entries...`);
      const experiencesToInsert = experience.map((exp: any, index: number) => ({
        role: exp.role,
        company: exp.company,
        duration: exp.duration,
        current: exp.current ?? false,
        description: exp.description,
        order: exp.order ?? index,
      }));
      await Experience.insertMany(experiencesToInsert);
      experiencesInserted = experiencesToInsert.length;
      console.log('Experience seeded successfully.');
    }

    console.log('\n--- Seeding Summary ---');
    console.log(`Projects inserted: ${projectsInserted}`);
    console.log(`Skills inserted:   ${skillsInserted}`);
    console.log(`Experience items:  ${experiencesInserted}`);
    console.log('-----------------------\n');
  } catch (error) {
    console.error('Seeding process failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seed();
