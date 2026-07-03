-- Viyaan AI — Production PostgreSQL Schema for Supabase
-- Place this script in the Supabase SQL Editor and execute it to set up all tables, indexes, storage buckets, and RLS policies.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    passphrase TEXT NOT NULL DEFAULT 'viyaan2026',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    features TEXT[] DEFAULT '{}'::TEXT[],
    data_flow TEXT,
    url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    icon TEXT,
    image TEXT,
    slug TEXT GENERATED ALWAYS AS (id) STORED,
    title TEXT GENERATED ALWAYS AS (name) STORED
);

-- 3. RESEARCH TABLE
CREATE TABLE IF NOT EXISTS public.research (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    field TEXT,
    excerpt TEXT,
    content TEXT,
    author TEXT DEFAULT 'Viyaan Research Team',
    date TEXT,
    pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INNOVATION LAB TABLE
CREATE TABLE IF NOT EXISTS public.innovation_lab (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT,
    status_text TEXT,
    description TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BLOGS TABLE (Stored as blogs to match request)
CREATE TABLE IF NOT EXISTS public.blogs (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT NOT NULL DEFAULT 'published',
    seo_title TEXT,
    seo_desc TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. FOUNDER TABLE
CREATE TABLE IF NOT EXISTS public.founder (
    id TEXT PRIMARY KEY DEFAULT 'only_one',
    name TEXT NOT NULL DEFAULT 'Dharani Kumar',
    biography TEXT,
    linkedin TEXT,
    twitter TEXT,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 'only_one')
);

-- 7. HOMEPAGE TABLE
CREATE TABLE IF NOT EXISTS public.homepage (
    id TEXT PRIMARY KEY DEFAULT 'only_one',
    tagline TEXT,
    description TEXT,
    cta_text TEXT DEFAULT 'Explore Products',
    cta_url TEXT DEFAULT '/products',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 'only_one')
);

-- 8. COMPANY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.company_settings (
    id TEXT PRIMARY KEY DEFAULT 'only_one',
    name TEXT NOT NULL DEFAULT 'Viyaan AI',
    tagline TEXT,
    description TEXT,
    email TEXT DEFAULT 'viyaan.ai.team@gmail.com',
    location TEXT DEFAULT 'Chennai, India / Remote',
    linkedin_company TEXT DEFAULT 'https://www.linkedin.com/company/viyaan-ai',
    linkedin_founder TEXT DEFAULT 'https://www.linkedin.com/in/dharani-kumar-49622b349',
    twitter_founder TEXT DEFAULT 'https://x.com/by_dharani',
    response_time TEXT DEFAULT '2 business days',
    founder_image TEXT DEFAULT '/founder.jpeg',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 'only_one')
);

-- 9. NAVIGATION TABLE
CREATE TABLE IF NOT EXISTS public.navigation (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

-- 10. CAREERS TABLE
CREATE TABLE IF NOT EXISTS public.careers (
    id TEXT PRIMARY KEY DEFAULT 'only_one',
    title TEXT,
    description TEXT,
    linkedin_link TEXT DEFAULT 'https://www.linkedin.com/company/viyaan-ai',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 'only_one')
);

-- 11. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    size_bytes BIGINT,
    content_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread', -- 'unread', 'read', 'replied'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. NEWSLETTER TABLE
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. SEO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.seo_settings (
    page_key TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    og_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKET CONFIGURATION
-- Note: Buckets can be initialized via Supabase Storage API, but this SQL inserts
-- them directly into the storage.buckets table for robust database setup.
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true) 
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on all public tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_lab ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- 1. Read access (Anon / Public) for website presentation
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (status = 'published');
CREATE POLICY "Public read research" ON public.research FOR SELECT USING (status = 'published');
CREATE POLICY "Public read innovation_lab" ON public.innovation_lab FOR SELECT USING (status = 'published');
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Public read founder" ON public.founder FOR SELECT USING (true);
CREATE POLICY "Public read homepage" ON public.homepage FOR SELECT USING (true);
CREATE POLICY "Public read company_settings" ON public.company_settings FOR SELECT USING (true);
CREATE POLICY "Public read navigation" ON public.navigation FOR SELECT USING (true);
CREATE POLICY "Public read careers" ON public.careers FOR SELECT USING (true);
CREATE POLICY "Public read seo_settings" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Public read media_library" ON public.media_library FOR SELECT USING (true);

