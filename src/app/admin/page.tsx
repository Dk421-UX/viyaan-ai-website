"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Lock, LogOut, Save, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteContainer from "@/components/SiteContainer";

type CompanyForm = {
  name: string;
  tagline: string;
  websiteUrl: string;
  linkedinCompany: string;
  linkedinEnabled: boolean;
  linkedinDescription: string;
  linkedinLogoUrl: string;
};

type HomepageForm = {
  heroHeading: string;
  heroSubheading: string;
  aboutHeading: string;
  aboutText: string;
  aboutPurpose: string;
  visionHeading: string;
  visionText: string;
};

type ProjectForm = {
  id: string;
  name: string;
  description: string;
  url: string;
  status: "published" | "hidden";
  sortOrder: number;
  projectStatus: string;
};

type ProjectRecord = {
  id: string;
  name?: string;
  description?: string;
  url?: string;
  status?: string;
  sortOrder?: number;
  projectStatus?: string;
  tagline?: string;
};

type ContentData = {
  companyInfo?: Partial<CompanyForm>;
  homepage?: Partial<HomepageForm>;
  products?: ProjectRecord[];
};

const projectIds = ["examrag", "examoracle", "attendance-intelligence"];

const emptyCompany: CompanyForm = {
  name: "Viyaan AI",
  tagline: "Beyond Learning. Beyond Limits.",
  websiteUrl: "https://viyaan-ai-website.onrender.com/",
  linkedinCompany: "https://www.linkedin.com/company/viyaan-ai",
  linkedinEnabled: true,
  linkedinDescription: "",
  linkedinLogoUrl: "",
};

const emptyHomepage: HomepageForm = {
  heroHeading: "AI That Helps People Learn Better.",
  heroSubheading: "Building intelligent learning solutions through AI, data science, and purposeful innovation.",
  aboutHeading: "Intelligence With a Purpose.",
  aboutText: "Viyaan AI builds intelligent learning experiences that help people move beyond memorisation towards deeper understanding, stronger problem-solving, and independent thinking.",
  aboutPurpose: "To make learning more effective, personalised, and accessible through purposeful AI innovation.",
  visionHeading: "Beyond Answers. Towards Understanding.",
  visionText: "We believe AI should help people build understanding, think independently, and continue learning.",
};

function validUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<ContentData | null>(null);
  const [company, setCompany] = useState<CompanyForm>(emptyCompany);
  const [homepage, setHomepage] = useState<HomepageForm>(emptyHomepage);
  const [project, setProject] = useState<ProjectForm | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadContent() {
    const response = await fetch("/api/content", { credentials: "include" });
    if (!response.ok) throw new Error("Unable to load website settings.");
    const data = (await response.json()) as ContentData;
    setContent(data);
    setCompany({ ...emptyCompany, ...data.companyInfo });
    setHomepage({ ...emptyHomepage, ...data.homepage });
    return data;
  }

  useEffect(() => {
    void (async () => {
      try {
        const session = await fetch("/api/admin/session", { credentials: "include" });
        setAuthenticated(session.ok);
        if (session.ok) await loadContent();
      } catch {
        setAuthenticated(false);
      }
    })();
  }, []);

  const projects = useMemo(
    () => (content?.products || []).filter((item) => projectIds.includes(item.id)),
    [content]
  );

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to sign in.");
      setAuthenticated(true);
      await loadContent();
      setPassword("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    } finally {
      setSaving(false);
    }
  }

  async function save(action: string, data: unknown) {
    const response = await fetch("/api/content", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, data }),
    });
    const result = (await response.json()) as { success?: boolean; error?: string; db?: ContentData };
    if (!response.ok || !result.success || !result.db) {
      throw new Error(result.error || "Changes could not be saved to the database.");
    }
    setContent(result.db);
    return result.db;
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");

    if (
      !validUrl(company.websiteUrl) ||
      !validUrl(company.linkedinCompany) ||
      (company.linkedinLogoUrl && !validUrl(company.linkedinLogoUrl))
    ) {
      setError("Enter valid http:// or https:// URLs for the canonical website and LinkedIn fields.");
      return;
    }

    setSaving(true);
    try {
      await save("updateSettings", company);
      await save("saveHomepage", homepage);
      setNotice("Website settings saved successfully to database.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Changes could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  function editProject(id: string) {
    const record = projects.find((item) => item.id === id) || { id };
    setProject({
      id,
      name: record.name || id,
      description: record.description || "",
      url: record.url || "",
      status: record.status === "hidden" ? "hidden" : "published",
      sortOrder: Number(record.sortOrder || 1),
      projectStatus: record.projectStatus || record.tagline || "In Development",
    });
    setNotice("");
    setError("");
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project) return;
    setNotice("");
    setError("");

    if (!project.name.trim() || !project.description.trim()) {
      setError("Project name and short description are required.");
      return;
    }

    const trimmedUrl = project.url.trim();
    if (trimmedUrl && !validUrl(trimmedUrl)) {
      setError("Destination URL must be a valid http:// or https:// web address.");
      return;
    }

    setSaving(true);
    try {
      await save("saveProduct", {
        ...project,
        name: project.name.trim(),
        description: project.description.trim(),
        url: trimmedUrl,
        tagline: project.projectStatus.trim() || "In Development",
        projectStatus: project.projectStatus.trim() || "In Development",
      });
      setNotice(`Project "${project.name}" saved successfully to database.`);
      setProject(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Project could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
    setAuthenticated(false);
    setContent(null);
    setProject(null);
    setNotice("");
  }

  if (authenticated === null) return <div className="min-h-screen bg-[#040711]" />;

  if (!authenticated) {
    return (
      <div className="site-page">
        <Navigation />
        <main className="page-header-offset flex-1">
          <SiteContainer>
            <form onSubmit={login} className="surface-card mx-auto max-w-md p-6 sm:p-8">
              <Lock className="size-6 text-sky-300" aria-hidden="true" />
              <h1 className="mt-5 font-display text-2xl font-semibold text-white">Admin sign in</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Manage website settings and verified project cards.
              </p>
              <label className="mt-6 block text-sm text-slate-300">
                Passphrase
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-base mt-2"
                  autoComplete="current-password"
                />
              </label>
              {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
              <button disabled={saving} className="cta-primary mt-6 w-full">
                {saving ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </SiteContainer>
        </main>
      </div>
    );
  }

  return (
    <div className="site-page">
      <Navigation />
      <main className="page-header-offset flex-1">
        <SiteContainer>
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Administration</p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.04em] text-white">
                Website management
              </h1>
            </div>
            <button onClick={logout} className="cta-secondary w-fit">
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>

          {notice ? (
            <p className="mb-6 flex items-center gap-2 text-sm text-emerald-300">
              <CheckCircle2 className="size-4" />
              {notice}
            </p>
          ) : null}
          {error ? <p className="mb-6 text-sm text-rose-300">{error}</p> : null}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
            {/* General Settings */}
            <form onSubmit={saveSettings} className="space-y-8">
              <section>
                <p className="eyebrow">Website settings</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    Website name
                    <input
                      required
                      value={company.name}
                      onChange={(event) => setCompany({ ...company, name: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    Tagline
                    <input
                      required
                      value={company.tagline}
                      onChange={(event) => setCompany({ ...company, tagline: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>
                  <label className="text-sm text-slate-300 sm:col-span-2">
                    Canonical website URL
                    <input
                      required
                      type="url"
                      value={company.websiteUrl}
                      onChange={(event) => setCompany({ ...company, websiteUrl: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>
                </div>
              </section>

              <section>
                <p className="eyebrow">LinkedIn integration</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Manual company-profile configuration is active. No LinkedIn API credentials required.
                </p>
                <div className="mt-5 space-y-5">
                  <label className="flex min-h-11 items-center gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={company.linkedinEnabled}
                      onChange={(event) => setCompany({ ...company, linkedinEnabled: event.target.checked })}
                    />
                    Show official LinkedIn link on the public website
                  </label>
                  <label className="block text-sm text-slate-300">
                    Official company page URL
                    <input
                      required
                      type="url"
                      value={company.linkedinCompany}
                      onChange={(event) => setCompany({ ...company, linkedinCompany: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Company description override <span className="text-slate-500">(optional)</span>
                    <textarea
                      value={company.linkedinDescription}
                      onChange={(event) => setCompany({ ...company, linkedinDescription: event.target.value })}
                      className="textarea-base mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Company logo URL <span className="text-slate-500">(optional)</span>
                    <input
                      type="url"
                      value={company.linkedinLogoUrl}
                      onChange={(event) => setCompany({ ...company, linkedinLogoUrl: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>
                </div>
              </section>

              <section>
                <p className="eyebrow">Homepage content</p>
                <div className="mt-5 space-y-5">
                  <label className="block text-sm text-slate-300">
                    Headline
                    <input
                      required
                      value={homepage.heroHeading}
                      onChange={(event) => setHomepage({ ...homepage, heroHeading: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Hero description
                    <textarea
                      required
                      value={homepage.heroSubheading}
                      onChange={(event) => setHomepage({ ...homepage, heroSubheading: event.target.value })}
                      className="textarea-base mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    About heading
                    <input
                      required
                      value={homepage.aboutHeading}
                      onChange={(event) => setHomepage({ ...homepage, aboutHeading: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    About description
                    <textarea
                      required
                      value={homepage.aboutText}
                      onChange={(event) => setHomepage({ ...homepage, aboutText: event.target.value })}
                      className="textarea-base mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Our purpose statement
                    <textarea
                      required
                      value={homepage.aboutPurpose}
                      onChange={(event) => setHomepage({ ...homepage, aboutPurpose: event.target.value })}
                      className="textarea-base mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Vision heading
                    <input
                      required
                      value={homepage.visionHeading}
                      onChange={(event) => setHomepage({ ...homepage, visionHeading: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Vision text
                    <textarea
                      required
                      value={homepage.visionText}
                      onChange={(event) => setHomepage({ ...homepage, visionText: event.target.value })}
                      className="textarea-base mt-2"
                    />
                  </label>
                </div>
              </section>

              <button disabled={saving} className="cta-primary">
                <Save className="size-4" />
                {saving ? "Saving…" : "Save changes"}
              </button>
            </form>

            {/* Project Management */}
            <aside className="lg:border-l lg:border-white/[0.08] lg:pl-8">
              <p className="eyebrow">Project management</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Select a project below to update its name, description, status badge, destination URL, or public visibility.
              </p>

              <div className="mt-5 space-y-2.5">
                {projectIds.map((id) => {
                  const item = projects.find((record) => record.id === id);
                  const isSelected = project?.id === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => editProject(id)}
                      className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                        isSelected
                          ? "border-sky-400 bg-sky-400/10 text-white"
                          : "border-white/[0.1] text-slate-200 hover:border-sky-300/50"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{item?.name || id}</p>
                        <p className="text-xs text-slate-400">
                          {item?.projectStatus || item?.tagline || "In Development"}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {item?.status === "hidden" ? "Hidden" : "Visible"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {project ? (
                <form onSubmit={saveProject} className="surface-card mt-6 space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{project.name || project.id}</p>
                      <p className="text-xs text-slate-400">Configure public card and destination link</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProject(null)}
                      className="text-slate-400 hover:text-white"
                      aria-label="Close edit form"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <label className="block text-sm text-slate-300">
                    Project name
                    <input
                      required
                      value={project.name}
                      onChange={(event) => setProject({ ...project, name: event.target.value })}
                      className="input-base mt-2"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Short description
                    <textarea
                      required
                      value={project.description}
                      onChange={(event) => setProject({ ...project, description: event.target.value })}
                      className="textarea-base mt-2"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Project status badge
                    <input
                      value={project.projectStatus}
                      onChange={(event) => setProject({ ...project, projectStatus: event.target.value })}
                      className="input-base mt-2"
                      placeholder="e.g. Active, In Development, Beta, Research"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Destination URL <span className="text-slate-500">(leave blank to hide button)</span>
                    <input
                      type="url"
                      value={project.url}
                      onChange={(event) => setProject({ ...project, url: event.target.value })}
                      className="input-base mt-2"
                      placeholder="https://example.com/project"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-slate-300">
                      Visibility
                      <select
                        value={project.status}
                        onChange={(event) =>
                          setProject({ ...project, status: event.target.value as ProjectForm["status"] })
                        }
                        className="input-base mt-2"
                      >
                        <option value="published">Published (Visible)</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </label>

                    <label className="text-sm text-slate-300">
                      Display order
                      <input
                        type="number"
                        min="1"
                        value={project.sortOrder}
                        onChange={(event) => setProject({ ...project, sortOrder: Number(event.target.value) })}
                        className="input-base mt-2"
                      />
                    </label>
                  </div>

                  <label className="flex min-h-11 items-center gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={project.status === "published"}
                      onChange={(event) =>
                        setProject({ ...project, status: event.target.checked ? "published" : "hidden" })
                      }
                    />
                    Visible on public website
                  </label>

                  <div className="flex gap-2 pt-2">
                    <button disabled={saving} className="cta-primary flex-1">
                      {saving ? "Saving…" : "Save project"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProject(null)}
                      className="cta-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </aside>
          </div>
        </SiteContainer>
      </main>
    </div>
  );
}
