import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

async function run() {
  console.log("Applying Education-First Transformation to Neon Database & db.json...");

  // 1. Read .env.local
  const envContent = await fs.readFile(path.join(rootDir, ".env.local"), "utf-8");
  const line = envContent.split("\n").find((l) => l.startsWith("DATABASE_URL="));
  const dbUrl = line.split("=")[1].trim().replace(/^["']|["']$/g, "");
  const sql = neon(dbUrl);

  const companyTagline = "Beyond Learning. Beyond Limits.";
  const companyDesc =
    "Viyaan AI builds AI-powered learning experiences that help people understand concepts, organize their preparation, strengthen knowledge retention, and develop independent problem-solving skills.";
  const heroSubheading =
    "AI-powered learning experiences designed to help people understand more, remember better, and think independently.";

  // Update company_settings
  await sql`
    UPDATE company_settings
    SET tagline = ${companyTagline},
        description = ${companyDesc},
        updated_at = NOW()
    WHERE id = 'only_one'
  `;
  console.log("✅ Updated company_settings in Neon.");

  // Update homepage_settings
  await sql`
    UPDATE homepage_settings
    SET hero_heading = ${companyTagline},
        hero_subheading = ${heroSubheading},
        hero_cta = 'Explore Our Projects',
        hero_cta_link = '/products',
        hero_second_cta = 'Our Mission',
        hero_second_cta_link = '/#mission',
        updated_at = NOW()
    WHERE id = 'main'
  `;
  console.log("✅ Updated homepage_settings in Neon.");

  // Update seo_settings
  const seoItems = [
    {
      key: "home",
      title: "Viyaan AI | AI-Powered Education and Intelligent Learning",
      description:
        "Viyaan AI builds AI-powered learning experiences using Artificial Intelligence, Data Science, and innovative learning techniques to support better understanding, focused revision, and independent learning.",
    },
    {
      key: "products",
      title: "Educational Projects & Intelligent Systems — Viyaan AI",
      description:
        "Explore Viyaan AI's learning technology portfolio: ExamRAG, EXAMORACLE, and Attendance Intelligence, alongside our broader intelligent system experiments.",
    },
    {
      key: "research",
      title: "Learning & Cognitive Research — Viyaan AI",
      description:
        "Explorations into retrieval-augmented educational systems, long-term memory retention, and cognitive architectures.",
    },
    {
      key: "lab",
      title: "Innovation Lab & Sandbox — Viyaan AI",
      description:
        "Experimental educational tools, student productivity models, and interactive learning prototypes built in public.",
    },
    {
      key: "founder",
      title: "Founding Architect — Viyaan AI",
      description:
        "Dharani Kumar, founder of Viyaan AI, building AI systems dedicated to deeper understanding and independent learning.",
    },
    {
      key: "contact",
      title: "Contact & Educational Collaborations — Viyaan AI",
      description:
        "Connect with Viyaan AI for educational partnerships, platform sandbox access, and technical inquiries.",
    },
    {
      key: "blog",
      title: "Insights on Learning & AI — Viyaan AI",
      description:
        "Articles, technical updates, and architectural notes on AI in education from the Viyaan AI team.",
    },
  ];

  for (const s of seoItems) {
    await sql`
      INSERT INTO seo_settings (page_key, title, description)
      VALUES (${s.key}, ${s.title}, ${s.description})
      ON CONFLICT (page_key) DO UPDATE
      SET title = EXCLUDED.title,
          description = EXCLUDED.description
    `;
  }
  console.log("✅ Updated seo_settings in Neon.");

  // Insert/Update Educational Projects & Preserve Secondary Projects
  const products = [
    {
      id: "examrag",
      name: "ExamRAG",
      tagline: "Retrieval-Augmented Learning and Exam Preparation",
      description:
        "ExamRAG explores how retrieval-augmented generation can make exam preparation more structured and useful. By working with educational documents, semantic retrieval, and language models, the project aims to help learners find relevant information and develop focused answers for revision and exam preparation.",
      features: [
        "Educational PDF ingestion and document parsing",
        "Embedding-based semantic retrieval and context reranking",
        "Context-grounded answer generation tailored for revision",
        "Local model inference support (Ollama-compatible pipeline)",
      ],
      data_flow:
        "Processes syllabus textbooks and lecture notes into semantic vector chunks to retrieve precise citations and synthesize revision answers.",
      url: "/products#examrag",
      status: "published",
    },
    {
      id: "examoracle",
      name: "EXAMORACLE",
      tagline: "Study Reflection and Preparation Diagnostics",
      description:
        "EXAMORACLE explores interactive ways for learners to reflect on their preparation habits, revision consistency, confidence, sleep, and exam-related pressure. Its goal is to turn self-reported information into structured reflection and practical preparation insights.",
      features: [
        "Study habit inputs and consistency tracking",
        "Revision-quality and confidence indicators",
        "Structured preparation feedback and rhythm recommendations",
        "Explanatory reflection summaries to identify study gaps",
      ],
      data_flow:
        "Transforms learner self-evaluations into structured study readiness indicators without claiming predictive test score certainty.",
      url: "/products#examoracle",
      status: "published",
    },
    {
      id: "attendance-intelligence",
      name: "Attendance Intelligence",
      tagline: "Student Productivity and Academic Planning",
      description:
        "Attendance Intelligence helps students understand their attendance status, track missed classes, and explore how future attendance may affect their overall attendance percentage.",
      features: [
        "Attendance percentage calculations and threshold status indicators",
        "Missed-class tracking and margin-of-safety modeling",
        "Subject-level breakdowns and semester planning calculators",
        "Simulated schedule forecasts to avoid attendance shortfalls",
      ],
      data_flow:
        "Calculates required classes based on institution threshold criteria (e.g. standard 75% baseline) to provide clear semester visibility.",
      url: "/products#attendance-intelligence",
      status: "published",
    },
    {
      id: "joi",
      name: "JOI Companion AI",
      tagline: "Talk to JOI // Conversational Presence & Audio Atmosphere",
      description:
        "An emotionally intelligent companion application. JOI is designed for supportive conversations, offering customizable emotional states, ambient audio toggle, and text or microphone voice inputs within an atmospheric visual canvas.",
      features: [
        "Customizable emotional state overrides",
        "Ambient soundscapes and WebGL-rendered presence",
        "Text-input and microphone voice capture support",
        "Private workspace design focusing on calm interaction",
      ],
      data_flow:
        "A companion designed to adapt mood states according to reflection inputs, providing an immediate sounding board for self-expression.",
      url: "https://joi-ai-wq7f.vercel.app/",
      status: "published",
    },
    {
      id: "human-os",
      name: "Human OS",
      tagline: "The Operating System for Understanding Yourself",
      description:
        "A psychology-first self-reflection platform designed to help users track reflections and understand daily patterns through daily logs, habit entries, and secure archives.",
      features: [
        "Reflective journal workspace ('Write')",
        "Cognitive analysis mapping ('Understand')",
        "Encrypted history logs storage ('Vault')",
        "Interactive milestone reflection ('Timeline')",
      ],
      data_flow:
        "Organizes cognitive profile reflections that help structure habit check-ins and personal continuity logs.",
      url: "https://human-os-ptot.vercel.app/",
      status: "published",
    },
    {
      id: "future",
      name: "Viyaan Future",
      tagline: "Private Future-Self Continuity",
      description:
        "Viyaan AI's innovation and continuity platform focused on long-term reflection retention, allowing users to write reflections and maintain a private timeline over time.",
      features: [
        "Secure email-authenticated timeline access",
        "Private digital future-self continuity diaries",
        "Long-term memory logs and remembered details",
        "Theme customization (light/dark adaptive styling)",
      ],
      data_flow:
        "Acts as the platform for future-self memory mapping, collecting logs to track personal development over time.",
      url: "https://viyaan-future-ai.vercel.app/",
      status: "published",
    },
  ];

  for (const p of products) {
    await sql`
      INSERT INTO products (id, name, tagline, description, features, data_flow, url, status)
      VALUES (${p.id}, ${p.name}, ${p.tagline}, ${p.description}, ${p.features}, ${p.data_flow}, ${p.url}, ${p.status})
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          tagline = EXCLUDED.tagline,
          description = EXCLUDED.description,
          features = EXCLUDED.features,
          data_flow = EXCLUDED.data_flow,
          url = EXCLUDED.url,
          status = EXCLUDED.status,
          updated_at = NOW()
    `;
  }
  console.log(`✅ Upserted ${products.length} products in Neon.`);

  // Upsert Innovation Lab projects
  const labProjects = [
    {
      id: "lab-attendance",
      title: "Attendance Intelligence & Risk Margin Forecaster",
      type: "Academic Planning Instrument",
      status_text: "Interactive Model",
      description:
        "Algorithmic modeling tool helping students analyze semester attendance risk margins, calculate required lecture attendance against institutional thresholds (75%), and simulate schedule impact.",
      tags: ["Education", "Productivity", "Simulation"],
      status: "published",
    },
    {
      id: "lab-examrag",
      title: "ExamRAG Semantic Document Retrieval Pipeline",
      type: "RAG Retrieval Pipeline",
      status_text: "Prototype Pipeline",
      description:
        "Retrieval-Augmented Generation testbed exploring syllabus-grounded chunking, vector indexing, and citation-anchored question answering with local Ollama inference capability.",
      tags: ["RAG", "Education", "NLP", "Local LLM"],
      status: "published",
    },
    {
      id: "lab-examoracle",
      title: "EXAMORACLE Study Habit & Readiness Matrix",
      type: "Cognitive Diagnostics",
      status_text: "Experimental Sandbox",
      description:
        "Exploratory self-reporting diagnostic engine evaluating revision consistency, confidence rhythms, and subject study distributions without making ungrounded score predictions.",
      tags: ["Cognition", "Self-Reflection", "Preparation"],
      status: "published",
    },
  ];

  for (const l of labProjects) {
    await sql`
      INSERT INTO innovation_lab (id, title, type, status_text, description, tags, status)
      VALUES (${l.id}, ${l.title}, ${l.type}, ${l.status_text}, ${l.description}, ${l.tags}, ${l.status})
      ON CONFLICT (id) DO UPDATE
      SET title = EXCLUDED.title,
          type = EXCLUDED.type,
          status_text = EXCLUDED.status_text,
          description = EXCLUDED.description,
          tags = EXCLUDED.tags,
          status = EXCLUDED.status
    `;
  }
  console.log(`✅ Upserted ${labProjects.length} innovation lab instruments in Neon.`);

  // 2. Synchronize src/data/db.json
  const dbJsonPath = path.join(rootDir, "src", "data", "db.json");
  const rawDb = await fs.readFile(dbJsonPath, "utf-8");
  const dbObj = JSON.parse(rawDb);

  dbObj.companyInfo.tagline = companyTagline;
  dbObj.companyInfo.description = companyDesc;
  dbObj.companyInfo.mission =
    "To make learning more effective, personalized, and accessible by building intelligent learning experiences that help people understand concepts, strengthen knowledge retention, identify learning gaps, and develop independent problem-solving skills.";
  dbObj.companyInfo.vision =
    "To build a future in which intelligent technology helps every learner move beyond memorization toward deeper understanding, independent thinking, and continuous growth.";
  dbObj.companyInfo.philosophy =
    "AI should do more than provide answers. It should help people develop genuine understanding.";

  dbObj.homepage.heroHeading = companyTagline;
  dbObj.homepage.heroSubheading = heroSubheading;
  dbObj.homepage.heroCta = "Explore Our Projects";
  dbObj.homepage.heroCtaLink = "/products";
  dbObj.homepage.heroSecondCta = "Our Mission";
  dbObj.homepage.heroSecondCtaLink = "/#mission";

  for (const s of seoItems) {
    dbObj.seo[s.key] = {
      title: s.title,
      description: s.description,
    };
  }

  dbObj.products = products.map((p) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    features: p.features,
    dataFlow: p.data_flow,
    url: p.url,
    status: p.status,
  }));

  dbObj.labProjects = labProjects.map((l) => ({
    id: l.id,
    title: l.title,
    type: l.type,
    statusText: l.status_text,
    description: l.description,
    tags: l.tags,
    status: l.status,
  }));

  await fs.writeFile(dbJsonPath, JSON.stringify(dbObj, null, 2), "utf-8");
  console.log("✅ Synchronized src/data/db.json.");
  console.log("Education-first data sync complete!");
}

run().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});
