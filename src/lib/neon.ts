import { neon } from "@neondatabase/serverless";

function getDatabaseUrl(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    null
  );
}

export const isNeonConfigured = !!getDatabaseUrl();

export function getNeonSql() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("Neon DATABASE_URL environment variable is missing.");
  }
  return neon(url);
}

// Safe diagnostics (never returns credentials or host secrets)
export function getNeonDiagnostics() {
  const url = getDatabaseUrl();
  return {
    isConfigured: !!url,
    hasDatabaseUrl: !!url,
    isProduction: process.env.NODE_ENV === "production",
  };
}

// Probe database connection health
export async function verifyNeonConnection() {
  if (!isNeonConfigured) {
    return { connected: false, initialized: false, error: "DATABASE_URL not configured" };
  }

  try {
    const sql = getNeonSql();
    // 1. Probe database ping
    await sql`SELECT 1 as ping`;

    // 2. Probe schema table presence
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'company_settings'
      LIMIT 1
    `;

    const initialized = tables.length > 0;
    return {
      connected: true,
      initialized,
      error: initialized ? null : "Tables not initialized. Please run neon/schema.sql."
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Neon connection error";
    return { connected: false, initialized: false, error: message };
  }
}

// ============================================================================
// Core Database Reader (Assembled Content for Frontend and CMS)
// ============================================================================
export async function getDbFromNeon() {
  const sql = getNeonSql();

  try {
    const [
      companyRows,
      navRows,
      seoRows,
      productRows,
      blogRows,
      researchRows,
      labRows,
      careerRows,
      homepageRows,
      analyticsRows,
      newsletterRows
    ] = await Promise.all([
      sql`SELECT * FROM company_settings WHERE id = 'only_one' LIMIT 1`,
      sql`SELECT * FROM navigation ORDER BY sort_order ASC`,
      sql`SELECT * FROM seo_settings`,
      sql`SELECT * FROM products ORDER BY created_at DESC`,
      sql`SELECT * FROM blogs ORDER BY created_at DESC`,
      sql`SELECT * FROM research ORDER BY created_at DESC`,
      sql`SELECT * FROM innovation_lab ORDER BY created_at DESC`,
      sql`SELECT * FROM careers WHERE id = 'only_one' LIMIT 1`,
      sql`SELECT * FROM homepage_settings WHERE id = 'main' LIMIT 1`,
      sql`SELECT * FROM analytics_settings WHERE id = 'main' LIMIT 1`,
      sql`SELECT * FROM newsletter_settings WHERE id = 'main' LIMIT 1`
    ]);

    const companyData = companyRows[0] || {};
    const careersData = careerRows[0] || {};
    const homepageData = homepageRows[0] || {};
    const analyticsData = analyticsRows[0] || {};
    const newsletterData = newsletterRows[0] || {};

    const seoSettings: Record<string, { title: string; description: string; og_image?: string }> = {};
    for (const row of seoRows) {
      seoSettings[row.page_key] = {
        title: row.title,
        description: row.description,
        og_image: row.og_image
      };
    }

    return {
      companyInfo: {
        name: companyData.name || "Viyaan AI",
        tagline: companyData.tagline || "Intelligence Beyond the Human Mind.",
        description: companyData.description || "",
        email: companyData.email || "viyaan.ai.team@gmail.com",
        location: companyData.location || "Chennai, India / Remote",
        linkedinCompany: companyData.linkedin_company || "",
        linkedinFounder: companyData.linkedin_founder || "",
        twitterFounder: companyData.twitter_founder || "",
        responseTime: companyData.response_time || "2 business days",
        founderImage: companyData.founder_image || "/founder.jpeg"
      },
      navigation: navRows.map((n: any) => ({
        id: n.id,
        label: n.label,
        href: n.href,
        sort_order: n.sort_order
      })),
      seo: seoSettings,
      products: productRows.map((p: any) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        features: Array.isArray(p.features) ? p.features : [],
        dataFlow: p.data_flow,
        url: p.url,
        status: p.status || "published"
      })),
      posts: blogRows.map((b: any) => ({
        slug: b.slug,
        title: b.title,
        date: b.date,
        category: b.category,
        excerpt: b.excerpt,
        content: b.content,
        tags: Array.isArray(b.tags) ? b.tags : [],
        status: b.status || "published",
        seoTitle: b.seo_title,
        seoDesc: b.seo_desc
      })),
      research: researchRows.map((r: any) => ({
        slug: r.slug,
        title: r.title,
        field: r.field,
        excerpt: r.excerpt,
        content: r.content,
        author: r.author,
        date: r.date,
        pdfUrl: r.pdf_url,
        status: r.status || "published"
      })),
      labProjects: labRows.map((l: any) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        statusText: l.status_text,
        description: l.description,
        tags: Array.isArray(l.tags) ? l.tags : [],
        status: l.status || "published"
      })),
      careers: {
        title: careersData.title || "Connect with Our Mission",
        description: careersData.description || "",
        linkedinLink: careersData.linkedin_link || ""
      },
      homepage: {
        heroHeading: homepageData.hero_heading || "Intelligence Beyond the Human Mind.",
        heroSubheading: homepageData.hero_subheading || "",
        heroCta: homepageData.hero_cta || "Explore Our Ecosystem",
        heroCtaLink: homepageData.hero_cta_link || "/products",
        heroSecondCta: homepageData.hero_second_cta || "Read Research",
        heroSecondCtaLink: homepageData.hero_second_cta_link || "/research"
      },
      analytics: {
        gaTrackingId: analyticsData.ga_tracking_id || "",
        enableAnalytics: !!analyticsData.enable_analytics,
        cookieConsentEnabled: analyticsData.cookie_consent_enabled ?? true,
        privacyPolicyUrl: analyticsData.privacy_policy_url || "/privacy"
      },
      newsletter: {
        enabled: newsletterData.enabled ?? true,
        title: newsletterData.title || "Stay Ahead of the Intelligence Curve",
        description: newsletterData.description || ""
      },
      linkedinSync: []
    };
  } catch (error) {
    console.error("[getDbFromNeon] Error querying Neon database:", error);
    throw error;
  }
}

// ============================================================================
// CMS Mutations (Admin Operations on Neon)
// ============================================================================

export async function updateCompanySettingsNeon(data: any) {
  const sql = getNeonSql();
  await sql`
    INSERT INTO company_settings (
      id, name, tagline, description, email, location, 
      linkedin_company, linkedin_founder, twitter_founder, response_time, founder_image, updated_at
    ) VALUES (
      'only_one', 
      ${data.name || "Viyaan AI"}, 
      ${data.tagline || ""}, 
      ${data.description || ""}, 
      ${data.email || ""}, 
      ${data.location || ""}, 
      ${data.linkedinCompany || data.linkedin_company || ""}, 
      ${data.linkedinFounder || data.linkedin_founder || ""}, 
      ${data.twitterFounder || data.twitter_founder || ""}, 
      ${data.responseTime || data.response_time || "2 business days"}, 
      ${data.founderImage || data.founder_image || "/founder.jpeg"}, 
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      tagline = EXCLUDED.tagline,
      description = EXCLUDED.description,
      email = EXCLUDED.email,
      location = EXCLUDED.location,
      linkedin_company = EXCLUDED.linkedin_company,
      linkedin_founder = EXCLUDED.linkedin_founder,
      twitter_founder = EXCLUDED.twitter_founder,
      response_time = EXCLUDED.response_time,
      founder_image = EXCLUDED.founder_image,
      updated_at = NOW()
  `;
}

export async function saveNavigationNeon(items: any[]) {
  const sql = getNeonSql();
  await sql`DELETE FROM navigation WHERE id >= 0`;
  if (Array.isArray(items) && items.length > 0) {
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      await sql`
        INSERT INTO navigation (label, href, sort_order)
        VALUES (${item.label}, ${item.href}, ${idx + 1})
      `;
    }
  }
}

export async function saveSeoSettingsNeon(data: Record<string, any>) {
  const sql = getNeonSql();
  for (const [key, pageSeo] of Object.entries(data)) {
    await sql`
      INSERT INTO seo_settings (page_key, title, description, og_image, created_at)
      VALUES (
        ${key}, 
        ${pageSeo.title || ""}, 
        ${pageSeo.description || ""}, 
        ${pageSeo.ogImage || pageSeo.og_image || null}, 
        NOW()
      )
      ON CONFLICT (page_key) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        og_image = EXCLUDED.og_image
    `;
  }
}

export async function saveProductNeon(product: any) {
  const sql = getNeonSql();
  const features = Array.isArray(product.features) ? product.features : [];
  await sql`
    INSERT INTO products (
      id, name, tagline, description, features, data_flow, url, status, updated_at
    ) VALUES (
      ${product.id},
      ${product.name},
      ${product.tagline || null},
      ${product.description || null},
      ${features},
      ${product.dataFlow || product.data_flow || null},
      ${product.url || null},
      ${product.status || "published"},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      tagline = EXCLUDED.tagline,
      description = EXCLUDED.description,
      features = EXCLUDED.features,
      data_flow = EXCLUDED.data_flow,
      url = EXCLUDED.url,
      status = EXCLUDED.status,
      updated_at = NOW()
  `;
}

export async function deleteProductNeon(id: string) {
  const sql = getNeonSql();
  await sql`DELETE FROM products WHERE id = ${id}`;
}

export async function savePostNeon(post: any) {
  const sql = getNeonSql();
  const tags = Array.isArray(post.tags) ? post.tags : [];
  await sql`
    INSERT INTO blogs (
      slug, title, date, category, excerpt, content, tags, status, seo_title, seo_desc, created_at
    ) VALUES (
      ${post.slug},
      ${post.title},
      ${post.date || null},
      ${post.category || "Ecosystem Release"},
      ${post.excerpt || null},
      ${post.content || null},
      ${tags},
      ${post.status || "published"},
      ${post.seoTitle || post.seo_title || null},
      ${post.seoDesc || post.seo_desc || null},
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      date = EXCLUDED.date,
      category = EXCLUDED.category,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      tags = EXCLUDED.tags,
      status = EXCLUDED.status,
      seo_title = EXCLUDED.seo_title,
      seo_desc = EXCLUDED.seo_desc
  `;
}

export async function deletePostNeon(slug: string) {
  const sql = getNeonSql();
  await sql`DELETE FROM blogs WHERE slug = ${slug}`;
}

export async function saveResearchNeon(research: any) {
  const sql = getNeonSql();
  await sql`
    INSERT INTO research (
      slug, title, field, excerpt, content, author, date, pdf_url, status, created_at
    ) VALUES (
      ${research.slug},
      ${research.title},
      ${research.field || "Cognitive Science"},
      ${research.excerpt || null},
      ${research.content || null},
      ${research.author || "Viyaan Research Team"},
      ${research.date || null},
      ${research.pdfUrl || research.pdf_url || null},
      ${research.status || "published"},
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      field = EXCLUDED.field,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      author = EXCLUDED.author,
      date = EXCLUDED.date,
      pdf_url = EXCLUDED.pdf_url,
      status = EXCLUDED.status
  `;
}

export async function deleteResearchNeon(slug: string) {
  const sql = getNeonSql();
  await sql`DELETE FROM research WHERE slug = ${slug}`;
}

export async function saveLabProjectNeon(lab: any) {
  const sql = getNeonSql();
  const tags = Array.isArray(lab.tags) ? lab.tags : [];
  await sql`
    INSERT INTO innovation_lab (
      id, title, type, status_text, description, tags, status, created_at
    ) VALUES (
      ${lab.id},
      ${lab.title},
      ${lab.type || "UTILITY APPLICATION"},
      ${lab.statusText || lab.status_text || "STABLE"},
      ${lab.description || null},
      ${tags},
      ${lab.status || "published"},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      type = EXCLUDED.type,
      status_text = EXCLUDED.status_text,
      description = EXCLUDED.description,
      tags = EXCLUDED.tags,
      status = EXCLUDED.status
  `;
}

export async function deleteLabProjectNeon(id: string) {
  const sql = getNeonSql();
  await sql`DELETE FROM innovation_lab WHERE id = ${id}`;
}

export async function saveCareersNeon(data: any) {
  const sql = getNeonSql();
  await sql`
    INSERT INTO careers (id, title, description, linkedin_link, updated_at)
    VALUES (
      'only_one',
      ${data.title || "Connect with Our Mission"},
      ${data.description || ""},
      ${data.linkedinLink || data.linkedin_link || ""},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      linkedin_link = EXCLUDED.linkedin_link,
      updated_at = NOW()
  `;
}

export async function saveHomepageSettingsNeon(data: any) {
  const sql = getNeonSql();
  await sql`
    INSERT INTO homepage_settings (
      id, hero_heading, hero_subheading, hero_cta, hero_cta_link, hero_second_cta, hero_second_cta_link, updated_at
    ) VALUES (
      'main',
      ${data.heroHeading || data.hero_heading || "Intelligence Beyond the Human Mind."},
      ${data.heroSubheading || data.hero_subheading || ""},
      ${data.heroCta || data.hero_cta || "Explore Our Ecosystem"},
      ${data.heroCtaLink || data.hero_cta_link || "/products"},
      ${data.heroSecondCta || data.hero_second_cta || "Read Research"},
      ${data.heroSecondCtaLink || data.hero_second_cta_link || "/research"},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      hero_heading = EXCLUDED.hero_heading,
      hero_subheading = EXCLUDED.hero_subheading,
      hero_cta = EXCLUDED.hero_cta,
      hero_cta_link = EXCLUDED.hero_cta_link,
      hero_second_cta = EXCLUDED.hero_second_cta,
      hero_second_cta_link = EXCLUDED.hero_second_cta_link,
      updated_at = NOW()
  `;
}

export async function saveAnalyticsSettingsNeon(data: any) {
  const sql = getNeonSql();
  await sql`
    INSERT INTO analytics_settings (
      id, ga_tracking_id, enable_analytics, cookie_consent_enabled, privacy_policy_url, updated_at
    ) VALUES (
      'main',
      ${data.gaTrackingId || data.ga_tracking_id || ""},
      ${!!(data.enableAnalytics ?? data.enable_analytics)},
      ${!!(data.cookieConsentEnabled ?? data.cookie_consent_enabled ?? true)},
      ${data.privacyPolicyUrl || data.privacy_policy_url || "/privacy"},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      ga_tracking_id = EXCLUDED.ga_tracking_id,
      enable_analytics = EXCLUDED.enable_analytics,
      cookie_consent_enabled = EXCLUDED.cookie_consent_enabled,
      privacy_policy_url = EXCLUDED.privacy_policy_url,
      updated_at = NOW()
  `;
}

export async function saveNewsletterSettingsNeon(data: any) {
  const sql = getNeonSql();
  await sql`
    INSERT INTO newsletter_settings (
      id, enabled, title, description, updated_at
    ) VALUES (
      'main',
      ${data.enabled ?? true},
      ${data.title || "Stay Ahead of the Intelligence Curve"},
      ${data.description || ""},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      enabled = EXCLUDED.enabled,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      updated_at = NOW()
  `;
}

// ============================================================================
// Contact Messages (Neon Queries)
// ============================================================================
export async function getContactMessagesNeon() {
  const sql = getNeonSql();
  return sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
}

export async function insertContactMessageNeon(msg: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const sql = getNeonSql();
  return sql`
    INSERT INTO contact_messages (
      name, email, company, phone, subject, message, status, created_at
    ) VALUES (
      ${msg.name},
      ${msg.email},
      ${msg.company || null},
      ${msg.phone || null},
      ${msg.subject || "No Subject"},
      ${msg.message},
      'unread',
      NOW()
    )
    RETURNING id
  `;
}

export async function updateContactStatusNeon(id: string, status: string) {
  const sql = getNeonSql();
  await sql`UPDATE contact_messages SET status = ${status} WHERE id = ${id}`;
}

export async function deleteContactMessageNeon(id: string) {
  const sql = getNeonSql();
  await sql`DELETE FROM contact_messages WHERE id = ${id}`;
}

// ============================================================================
// Newsletter Subscribers (Neon Queries)
// ============================================================================
export async function getNewsletterSubscribersNeon() {
  const sql = getNeonSql();
  return sql`SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC`;
}

export async function insertNewsletterSubscriberNeon(email: string, name?: string) {
  const sql = getNeonSql();
  return sql`
    INSERT INTO newsletter_subscribers (email, name, subscribed_at)
    VALUES (${email}, ${name || null}, NOW())
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
}

export async function deleteNewsletterSubscriberNeon(idOrEmail: string) {
  const sql = getNeonSql();
  await sql`DELETE FROM newsletter_subscribers WHERE id::text = ${idOrEmail} OR email = ${idOrEmail}`;
}

// ============================================================================
// Media Library Catalog (Neon Queries)
// ============================================================================
export async function getMediaLibraryNeon() {
  const sql = getNeonSql();
  return sql`SELECT * FROM media_library ORDER BY created_at DESC`;
}

export async function insertMediaRecordNeon(record: {
  filename: string;
  url: string;
  sizeBytes?: number;
  contentType?: string;
}) {
  const sql = getNeonSql();
  await sql`
    INSERT INTO media_library (filename, url, size_bytes, content_type, created_at)
    VALUES (
      ${record.filename},
      ${record.url},
      ${record.sizeBytes || null},
      ${record.contentType || null},
      NOW()
    )
    ON CONFLICT (filename) DO UPDATE SET
      url = EXCLUDED.url,
      size_bytes = EXCLUDED.size_bytes,
      content_type = EXCLUDED.content_type
  `;
}

export async function deleteMediaRecordNeon(filename: string) {
  const sql = getNeonSql();
  await sql`DELETE FROM media_library WHERE filename = ${filename}`;
}

// ============================================================================
// Admin Authentication (Neon Queries)
// ============================================================================
export async function getAdminCredentialsNeon() {
  const sql = getNeonSql();
  const rows = await sql`SELECT * FROM admins LIMIT 1`;
  if (rows.length === 0) return null;

  const row = rows[0];
  if (row.password_hash && row.salt) {
    return {
      passwordHash: row.password_hash,
      salt: row.salt,
      updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
      version: row.version || 1,
      source: "neon" as const
    };
  }

  if (row.passphrase) {
    if (typeof row.passphrase === "string" && row.passphrase.startsWith("scrypt:")) {
      const parts = row.passphrase.split(":");
      if (parts.length === 3 && parts[1] && parts[2]) {
        return {
          passwordHash: parts[2],
          salt: parts[1],
          updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
          version: 1,
          source: "neon" as const
        };
      }
    }

    return {
      passwordHash: "LEGACY_PLAIN",
      salt: "",
      updatedAt: row.created_at || new Date().toISOString(),
      version: 1,
      source: "neon" as const,
      isLegacyPlain: true,
      legacyRaw: row.passphrase
    };
  }

  return null;
}

export async function saveAdminCredentialsNeon(hash: string, salt: string) {
  const sql = getNeonSql();
  const scryptFormatted = `scrypt:${salt}:${hash}`;
  const existing = await sql`SELECT id FROM admins LIMIT 1`;

  if (existing.length > 0) {
    await sql`
      UPDATE admins SET
        passphrase = ${scryptFormatted},
        password_hash = ${hash},
        salt = ${salt},
        updated_at = NOW()
      WHERE id = ${existing[0].id}
    `;
  } else {
    await sql`
      INSERT INTO admins (email, passphrase, password_hash, salt, created_at, updated_at)
      VALUES ('admin@viyaan.ai', ${scryptFormatted}, ${hash}, ${salt}, NOW(), NOW())
    `;
  }
  return true;
}