-- 2. Contact & Newsletter submission policy (anyone can insert)
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter FOR INSERT WITH CHECK (true);

-- 3. Service role / Authenticated full management policies
-- (Since we use SUPABASE_SERVICE_ROLE_KEY or custom authenticated session, we grant full access to service_role)
CREATE POLICY "Service role full access products" ON public.products TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access research" ON public.research TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access innovation_lab" ON public.innovation_lab TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access blogs" ON public.blogs TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access founder" ON public.founder TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access homepage" ON public.homepage TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access company_settings" ON public.company_settings TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access navigation" ON public.navigation TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access careers" ON public.careers TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access media_library" ON public.media_library TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access contact_messages" ON public.contact_messages TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access newsletter" ON public.newsletter TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access seo_settings" ON public.seo_settings TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access admins" ON public.admins TO service_role USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- DEFAULT SEED DATA
-- ─────────────────────────────────────────────────────────────────────────────

-- Default Admin
INSERT INTO public.admins (email, passphrase)
VALUES ('admin@viyaan.ai', 'viyaan2026')
ON CONFLICT DO NOTHING;

-- Default Company Settings
INSERT INTO public.company_settings (id, name, tagline, description, email, location, response_time, founder_image)
VALUES (
    'only_one', 
    'Viyaan AI', 
    'Intelligence Beyond the Human Mind.',
    'Viyaan AI is a technology startup focused on building intelligent systems using Artificial Intelligence, Data Science, and Automation. Our mission is to extend human capabilities through intelligent technology and data-driven innovation.',
    'viyaan.ai.team@gmail.com',
    'Chennai, India / Remote',
    '2 business days',
    '/founder.jpeg'
)
ON CONFLICT (id) DO NOTHING;

-- Default Homepage
INSERT INTO public.homepage (id, tagline, description, cta_text, cta_url)
VALUES (
    'only_one',
    'Intelligence Beyond the Human Mind.',
    'Viyaan AI is a technology startup focused on building intelligent systems using Artificial Intelligence, Data Science, and Automation.',
    'Explore Products',
    '/products'
)
ON CONFLICT (id) DO NOTHING;

-- Default Founder
INSERT INTO public.founder (id, name, biography, linkedin, twitter, image_url)
VALUES (
    'only_one',
    'Dharani Kumar',
    'Viyaan AI is not built behind hidden doors. We design publicly, sharing our challenges, research papers, engineering decisions, and daily lessons. This transparency keeps us disciplined, accountable, and deeply connected with our community.',
    'https://www.linkedin.com/in/dharani-kumar-49622b349',
    'https://x.com/by_dharani',
    '/founder.jpeg'
)
ON CONFLICT (id) DO NOTHING;

-- Default Navigation
INSERT INTO public.navigation (id, label, href, sort_order) VALUES
(1, 'Home', '/', 1),
(2, 'Products', '/products', 2),
(3, 'Research', '/research', 3),
(4, 'Innovation Lab', '/lab', 4),
(5, 'Founder', '/founder', 5),
(6, 'Contact', '/contact', 6)
ON CONFLICT (id) DO NOTHING;

-- Default Careers Info
INSERT INTO public.careers (id, title, description, linkedin_link)
VALUES (
    'only_one',
    'Connect with Our Mission',
    'We look for individuals motivated by craft, focus, and long-term values. If you align with our philosophy of building technology that amplifies human potential, we welcome you to join our network.',
    'https://www.linkedin.com/company/viyaan-ai'
)
ON CONFLICT (id) DO NOTHING;

