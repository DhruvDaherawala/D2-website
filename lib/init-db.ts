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
  
  try {
    await initializeDatabase('navigation', navLinks);
    await initializeDatabase('hero', [heroContent]);
    await initializeDatabase('services', services);
    await initializeDatabase('about', [aboutContent]);
    await initializeDatabase('projects', projects);
    await initializeDatabase('contact', [contactContent]);
    await initializeDatabase('footer', [footerContent]);
    await initializeDatabase('site-config', [siteConfig]);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Continue with the application even if there's an error
  }
}

export async function initializeProjectsDatabase() {
  console.log('Initializing projects database...');
  try {
    await initializeDatabase('projects', projects);
    console.log('Projects database initialized successfully!');
  } catch (error) {
    console.error('Error initializing projects database:', error);
    // Continue with the application even if there's an error
  }
}

export async function initializeContactsDatabase() {
  console.log('Initializing contacts database...');
  try {
    // Initialize with an empty array since contacts are user-submitted
    await initializeDatabase('contacts', []);
    console.log('Contacts database initialized successfully!');
  } catch (error) {
    console.error('Error initializing contacts database:', error);
    // Continue with the application even if there's an error
  }
}

// Optional: Run directly if this file is executed
if (require.main === module) {
  initDb()
    .then(() => console.log('Done!'))
    .catch(error => console.error('Error initializing database:', error));
} 