import { initializeDatabase } from './db';
import {
  navLinks,
  heroContent,
  services,
  aboutContent,
  projects,
  contactContent,
  footerContent,
  siteConfig,
} from './seed-data';

export async function initDb() {
  console.log('Initializing database...');
  
  await initializeDatabase('navigation', navLinks);
  await initializeDatabase('hero', [heroContent]);
  await initializeDatabase('services', services);
  await initializeDatabase('about', [aboutContent]);
  await initializeDatabase('projects', projects);
  await initializeDatabase('contact', [contactContent]);
  await initializeDatabase('footer', [footerContent]);
  await initializeDatabase('site-config', [siteConfig]);
  
  console.log('Database initialized successfully!');
}

export async function initializeProjectsDatabase() {
  console.log('Initializing projects database...');
  await initializeDatabase('projects', projects);
  console.log('Projects database initialized successfully!');
}

// Optional: Run directly if this file is executed
if (require.main === module) {
  initDb()
    .then(() => console.log('Done!'))
    .catch(error => console.error('Error initializing database:', error));
} 