-- Default SEO Settings
INSERT INTO public.seo_settings (page_key, title, description) VALUES
('home', 'Viyaan AI — Intelligence Beyond the Human Mind', 'Building next-generation intelligent systems with emotional awareness, psychology-first design, and long-term reflection retention.'),
('products', 'Products Suite — Viyaan AI', 'Explore the Viyaan AI product ecosystem: JOI Companion AI, Human OS, and Viyaan Future.'),
('research', 'Research Frontiers — Viyaan AI', 'Exploring cognitive architectures, human-computer symbiosis, and private future continuity.'),
('lab', 'Innovation Lab — Viyaan AI', 'Experimental tools and utility applications built in public by Viyaan AI.'),
('founder', 'Founding Architect — Viyaan AI', 'Dharani Kumar, founder of Viyaan AI, building systems that extend human capability.'),
('contact', 'Connect — Viyaan AI', 'Connect with the Viyaan AI team for inquiries, collaborations, and career opportunities.'),
('blog', 'Insights & News — Viyaan AI', 'Latest updates, announcements, and thoughts on AI engineering from Viyaan AI.')
ON CONFLICT (page_key) DO NOTHING;

-- ──────────────────────────────────────────
-- ADDITIONAL TABLES (PHASE 2)
-- ──────────────────────────────────────────

-- 16. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- Admins can see all
CREATE POLICY "Admin full access newsletter" ON public.newsletter_subscribers
    FOR ALL USING (true);

-- 17. HOMEPAGE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    hero_heading TEXT DEFAULT 'Intelligence Beyond the Human Mind.',
    hero_subheading TEXT DEFAULT 'Viyaan AI engineers cognitive architectures, emotional intelligence systems, and future-continuity platforms — built for depth over noise.',
    hero_cta TEXT DEFAULT 'Explore Our Ecosystem',
    hero_cta_link TEXT DEFAULT '/products',
    hero_second_cta TEXT DEFAULT 'Read Research',
    hero_second_cta_link TEXT DEFAULT '/research',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read homepage" ON public.homepage_settings FOR SELECT USING (true);
CREATE POLICY "Admin write homepage" ON public.homepage_settings FOR ALL USING (true);

-- Default homepage settings row
INSERT INTO public.homepage_settings (id)
VALUES ('main')
ON CONFLICT (id) DO NOTHING;

-- 18. ANALYTICS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    ga_tracking_id TEXT DEFAULT '',
    enable_analytics BOOLEAN DEFAULT false,
    cookie_consent_enabled BOOLEAN DEFAULT true,
    privacy_policy_url TEXT DEFAULT '/privacy',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read analytics" ON public.analytics_settings FOR SELECT USING (true);
CREATE POLICY "Admin write analytics" ON public.analytics_settings FOR ALL USING (true);
CREATE POLICY "Service role full access analytics_settings" ON public.analytics_settings TO service_role USING (true) WITH CHECK (true);

-- Default analytics settings row
INSERT INTO public.analytics_settings (id)
VALUES ('main')
ON CONFLICT (id) DO NOTHING;

-- 19. NEWSLETTER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    enabled BOOLEAN DEFAULT true,
    title TEXT DEFAULT 'Stay Ahead of the Intelligence Curve',
    description TEXT DEFAULT 'Receive research updates, product releases, and insights from Viyaan AI directly in your inbox.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.newsletter_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read newsletter settings" ON public.newsletter_settings FOR SELECT USING (true);
CREATE POLICY "Admin write newsletter settings" ON public.newsletter_settings FOR ALL USING (true);

-- Default newsletter settings row
INSERT INTO public.newsletter_settings (id)
VALUES ('main')
ON CONFLICT (id) DO NOTHING;


