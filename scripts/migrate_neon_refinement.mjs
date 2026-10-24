import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (key === 'DATABASE_URL') databaseUrl = value;
    }
  }
}

const sql = neon(databaseUrl);

async function main() {
  console.log('Running Neon schema extensions...');

  // 1. Extend tables with new columns if not present
  await sql`
    ALTER TABLE public.company_settings 
    ADD COLUMN IF NOT EXISTS website_url TEXT DEFAULT 'https://viyaan-ai-website.onrender.com/',
    ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT '© 2026 Viyaan AI. Beyond Learning. Beyond Limits. All rights reserved.';
  `;

  await sql`
    ALTER TABLE public.homepage_settings 
    ADD COLUMN IF NOT EXISTS about_heading TEXT DEFAULT 'Building Technology With Purpose.',
    ADD COLUMN IF NOT EXISTS about_text TEXT DEFAULT 'Viyaan AI focuses on developing practical AI-powered solutions that make learning more effective, personalised, and accessible.',
    ADD COLUMN IF NOT EXISTS vision_heading TEXT DEFAULT 'Beyond Answers. Towards Understanding.',
    ADD COLUMN IF NOT EXISTS vision_text TEXT DEFAULT 'We believe AI should do more than provide information. It should help people build understanding, think independently, and continue learning.';
  `;

  await sql`
    ALTER TABLE public.products 
    ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
  `;

  console.log('Schema columns verified/added.');

  // 2. Update company_settings
  await sql`
    UPDATE public.company_settings SET
      name = 'Viyaan AI',
      tagline = 'Beyond Learning. Beyond Limits.',
      description = 'Building intelligent learning experiences through AI, data science, and purposeful innovation.',
      website_url = 'https://viyaan-ai-website.onrender.com/',
      linkedin_company = 'https://www.linkedin.com/company/viyaan-ai',
      copyright_text = '© 2026 Viyaan AI. Beyond Learning. Beyond Limits. All rights reserved.',
      updated_at = NOW()
    WHERE id = 'only_one';
  `;

  // 3. Update homepage_settings
  await sql`
    UPDATE public.homepage_settings SET
      hero_heading = 'AI That Helps People Learn Better.',
      hero_subheading = 'Building intelligent learning experiences through AI, data science, and purposeful innovation.',
      hero_cta = 'Explore Projects',
      hero_cta_link = '#projects',
      hero_second_cta = 'Our Vision',
      hero_second_cta_link = '#vision',
      about_heading = 'Building Technology With Purpose.',
      about_text = 'Viyaan AI focuses on developing practical AI-powered solutions that make learning more effective, personalised, and accessible.',
      vision_heading = 'Beyond Answers. Towards Understanding.',
      vision_text = 'We believe AI should do more than provide information. It should help people build understanding, think independently, and continue learning.',
      updated_at = NOW()
    WHERE id = 'main';
  `;

  // 4. Update core products
  await sql`
    UPDATE public.products SET
      name = 'ExamRAG',
      tagline = 'Retrieval-Augmented Study Revision',
      description = 'An AI-powered learning project designed to help users work with educational materials and access relevant information.',
      url = '/products#examrag',
      status = 'published',
      sort_order = 1
    WHERE id = 'examrag';
  `;

  await sql`
    UPDATE public.products SET
      name = 'EXAMORACLE',
      tagline = 'Study Habit & Readiness Diagnostics',
      description = 'A study and exam-preparation project focused on preparation insights and identifying areas that may need improvement.',
      url = '/products#examoracle',
      status = 'published',
      sort_order = 2
    WHERE id = 'examoracle';
  `;

  await sql`
    UPDATE public.products SET
      name = 'Attendance Intelligence',
      tagline = 'Academic Planning & Margin Modeling',
      description = 'A practical tool for understanding attendance calculations and planning attendance more effectively.',
      url = '/products#attendance-intelligence',
      status = 'published',
      sort_order = 3
    WHERE id = 'attendance-intelligence';
  `;

  // 5. Update navigation to compact structure: Home, About, Projects, Contact
  await sql`DELETE FROM public.navigation WHERE id >= 0;`;
  const navItems = [
    { label: 'Home', href: '/', sort_order: 1 },
    { label: 'About', href: '/#about', sort_order: 2 },
    { label: 'Projects', href: '/#projects', sort_order: 3 },
    { label: 'Contact', href: '/contact', sort_order: 4 }
  ];
  for (const n of navItems) {
    await sql`
      INSERT INTO public.navigation (label, href, sort_order)
      VALUES (${n.label}, ${n.href}, ${n.sort_order})
    `;
  }

  console.log('Neon database successfully updated with refined settings and navigation.');

  // 6. Update local db.json
  const dbJsonPath = path.join(process.cwd(), 'src/data/db.json');
  if (fs.existsSync(dbJsonPath)) {
    const raw = fs.readFileSync(dbJsonPath, 'utf8');
    const db = JSON.parse(raw);
    db.companyInfo = {
      ...db.companyInfo,
      name: 'Viyaan AI',
      tagline: 'Beyond Learning. Beyond Limits.',
      description: 'Building intelligent learning experiences through AI, data science, and purposeful innovation.',
      websiteUrl: 'https://viyaan-ai-website.onrender.com/',
      linkedinCompany: 'https://www.linkedin.com/company/viyaan-ai',
      copyrightText: '© 2026 Viyaan AI. Beyond Learning. Beyond Limits. All rights reserved.'
    };
    db.homepage = {
      ...db.homepage,
      heroHeading: 'AI That Helps People Learn Better.',
      heroSubheading: 'Building intelligent learning experiences through AI, data science, and purposeful innovation.',
      heroCta: 'Explore Projects',
      heroCtaLink: '#projects',
      heroSecondCta: 'Our Vision',
      heroSecondCtaLink: '#vision',
      aboutHeading: 'Building Technology With Purpose.',
      aboutText: 'Viyaan AI focuses on developing practical AI-powered solutions that make learning more effective, personalised, and accessible.',
      visionHeading: 'Beyond Answers. Towards Understanding.',
      visionText: 'We believe AI should do more than provide information. It should help people build understanding, think independently, and continue learning.'
    };
    db.navigation = navItems.map(n => ({ label: n.label, href: n.href }));
    
    // Update products
    if (Array.isArray(db.products)) {
      for (const p of db.products) {
        if (p.id === 'examrag') {
          p.name = 'ExamRAG';
          p.tagline = 'Retrieval-Augmented Study Revision';
          p.description = 'An AI-powered learning project designed to help users work with educational materials and access relevant information.';
          p.url = '/products#examrag';
          p.status = 'published';
          p.sortOrder = 1;
        } else if (p.id === 'examoracle') {
          p.name = 'EXAMORACLE';
          p.tagline = 'Study Habit & Readiness Diagnostics';
          p.description = 'A study and exam-preparation project focused on preparation insights and identifying areas that may need improvement.';
          p.url = '/products#examoracle';
          p.status = 'published';
          p.sortOrder = 2;
        } else if (p.id === 'attendance-intelligence') {
          p.name = 'Attendance Intelligence';
          p.tagline = 'Academic Planning & Margin Modeling';
          p.description = 'A practical tool for understanding attendance calculations and planning attendance more effectively.';
          p.url = '/products#attendance-intelligence';
          p.status = 'published';
          p.sortOrder = 3;
        }
      }
    }
    fs.writeFileSync(dbJsonPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Local db.json synchronized successfully.');
  }
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
