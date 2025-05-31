import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'D2-website API',
    version: '1.0.0',
    description: 'API for the D2 website',
    endpoints: {
      '/api/mongodb-test': 'Test MongoDB connection',
      '/api/content/:collection': 'CRUD operations for content collections',
      '/api/content/navigation': 'Navigation menu items',
      '/api/content/hero': 'Hero section content',
      '/api/content/services': 'Services section content',
      '/api/content/about': 'About section content',
      '/api/content/projects': 'Projects section content',
      '/api/content/contact': 'Contact information',
      '/api/content/footer': 'Footer content',
      '/api/content/site-config': 'Site configuration',
    }
  });
} 