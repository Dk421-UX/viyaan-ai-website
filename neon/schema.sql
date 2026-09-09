-- Viyaan AI — Production PostgreSQL Schema for Neon
-- Compatible with PostgreSQL 15+ / Neon Serverless Postgres

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    passphrase TEXT NOT NULL DEFAULT 'viyaan2026',
    password_hash TEXT,
    salt TEXT,
    version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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

-- 5. BLOGS TABLE
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
    CONSTRAINT single_founder_row CHECK (id = 'only_one')
);

-- 7. HOMEPAGE TABLE
CREATE TABLE IF NOT EXISTS public.homepage (
    id TEXT PRIMARY KEY DEFAULT 'only_one',
    tagline TEXT,
    description TEXT,
    cta_text TEXT DEFAULT 'Explore Products',
    cta_url TEXT DEFAULT '/products',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_homepage_row CHECK (id = 'only_one')
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
    CONSTRAINT single_company_row CHECK (id = 'only_one')
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
    CONSTRAINT single_careers_row CHECK (id = 'only_one')
);

-- 11. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL UNIQUE,
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
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. NEWSLETTER TABLE
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. SEO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.seo_settings (
    page_key TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    og_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. HOMEPAGE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    hero_heading TEXT DEFAULT 'Intelligence Beyond the Human Mind.',
    hero_subheading TEXT DEFAULT 'Viyaan AI engineers cognitive architectures, emotional intelligence systems, and future-continuity platforms — built for depth over noise.',
    hero_cta TEXT DEFAULT 'Explore Our Ecosystem',
    hero_cta_link TEXT DEFAULT '/products',
    hero_second_cta TEXT DEFAULT 'Read Research',
    hero_second_cta_link TEXT DEFAULT '/research',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_homepage_settings_row CHECK (id = 'main')
);

-- 17. ANALYTICS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    ga_tracking_id TEXT DEFAULT '',
    enable_analytics BOOLEAN DEFAULT false,
    cookie_consent_enabled BOOLEAN DEFAULT true,
    privacy_policy_url TEXT DEFAULT '/privacy',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_analytics_row CHECK (id = 'main')
);

-- 18. NEWSLETTER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    enabled BOOLEAN DEFAULT true,
    title TEXT DEFAULT 'Stay Ahead of the Intelligence Curve',
    description TEXT DEFAULT 'Receive research updates, product releases, and insights from Viyaan AI directly in your inbox.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_newsletter_settings_row CHECK (id = 'main')
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_research_status ON public.research(status);
CREATE INDEX IF NOT EXISTS idx_innovation_lab_status ON public.innovation_lab(status);
CREATE INDEX IF NOT EXISTS idx_navigation_sort_order ON public.navigation(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.newsletter_subscribers(email);
