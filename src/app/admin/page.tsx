"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { optimizeImage } from "@/lib/imageOptimizer";
import { 
  Settings as SettingsIcon, 
  ShoppingBag, 
  FileText, 
  FolderGit2, 
  Plus, 
  Check, 
  AlertCircle,
  Upload,
  Lock,
  RefreshCw,
  Compass,
  Search,
  Trash2,
  Copy,
  Briefcase,
  Mail,
  Home,
  BarChart3,
  Users,
  Wifi,
  WifiOff,
  Database,
  ServerCrash
} from "lucide-react";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [activeTab, setActiveTab] = useState("settings");
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form states
  const [companyForm, setCompanyForm] = useState<any>({});
  const [navForm, setNavForm] = useState<any[]>([]);
  const [seoForm, setSeoForm] = useState<any>({});
  
  // Products form state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState<any>({ id: "", name: "", tagline: "", description: "", features: "", dataFlow: "", url: "", status: "published" });

  // Blog post form states
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [postForm, setPostForm] = useState<any>({ slug: "", title: "", date: "", category: "Ecosystem Release", excerpt: "", content: "", tags: "", status: "published", seoTitle: "", seoDesc: "" });

  // Research form states
  const [selectedResearch, setSelectedResearch] = useState<any>(null);
  const [researchForm, setResearchForm] = useState<any>({ slug: "", title: "", field: "Cognitive Science", excerpt: "", content: "", author: "Viyaan Research Team", date: "", status: "published", pdfUrl: "" });

  // Lab form states
  const [selectedLab, setSelectedLab] = useState<any>(null);
  const [labForm, setLabForm] = useState<any>({ id: "", title: "", type: "UTILITY APPLICATION", statusText: "STABLE", description: "", tags: "", status: "published" });

  // Careers form state
  const [careersForm, setCareersForm] = useState<any>({ title: "", description: "", linkedinLink: "" });

  // Homepage hero form state
  const [homepageForm, setHomepageForm] = useState<any>({ heroHeading: "", heroSubheading: "", heroCta: "", heroCtaLink: "", heroSecondCta: "", heroSecondCtaLink: "" });

  // Analytics settings form state
  const [analyticsForm, setAnalyticsForm] = useState<any>({ gaTrackingId: "", enableAnalytics: false, cookieConsentEnabled: true, privacyPolicyUrl: "" });

  // Newsletter settings form state
  const [newsletterSettingsForm, setNewsletterSettingsForm] = useState<any>({ enabled: true, title: "", description: "" });

  // Newsletter subscribers list
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subscribersSearch, setSubscribersSearch] = useState("");

  // Media list & upload state
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");

  // Contacts CMS states
  const [contactList, setContactList] = useState<any[]>([]);
  const [contactsSearch, setContactsSearch] = useState("");
  const [contactsFilter, setContactsFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const [dbHealth, setDbHealth] = useState<any>(null);

  const fetchDbHealth = async () => {
    try {
      const res = await fetch("/api/db-status");
      if (res.ok) {
        const data = await res.json();
        setDbHealth(data);
      }
    } catch (e) {
      console.error("Fetch DB status error:", e);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setDb(data);
        setCompanyForm(data.companyInfo || {});
        setNavForm(data.navigation || []);
        setSeoForm(data.seo || {});
        setCareersForm(data.careers || {});
        setHomepageForm(data.homepage || { heroHeading: "Intelligence Beyond the Human Mind.", heroSubheading: "", heroCta: "Explore Our Ecosystem", heroCtaLink: "/products", heroSecondCta: "Read Research", heroSecondCtaLink: "/research" });
        setAnalyticsForm(data.analytics || { gaTrackingId: "", enableAnalytics: false, cookieConsentEnabled: true, privacyPolicyUrl: "/privacy" });
        setNewsletterSettingsForm(data.newsletter || { enabled: true, title: "", description: "" });
      }
    } catch (e) {
      console.error("Fetch content error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (e) {
      console.error("Fetch media error:", e);
    }
  };

  const fetchContacts = async (pass = password) => {
    try {
      const res = await fetch(`/api/contact?password=${encodeURIComponent(pass)}`);
      if (res.ok) {
        const data = await res.json();
        setContactList(data);
      }
    } catch (e) {
      console.error("Fetch contacts error:", e);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", id, status, password })
      });
      if (res.ok) {
        fetchContacts();
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
      }
    } catch (e) {
      console.error("Update contact status error:", e);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this contact message permanently?")) return;
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id, password })
      });
      if (res.ok) {
        fetchContacts();
        setSelectedContact(null);
      }
    } catch (e) {
      console.error("Delete contact error:", e);
    }
  };

  useEffect(() => {
    // Check session storage for login
    const storedPass = sessionStorage.getItem("viyaan_admin_token");
    if (storedPass === "viyaan2026") {
      setIsAuthenticated(true);
      setPassword(storedPass);
      fetchContacts(storedPass);
    }
    fetchContent();
    fetchMedia();
    fetchDbHealth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch(`/api/contact?password=${encodeURIComponent(password)}`);
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("viyaan_admin_token", password);
        const data = await res.json();
        setContactList(data);
        fetchContent();
        fetchMedia();
        fetchDbHealth();
        fetchSubscribers();
      } else {
        setError("Invalid passphrase credentials.");
      }
    } catch (err) {
      setError("Authorization connection failure.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("viyaan_admin_token");
    setPassword("");
  };

  const triggerSubmit = async (action: string, data: any) => {
    setError("");
    setSubmitSuccess(false);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data, password })
      });
      if (res.ok) {
        const result = await res.json();
        setDb(result.db);
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
        return true;
      } else {
        const errData = await res.json();
        setError(errData.error || "Save failure.");
        return false;
      }
    } catch (e) {
      setError("Connection failure.");
      return false;
    }
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit("updateSettings", companyForm);
  };

  const saveNavigation = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit("saveNavigation", navForm);
  };

  const saveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit("saveSEO", seoForm);
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      ...productForm,
      features: typeof productForm.features === "string" 
        ? productForm.features.split("\n").filter((f: string) => f.trim() !== "")
        : productForm.features
    };
    triggerSubmit("saveProduct", formatted).then((success) => {
      if (success) setSelectedProduct(null);
    });
  };

  const savePost = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      ...postForm,
      tags: typeof postForm.tags === "string" 
        ? postForm.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "")
        : postForm.tags
    };
    triggerSubmit("savePost", formatted).then((success) => {
      if (success) setSelectedPost(null);
    });
  };

  const saveResearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit("saveResearch", researchForm).then((success) => {
      if (success) setSelectedResearch(null);
    });
  };

  const saveLabProject = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      ...labForm,
      tags: typeof labForm.tags === "string" 
        ? labForm.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "")
        : labForm.tags
    };
    triggerSubmit("saveLabProject", formatted).then((success) => {
      if (success) setSelectedLab(null);
    });
  };

  const saveCareers = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit("saveCareers", careersForm);
  };

  const saveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit("saveHomepage", homepageForm);
  };

  const saveAnalytics = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit("saveAnalytics", analyticsForm);
  };

  const saveNewsletterSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit("saveNewsletterSettings", newsletterSettingsForm);
  };

  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`/api/newsletter?password=${encodeURIComponent(password)}`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Fetch subscribers error:", e);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Remove this subscriber permanently?")) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      if (res.ok) fetchSubscribers();
    } catch (e) {
      console.error("Delete subscriber error:", e);
    }
  };

  const deleteItem = (type: string, id: string) => {
    if (confirm(`Confirm deletion of this ${type}?`)) {
      triggerSubmit("deleteItem", { type, id });
    }
  };

  const syncLinkedInPost = (post: any) => {
    triggerSubmit("syncLinkedIn", post);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    setUploadedUrl("");
    
    try {
      // 1. Client-side canvas compression/optimization
      const optimizedFile = await optimizeImage(uploadFile, 1200, 1200, 0.85);

      // 2. Upload
      const formData = new FormData();
      formData.append("file", optimizedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        setUploadedUrl(result.url);
        setUploadFile(null);
        fetchMedia(); // Refresh media gallery
      } else {
        setError("File upload failed.");
      }
    } catch (e) {
      setError("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (filename: string, sha: string | null) => {
    if (!confirm(`Delete media asset "${filename}" permanently?`)) return;
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, sha, password })
      });
      if (res.ok) {
        fetchMedia(); // Refresh gallery
      } else {
        alert("Failed to delete media asset");
      }
    } catch (err) {
      alert("Error deleting asset");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(""), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col justify-center items-center px-6">
        <div className="max-w-md w-full border border-neutral-900 bg-neutral-950 p-8 rounded-2xl blueprint-grid flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl text-viyaan-cyan">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display font-semibold text-lg text-white">Viyaan AI CMS Portal</h1>
            <p className="text-[10px] text-neutral-500 font-mono">AUTHORIZED ADMINISTRATORS ONLY</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-neutral-500 uppercase">Admin Passphrase</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-950 border border-neutral-900 focus:border-neutral-800 outline-none rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-850" 
                placeholder="Enter passphrase"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <button 
              type="submit" 
              className="bg-white text-black hover:bg-neutral-255 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-11 rounded-lg flex items-center justify-center cursor-pointer"
            >
              Authenticate Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden">
      <Navigation />

      <section className="relative pt-32 pb-20 px-6 md:px-12 blueprint-dots">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-900 pb-6">
            <div>
              <span className="text-[10px] text-viyaan-cyan font-mono tracking-widest uppercase">
                PRODUCTION DATABASE CMS
              </span>
              <h1 className="font-display font-bold text-3xl text-white mt-1">
                Admin Console
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {submitSuccess && (
                <div className="flex items-center gap-2 text-xs text-viyaan-cyan font-mono bg-viyaan-cyan/10 border border-viyaan-cyan/20 px-3 py-1.5 rounded-lg">
                  <Check className="w-4 h-4" />
                  <span>Updates committed successfully</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-450 font-mono bg-red-450/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              <button 
                onClick={handleLogout}
                className="text-[10px] font-mono text-neutral-500 hover:text-white border border-neutral-900 bg-neutral-950 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
          {/* DB Health Status Banner */}
          {dbHealth && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-mono mb-2 ${
              dbHealth.status === "production"
                ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                : dbHealth.status === "migration_needed"
                ? "bg-amber-950/30 border-amber-900/50 text-amber-400"
                : dbHealth.status === "error"
                ? "bg-red-950/30 border-red-900/50 text-red-400"
                : "bg-neutral-900/60 border-neutral-800 text-neutral-400"
            }`}>
              {dbHealth.status === "production" ? (
                <Wifi className="w-4 h-4 flex-shrink-0" />
              ) : dbHealth.status === "migration_needed" ? (
                <Database className="w-4 h-4 flex-shrink-0" />
              ) : dbHealth.status === "error" ? (
                <ServerCrash className="w-4 h-4 flex-shrink-0" />
              ) : (
                <WifiOff className="w-4 h-4 flex-shrink-0" />
              )}
              <div className="flex-1">
                <span className="uppercase tracking-widest text-[9px] font-bold mr-2">
                  {dbHealth.status === "production" ? "SUPABASE CONNECTED" 
                    : dbHealth.status === "migration_needed" ? "MIGRATION REQUIRED" 
                    : dbHealth.status === "error" ? "CONNECTION ERROR" 
                    : "LOCAL JSON MODE"}
                </span>
                <span className="text-[10px] opacity-80">{dbHealth.message}</span>
              </div>
              <button
                onClick={fetchDbHealth}
                className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
                title="Refresh status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 flex flex-col gap-2 bg-neutral-950/40 border border-neutral-900 p-4 rounded-xl">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest px-3 mb-2 block">CMS Settings</span>
              
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "settings" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Company Info</span>
              </button>

              <button 
                onClick={() => setActiveTab("navigation")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "navigation" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <Compass className="w-4 h-4" />
                <span>Navbar Editor</span>
              </button>

              <button 
                onClick={() => setActiveTab("seo")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "seo" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <Search className="w-4 h-4" />
                <span>SEO Metadata</span>
              </button>

              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest px-3 my-2 block">CMS Content</span>

              <button 
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "products" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Products Suite</span>
              </button>

              <button 
                onClick={() => setActiveTab("blog")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "blog" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <FileText className="w-4 h-4" />
                <span>Blog Articles</span>
              </button>

              <button 
                onClick={() => setActiveTab("research")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "research" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <FileText className="w-4 h-4" />
                <span>Research Papers</span>
              </button>

              <button 
                onClick={() => setActiveTab("lab")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "lab" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Innovation Lab</span>
              </button>

              <button 
                onClick={() => setActiveTab("linkedin")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "linkedin" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn Sync</span>
              </button>

              <button 
                onClick={() => setActiveTab("media")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "media" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <Upload className="w-4 h-4" />
                <span>Media Manager</span>
              </button>

              <button 
                onClick={() => setActiveTab("contacts")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "contacts" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <FileText className="w-4 h-4" />
                <span>Contact Inquiries</span>
              </button>

              <button 
                onClick={() => { setActiveTab("newsletter"); fetchSubscribers(); }}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "newsletter" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <Mail className="w-4 h-4" />
                <span>Newsletter</span>
              </button>

              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest px-3 my-2 block">CMS Editing</span>

              <button 
                onClick={() => setActiveTab("homepage")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "homepage" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <Home className="w-4 h-4" />
                <span>Homepage Hero</span>
              </button>

              <button 
                onClick={() => setActiveTab("careers")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "careers" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Careers</span>
              </button>

              <button 
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "analytics" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </div>

            {/* Core Panels */}
            <div className="lg:col-span-9 bg-neutral-950/20 border border-neutral-900 rounded-xl p-6 md:p-8 min-h-[400px]">
              
              {/* Tab: Settings */}
              {activeTab === "settings" && db && (
                <form onSubmit={saveSettings} className="flex flex-col gap-5">
                  <h3 className="font-display font-semibold text-lg text-white">Global Settings</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Brand Name</label>
                      <input 
                        type="text" 
                        value={companyForm.name || ""} 
                        onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                        className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Tagline</label>
                      <input 
                        type="text" 
                        value={companyForm.tagline || ""} 
                        onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                        className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Core Description</label>
                    <textarea 
                      rows={4}
                      value={companyForm.description || ""} 
                      onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                      className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Contact Email</label>
                      <input 
                        type="email" 
                        value={companyForm.email || ""} 
                        onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                        className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Location</label>
                      <input 
                        type="text" 
                        value={companyForm.location || ""} 
                        onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                        className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Response SLA</label>
                      <input 
                        type="text" 
                        value={companyForm.responseTime || ""} 
                        onChange={(e) => setCompanyForm({ ...companyForm, responseTime: e.target.value })}
                        className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                      />
                    </div>
                  </div>

                  {/* Founder Profile Image Uploader */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Founder Profile Image</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-neutral-900 bg-neutral-950/40 p-4 rounded-xl">
                      {companyForm.founderImage && (
                        <div className="relative w-16 h-20 border border-neutral-850 rounded overflow-hidden flex-shrink-0 bg-neutral-900">
                          <img 
                            src={companyForm.founderImage} 
                            alt="Founder Preview" 
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-2">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const optimized = await optimizeImage(file, 600, 800, 0.85);
                              const formData = new FormData();
                              formData.append("file", optimized);
                              const res = await fetch("/api/upload", {
                                method: "POST",
                                body: formData
                              });
                              if (res.ok) {
                                const result = await res.json();
                                setCompanyForm({ ...companyForm, founderImage: result.url });
                              } else {
                                alert("Image upload failed");
                              }
                            } catch (err) {
                              alert("Error uploading image");
                            }
                          }}
                          className="text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-mono file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 file:cursor-pointer"
                        />
                        <span className="text-[9px] text-neutral-500 font-mono">Accepts JPEG, PNG or WebP (auto-optimized). Click 'Save Settings' to apply.</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Save Settings</span>
                  </button>
                </form>
              )}

              {/* Tab: Navbar Editor */}
              {activeTab === "navigation" && db && (
                <form onSubmit={saveNavigation} className="flex flex-col gap-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-semibold text-lg text-white">Navigation Menu Editor</h3>
                    <button 
                      type="button" 
                      onClick={() => setNavForm([...navForm, { label: "New Item", href: "/new-path" }])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-[10px] font-mono uppercase tracking-wider text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Menu Item</span>
                    </button>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed font-sans -mt-2">
                    Customize the global navigation menu. Note that deleting default pages (/products, /research, /lab, /founder) from navigation removes their navbar link, but does not delete the route itself.
                  </p>

                  <div className="flex flex-col gap-3">
                    {navForm.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-neutral-950/40 border border-neutral-900 p-3 rounded-lg">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-neutral-500 uppercase">Label</label>
                            <input 
                              type="text" 
                              required
                              value={item.label}
                              onChange={(e) => {
                                const copy = [...navForm];
                                copy[index].label = e.target.value;
                                setNavForm(copy);
                              }}
                              className="bg-neutral-950 border border-neutral-900 px-3 py-1.5 text-xs text-white rounded-lg outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-neutral-500 uppercase">Route Path</label>
                            <input 
                              type="text" 
                              required
                              value={item.href}
                              onChange={(e) => {
                                const copy = [...navForm];
                                copy[index].href = e.target.value;
                                setNavForm(copy);
                              }}
                              className="bg-neutral-950 border border-neutral-900 px-3 py-1.5 text-xs text-white rounded-lg outline-none"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNavForm(navForm.filter((_, idx) => idx !== index));
                          }}
                          className="text-red-400 hover:text-red-300 p-2 mt-4"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="submit" 
                    className="bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Save Navigation Menu</span>
                  </button>
                </form>
              )}

              {/* Tab: SEO Metadata */}
              {activeTab === "seo" && db && (
                <form onSubmit={saveSEO} className="flex flex-col gap-5">
                  <h3 className="font-display font-semibold text-lg text-white">SEO Metadata Manager</h3>
                  <p className="text-xs text-neutral-500 font-sans -mt-2">Configure dynamic HTML headers & descriptions for indexing bots.</p>

                  <div className="flex flex-col gap-6">
                    {Object.keys(seoForm).map((pageKey) => (
                      <div key={pageKey} className="border border-neutral-900 bg-neutral-950/40 p-4 rounded-xl flex flex-col gap-3">
                        <span className="text-[10px] font-mono text-viyaan-cyan uppercase tracking-wider block font-bold">{pageKey.toUpperCase()} PAGE</span>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-mono text-neutral-500 uppercase">Meta Title Tag</label>
                          <input 
                            type="text" 
                            required
                            value={seoForm[pageKey]?.title || ""} 
                            onChange={(e) => {
                              const copy = { ...seoForm };
                              copy[pageKey] = { ...copy[pageKey], title: e.target.value };
                              setSeoForm(copy);
                            }}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-mono text-neutral-500 uppercase">Meta Description Tag</label>
                          <textarea 
                            rows={2}
                            required
                            value={seoForm[pageKey]?.description || ""} 
                            onChange={(e) => {
                              const copy = { ...seoForm };
                              copy[pageKey] = { ...copy[pageKey], description: e.target.value };
                              setSeoForm(copy);
                            }}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="submit" 
                    className="bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Save SEO Configuration</span>
                  </button>
                </form>
              )}

              {/* Tab: Products */}
              {activeTab === "products" && db && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-semibold text-lg text-white">Ecosystem Products</h3>
                    <button 
                      onClick={() => {
                        setSelectedProduct("new");
                        setProductForm({ id: `prod-${Date.now()}`, name: "", tagline: "", description: "", features: "", dataFlow: "", url: "", status: "published" });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-[10px] font-mono uppercase tracking-wider text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {selectedProduct ? (
                    <form onSubmit={saveProduct} className="flex flex-col gap-4 border border-neutral-900 p-4 rounded-lg bg-neutral-950/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Product ID</label>
                          <input 
                            type="text" 
                            required
                            value={productForm.id} 
                            disabled={selectedProduct !== "new"}
                            onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none disabled:text-neutral-600" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Product Name</label>
                          <input 
                            type="text" 
                            required
                            value={productForm.name} 
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase">Tagline</label>
                        <input 
                          type="text" 
                          value={productForm.tagline} 
                          onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                          className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase">Description</label>
                        <textarea 
                          rows={3}
                          value={productForm.description} 
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none" 
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase">Features (one per line)</label>
                        <textarea 
                          rows={3}
                          value={productForm.features} 
                          onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                          className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none" 
                          placeholder="Adaptive logic&#10;Offline cache"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Launch URL</label>
                          <input 
                            type="url" 
                            value={productForm.url} 
                            onChange={(e) => setProductForm({ ...productForm, url: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Ecosystem Role / Dataflow</label>
                          <input 
                            type="text" 
                            value={productForm.dataFlow} 
                            onChange={(e) => setProductForm({ ...productForm, dataFlow: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button type="submit" className="bg-white text-black text-xs font-mono uppercase px-4 h-9 rounded-lg font-semibold cursor-pointer">Save</button>
                        <button type="button" onClick={() => setSelectedProduct(null)} className="border border-neutral-850 text-neutral-400 hover:text-white text-xs font-mono uppercase px-4 h-9 rounded-lg cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {db.products.map((p: any) => (
                        <div key={p.id} className="border border-neutral-900 bg-neutral-950/60 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-display font-semibold text-sm text-white">{p.name}</h4>
                            <p className="text-[10px] font-mono text-neutral-500">{p.tagline}</p>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                setSelectedProduct(p.id);
                                setProductForm({ ...p, features: p.features.join("\n") });
                              }}
                              className="text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteItem("product", p.id)}
                              className="text-xs font-mono text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Blog */}
              {activeTab === "blog" && db && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-semibold text-lg text-white">Blog Articles</h3>
                    <button 
                      onClick={() => {
                        setSelectedPost("new");
                        setPostForm({ slug: `post-${Date.now()}`, title: "", date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), category: "Ecosystem Release", excerpt: "", content: "", tags: "", status: "published", seoTitle: "", seoDesc: "" });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-[10px] font-mono uppercase tracking-wider text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Article</span>
                    </button>
                  </div>

                  {selectedPost ? (
                    <form onSubmit={savePost} className="flex flex-col gap-4 border border-neutral-900 p-4 rounded-lg bg-neutral-950/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Slug (URL identifier)</label>
                          <input 
                            type="text" 
                            required
                            value={postForm.slug} 
                            disabled={selectedPost !== "new"}
                            onChange={(e) => setPostForm({ ...postForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none disabled:text-neutral-600" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Article Title</label>
                          <input 
                            type="text" 
                            required
                            value={postForm.title} 
                            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Category</label>
                          <select 
                            value={postForm.category}
                            onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none"
                          >
                            <option value="Ecosystem Release">Ecosystem Release</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Philosophy">Philosophy</option>
                            <option value="Updates">Updates</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Date</label>
                          <input 
                            type="text" 
                            required
                            value={postForm.date} 
                            onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Tags (comma-separated)</label>
                          <input 
                            type="text" 
                            value={postForm.tags} 
                            onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                            placeholder="AI, UX, release"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase">Short Excerpt (Teaser text)</label>
                        <input 
                          type="text" 
                          required
                          value={postForm.excerpt} 
                          onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                          className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase">Content (Markdown supported)</label>
                        <textarea 
                          rows={6}
                          required
                          value={postForm.content} 
                          onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                          className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none font-mono" 
                        />
                      </div>

                      <div className="border-t border-neutral-900 pt-4 flex flex-col gap-3">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase">Article SEO Settings</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-mono text-neutral-500 uppercase">SEO Title Tag</label>
                            <input 
                              type="text" 
                              value={postForm.seoTitle || ""} 
                              onChange={(e) => setPostForm({ ...postForm, seoTitle: e.target.value })}
                              className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-mono text-neutral-500 uppercase">SEO Description Tag</label>
                            <input 
                              type="text" 
                              value={postForm.seoDesc || ""} 
                              onChange={(e) => setPostForm({ ...postForm, seoDesc: e.target.value })}
                              className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button type="submit" className="bg-white text-black text-xs font-mono uppercase px-4 h-9 rounded-lg font-semibold cursor-pointer">Save Article</button>
                        <button type="button" onClick={() => setSelectedPost(null)} className="border border-neutral-850 text-neutral-400 hover:text-white text-xs font-mono uppercase px-4 h-9 rounded-lg cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {db.posts && db.posts.length > 0 ? (
                        db.posts.map((post: any) => (
                          <div key={post.slug} className="border border-neutral-900 bg-neutral-950/60 p-4 rounded-xl flex justify-between items-center">
                            <div>
                              <span className="text-[9px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded mr-3 uppercase">{post.category}</span>
                              <h4 className="font-display font-semibold text-sm text-white inline">{post.title}</h4>
                              <p className="text-[10px] font-mono text-neutral-500 mt-1">Slug: /blog/{post.slug} // {post.date}</p>
                            </div>
                            <div className="flex gap-3">
                              <button 
                                onClick={() => {
                                  setSelectedPost(post.slug);
                                  setPostForm({ ...post, tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags });
                                }}
                                className="text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteItem("post", post.slug)}
                                className="text-xs font-mono text-red-400 hover:text-red-300 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 border border-neutral-900 rounded-xl bg-neutral-950/20 text-neutral-500 text-xs">
                          No blog articles published. Create one above.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Research */}
              {activeTab === "research" && db && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-semibold text-lg text-white">Research Papers</h3>
                    <button 
                      onClick={() => {
                        setSelectedResearch("new");
                        setResearchForm({ slug: `paper-${Date.now()}`, title: "", field: "Cognitive Science", excerpt: "", content: "", author: "Viyaan Research Team", date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), status: "published", pdfUrl: "" });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-[10px] font-mono uppercase tracking-wider text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Research Record</span>
                    </button>
                  </div>

                  {selectedResearch ? (
                    <form onSubmit={saveResearch} className="flex flex-col gap-4 border border-neutral-900 p-4 rounded-lg bg-neutral-950/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Slug</label>
                          <input 
                            type="text" 
                            required
                            value={researchForm.slug} 
                            disabled={selectedResearch !== "new"}
                            onChange={(e) => setResearchForm({ ...researchForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none disabled:text-neutral-600" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Paper Title</label>
                          <input 
                            type="text" 
                            required
                            value={researchForm.title} 
                            onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Academic Field</label>
                          <input 
                            type="text" 
                            required
                            value={researchForm.field} 
                            onChange={(e) => setResearchForm({ ...researchForm, field: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Author(s)</label>
                          <input 
                            type="text" 
                            required
                            value={researchForm.author} 
                            onChange={(e) => setResearchForm({ ...researchForm, author: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Publication Date</label>
                          <input 
                            type="text" 
                            required
                            value={researchForm.date} 
                            onChange={(e) => setResearchForm({ ...researchForm, date: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">PDF Url (Optional)</label>
                          <input 
                            type="text" 
                            value={researchForm.pdfUrl || ""} 
                            onChange={(e) => setResearchForm({ ...researchForm, pdfUrl: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                            placeholder="/uploads/paper.pdf"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase">Short Excerpt (Summary)</label>
                        <input 
                          type="text" 
                          required
                          value={researchForm.excerpt} 
                          onChange={(e) => setResearchForm({ ...researchForm, excerpt: e.target.value })}
                          className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase">Abstract / Extended Context</label>
                        <textarea 
                          rows={4}
                          required
                          value={researchForm.content} 
                          onChange={(e) => setResearchForm({ ...researchForm, content: e.target.value })}
                          className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none font-mono" 
                        />
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button type="submit" className="bg-white text-black text-xs font-mono uppercase px-4 h-9 rounded-lg font-semibold cursor-pointer">Save</button>
                        <button type="button" onClick={() => setSelectedResearch(null)} className="border border-neutral-850 text-neutral-400 hover:text-white text-xs font-mono uppercase px-4 h-9 rounded-lg cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {db.research.map((r: any) => (
                        <div key={r.slug} className="border border-neutral-900 bg-neutral-950/60 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="text-[9px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded mr-3 uppercase">{r.field}</span>
                            <h4 className="font-display font-semibold text-sm text-white inline">{r.title}</h4>
                            <p className="text-[10px] font-mono text-neutral-500 mt-1">Author: {r.author} // {r.date}</p>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                setSelectedResearch(r.slug);
                                setResearchForm(r);
                              }}
                              className="text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteItem("research", r.slug)}
                              className="text-xs font-mono text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Lab */}
              {activeTab === "lab" && db && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-semibold text-lg text-white">Innovation Projects</h3>
                    <button 
                      onClick={() => {
                        setSelectedLab("new");
                        setLabForm({ id: `lab-${Date.now()}`, title: "", type: "UTILITY APPLICATION", statusText: "STABLE", description: "", tags: "", status: "published" });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-[10px] font-mono uppercase tracking-wider text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  {selectedLab ? (
                    <form onSubmit={saveLabProject} className="flex flex-col gap-4 border border-neutral-900 p-4 rounded-lg bg-neutral-950/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Project ID</label>
                          <input 
                            type="text" 
                            required
                            value={labForm.id} 
                            disabled={selectedLab !== "new"}
                            onChange={(e) => setLabForm({ ...labForm, id: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none disabled:text-neutral-600" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Project Title</label>
                          <input 
                            type="text" 
                            required
                            value={labForm.title} 
                            onChange={(e) => setLabForm({ ...labForm, title: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Type Tag</label>
                          <input 
                            type="text" 
                            value={labForm.type} 
                            onChange={(e) => setLabForm({ ...labForm, type: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Status text</label>
                          <input 
                            type="text" 
                            value={labForm.statusText} 
                            onChange={(e) => setLabForm({ ...labForm, statusText: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase">Tags (comma separated)</label>
                          <input 
                            type="text" 
                            value={labForm.tags} 
                            onChange={(e) => setLabForm({ ...labForm, tags: e.target.value })}
                            className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase">Description</label>
                        <textarea 
                          rows={4}
                          value={labForm.description} 
                          onChange={(e) => setLabForm({ ...labForm, description: e.target.value })}
                          className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none" 
                        />
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button type="submit" className="bg-white text-black text-xs font-mono uppercase px-4 h-9 rounded-lg font-semibold cursor-pointer">Save</button>
                        <button type="button" onClick={() => setSelectedLab(null)} className="border border-neutral-850 text-neutral-400 hover:text-white text-xs font-mono uppercase px-4 h-9 rounded-lg cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {db.labProjects.map((l: any) => (
                        <div key={l.id} className="border border-neutral-900 bg-neutral-950/60 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="text-[9px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded mr-3 uppercase">{l.type}</span>
                            <h4 className="font-display font-semibold text-sm text-white inline">{l.title}</h4>
                            <p className="text-[10px] font-mono text-viyaan-cyan mt-1">Status: {l.statusText}</p>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                setSelectedLab(l.id);
                                setLabForm({ ...l, tags: l.tags.join(", ") });
                              }}
                              className="text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteItem("lab", l.id)}
                              className="text-xs font-mono text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: LinkedIn Sync */}
              {activeTab === "linkedin" && db && (
                <div className="flex flex-col gap-6">
                  <h3 className="font-display font-semibold text-lg text-white">LinkedIn Sync Hub</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                    Synchronize recent announcements directly from Viyaan AI profiles into the blog feed with manual editorial oversight.
                  </p>

                  <div className="flex flex-col gap-4">
                    {db.linkedinSync && db.linkedinSync.map((sync: any) => (
                      <div 
                        key={sync.id} 
                        className={`border p-5 rounded-xl flex flex-col gap-3 bg-neutral-950/50 ${
                          sync.synced ? "border-neutral-900 opacity-60" : "border-neutral-800"
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-white font-medium">{sync.author}</span>
                          <span className="text-neutral-500">{sync.date}</span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed font-sans">{sync.text}</p>
                        
                        <div className="flex justify-between items-center border-t border-neutral-900 pt-3 mt-1 text-[10px] font-mono">
                          <span className="text-neutral-500">CATEGORY: {sync.category}</span>
                          <div className="flex gap-4">
                            {sync.synced ? (
                              <span className="text-viyaan-cyan flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>SYNCED TO BLOG</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => syncLinkedInPost(sync)}
                                className="text-viyaan-cyan hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                                <span>SYNC TO SITE</span>
                              </button>
                            )}
                            <a 
                              href={sync.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-neutral-400 hover:text-white"
                            >
                              VIEW POST
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Media Manager */}
              {activeTab === "media" && (
                <div className="flex flex-col gap-6">
                  <h3 className="font-display font-semibold text-lg text-white">Media Library Manager</h3>
                  <p className="text-xs text-neutral-500 font-sans -mt-2">Upload and manage assets dynamically. Images are compressed client-side to WebP to guarantee peak loading speeds.</p>

                  <form onSubmit={handleFileUpload} className="flex flex-col gap-4">
                    <div className="border-2 border-dashed border-neutral-900 hover:border-neutral-800 bg-neutral-950/40 p-10 rounded-xl flex flex-col items-center justify-center text-center gap-4 transition-colors">
                      <div className="p-3.5 rounded-full bg-neutral-900 border border-neutral-850 text-neutral-500">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-white block mb-1">Select media asset</span>
                        <span className="text-[10px] text-neutral-500 font-mono">PNG, JPG, SVG, OR PDF UP TO 10MB</span>
                      </div>
                      <input 
                        type="file" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setUploadFile(e.target.files[0]);
                            setUploadedUrl("");
                          }
                        }}
                        className="text-xs text-neutral-400 border border-neutral-900 p-2 rounded bg-neutral-950 cursor-pointer w-full max-w-xs focus:outline-none" 
                      />
                    </div>

                    {uploadFile && (
                      <button 
                        type="submit" 
                        disabled={uploading}
                        className="bg-white text-black hover:bg-neutral-222 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer max-w-xs disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Optimizing & Uploading...</span>
                          </>
                        ) : (
                          <span>Compress & Upload Asset</span>
                        )}
                      </button>
                    )}
                  </form>

                  {uploadedUrl && (
                    <div className="border border-neutral-900 bg-neutral-950/60 p-4 rounded-xl flex flex-col gap-2 font-mono text-xs">
                      <span className="text-[10px] text-viyaan-cyan uppercase tracking-wider block">Uploaded URL</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          readOnly
                          value={uploadedUrl} 
                          className="flex-1 bg-neutral-950 border border-neutral-900 p-2 rounded outline-none text-white select-all text-xs text-center font-mono" 
                        />
                        <button 
                          onClick={() => copyToClipboard(uploadedUrl)} 
                          className="bg-neutral-900 hover:bg-neutral-850 p-2 border border-neutral-800 rounded-lg text-white"
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Media Gallery Grid */}
                  <div className="border-t border-neutral-900 pt-6 flex flex-col gap-4">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Uploaded Assets Library</span>
                    
                    {mediaList.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {mediaList.map((media) => {
                          const isImage = /\.(webp|jpg|jpeg|png|gif|svg)$/i.test(media.name);
                          return (
                            <div key={media.name} className="group relative border border-neutral-900 bg-neutral-950 p-3 rounded-xl flex flex-col gap-3 hover:border-neutral-800 transition-colors">
                              {/* Preview Area */}
                              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative bg-neutral-900 border border-neutral-950 flex items-center justify-center">
                                {isImage ? (
                                  <img 
                                    src={media.url} 
                                    alt={media.name} 
                                    className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                ) : (
                                  <FileText className="w-8 h-8 text-neutral-600" />
                                )}
                              </div>

                              {/* Asset Info */}
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-[10px] font-semibold text-white truncate block font-mono" title={media.name}>
                                  {media.name}
                                </span>
                                <span className="text-[9px] text-neutral-500 font-mono">
                                  {(media.size / 1024).toFixed(1)} KB
                                </span>
                              </div>

                              {/* Action Overlay */}
                              <div className="flex items-center justify-between border-t border-neutral-900 pt-2 mt-1">
                                <button
                                  onClick={() => copyToClipboard(media.url)}
                                  className="text-[10px] font-mono text-neutral-450 hover:text-white flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedUrl === media.url ? (
                                    <>
                                      <Check className="w-3 h-3 text-viyaan-cyan" />
                                      <span className="text-viyaan-cyan font-bold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy URL</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => deleteMedia(media.name, media.sha)}
                                  className="text-[10px] font-mono text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-neutral-900 rounded-xl bg-neutral-950/20 text-neutral-500 text-xs">
                        No assets in media library. Upload an asset above.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Contact Inquiries */}
              {activeTab === "contacts" && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <h3 className="font-display font-semibold text-lg text-white">Contact Messages Inquiries</h3>
                    <button 
                      onClick={() => fetchContacts()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-[10px] font-mono uppercase tracking-wider text-white"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-neutral-900 pb-5">
                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                      {["all", "unread", "read", "replied"].map((statusOpt) => (
                        <button
                          key={statusOpt}
                          onClick={() => setContactsFilter(statusOpt)}
                          className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                            contactsFilter === statusOpt
                              ? "bg-white text-black border-white"
                              : "bg-transparent text-neutral-400 border-neutral-900 hover:border-neutral-800 hover:text-white"
                          }`}
                        >
                          {statusOpt.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div className="w-full sm:w-64 relative font-mono text-xs">
                      <input
                        type="text"
                        value={contactsSearch}
                        onChange={(e) => setContactsSearch(e.target.value)}
                        placeholder="Search inquiries..."
                        className="w-full bg-neutral-950 border border-neutral-900 focus:border-neutral-700 outline-none rounded-lg px-3 py-2 text-white placeholder-neutral-750"
                      />
                    </div>
                  </div>

                  {/* Messages Feed & Detail Split View */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Messages List */}
                    <div className="lg:col-span-7 flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
                      {(() => {
                        const filtered = contactList.filter((m) => {
                          const matchesSearch = 
                            m.name.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                            m.email.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                            m.message.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                            (m.subject && m.subject.toLowerCase().includes(contactsSearch.toLowerCase())) ||
                            (m.company && m.company.toLowerCase().includes(contactsSearch.toLowerCase()));
                            
                          const matchesStatus = contactsFilter === "all" || m.status === contactsFilter;
                          return matchesSearch && matchesStatus;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-12 border border-neutral-900 rounded-xl bg-neutral-950/20 text-neutral-500 text-xs font-mono">
                              No inquiries found.
                            </div>
                          );
                        }

                        return filtered.map((m) => {
                          const isUnread = m.status === "unread";
                          const isReplied = m.status === "replied";
                          return (
                            <div
                              key={m.id}
                              onClick={() => {
                                setSelectedContact(m);
                                if (m.status === "unread") {
                                  updateContactStatus(m.id, "read");
                                }
                              }}
                              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                                selectedContact?.id === m.id
                                  ? "bg-neutral-900/60 border-neutral-700"
                                  : "bg-neutral-950/40 border-neutral-900 hover:border-neutral-850"
                              }`}
                            >
                              <div className="flex justify-between items-center gap-2 mb-1.5">
                                <span className={`text-[10px] font-mono uppercase font-semibold ${
                                  isUnread ? "text-viyaan-cyan font-bold" : isReplied ? "text-neutral-500" : "text-neutral-350"
                                }`}>
                                  {m.status}
                                </span>
                                <span className="text-[9px] font-mono text-neutral-600">
                                  {m.created_at ? new Date(m.created_at).toLocaleString() : "Unknown"}
                                </span>
                              </div>
                              <h4 className={`text-xs font-display font-semibold truncate ${isUnread ? "text-white font-bold" : "text-neutral-300"}`}>
                                {m.subject || "No Subject"}
                              </h4>
                              <p className="text-[10px] font-mono text-neutral-450 truncate mt-1">
                                {m.name} · {m.email}
                              </p>
                              {m.company && (
                                <p className="text-[9px] font-mono text-neutral-550 truncate">
                                  {m.company}
                                </p>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Right Column: Message Details Viewer */}
                    <div className="lg:col-span-5 border border-neutral-900 bg-neutral-950/20 p-5 rounded-xl min-h-[300px] flex flex-col justify-between">
                      {selectedContact ? (
                        <div className="flex flex-col gap-4 text-left">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-900 pb-3">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">INQUIRY DETAIL</span>
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                              selectedContact.status === "unread"
                                ? "text-viyaan-cyan border-viyaan-cyan/30 bg-viyaan-cyan/5"
                                : selectedContact.status === "replied"
                                ? "text-neutral-500 border-neutral-800"
                                : "text-white border-neutral-700 bg-neutral-900"
                            }`}>
                              {selectedContact.status}
                            </span>
                          </div>

                          <div className="flex flex-col gap-3 font-sans text-xs">
                            <div>
                              <span className="text-[9px] font-mono text-neutral-500 block">SUBJECT</span>
                              <span className="font-display font-semibold text-white text-sm">{selectedContact.subject || "No Subject"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-[9px] font-mono text-neutral-500 block">NAME</span>
                                <span className="text-white font-medium">{selectedContact.name}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-mono text-neutral-500 block">EMAIL</span>
                                <a href={`mailto:${selectedContact.email}`} className="text-viyaan-cyan hover:underline truncate block">{selectedContact.email}</a>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-[9px] font-mono text-neutral-500 block">COMPANY</span>
                                <span className="text-neutral-300">{selectedContact.company || "Not provided"}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-mono text-neutral-500 block">PHONE</span>
                                <span className="text-neutral-300 font-mono">{selectedContact.phone || "Not provided"}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-neutral-500 block">MESSAGE DETAILS</span>
                              <div className="bg-neutral-950/60 border border-neutral-900 p-3 rounded-lg text-neutral-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto">
                                {selectedContact.message}
                              </div>
                            </div>
                          </div>

                          {/* Quick Admin Actions */}
                          <div className="flex flex-col gap-2 border-t border-neutral-900 pt-4 mt-2">
                            <span className="text-[9px] font-mono text-neutral-550 uppercase">Update Status</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedContact.status !== "unread" && (
                                <button
                                  onClick={() => updateContactStatus(selectedContact.id, "unread")}
                                  className="flex-1 min-w-[70px] bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-white font-mono text-[9px] uppercase tracking-wider py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                  Unread
                                </button>
                              )}
                              {selectedContact.status !== "read" && (
                                <button
                                  onClick={() => updateContactStatus(selectedContact.id, "read")}
                                  className="flex-1 min-w-[70px] bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-white font-mono text-[9px] uppercase tracking-wider py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                  Read
                                </button>
                              )}
                              {selectedContact.status !== "replied" && (
                                <button
                                  onClick={() => updateContactStatus(selectedContact.id, "replied")}
                                  className="flex-1 min-w-[70px] bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-white font-mono text-[9px] uppercase tracking-wider py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                  Replied
                                </button>
                              )}
                              <button
                                onClick={() => deleteContact(selectedContact.id)}
                                className="flex-shrink-0 bg-red-955/20 hover:bg-red-955/40 border border-red-900/40 hover:border-red-900 text-red-400 font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center gap-2 py-16 text-neutral-500 font-mono text-[10px]">
                          <span>SELECT AN INQUIRY TO VIEW DETAILS</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tab: Newsletter ── */}
              {activeTab === "newsletter" && (
                <div className="flex flex-col gap-8">
                  <form onSubmit={saveNewsletterSettings} className="flex flex-col gap-5">
                    <div>
                      <h3 className="font-display font-semibold text-lg text-white">Newsletter Settings</h3>
                      <p className="text-xs text-neutral-500 font-sans mt-1">Control the newsletter opt-in section appearance.</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Section Heading</label>
                      <input type="text" value={newsletterSettingsForm.title || ""} onChange={(e) => setNewsletterSettingsForm({ ...newsletterSettingsForm, title: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Section Description</label>
                      <textarea rows={3} value={newsletterSettingsForm.description || ""} onChange={(e) => setNewsletterSettingsForm({ ...newsletterSettingsForm, description: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none" />
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="nl-enabled" checked={!!newsletterSettingsForm.enabled} onChange={(e) => setNewsletterSettingsForm({ ...newsletterSettingsForm, enabled: e.target.checked })} className="w-4 h-4 rounded border-neutral-800 accent-emerald-500" />
                      <label htmlFor="nl-enabled" className="text-[11px] font-mono text-neutral-300">Newsletter opt-in visible on site</label>
                    </div>
                    <button type="submit" className="bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-2"><span>Save Newsletter Settings</span></button>
                  </form>

                  <div className="flex flex-col gap-4 border-t border-neutral-900 pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-viyaan-cyan" />
                        <h3 className="font-display font-semibold text-base text-white">Subscribers</h3>
                        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full">{subscribers.length} total</span>
                      </div>
                      <button onClick={fetchSubscribers} className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 hover:text-white border border-neutral-900 bg-neutral-950 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                        <RefreshCw className="w-3 h-3" /> Refresh
                      </button>
                    </div>
                    <input type="text" placeholder="Filter by email or name..." value={subscribersSearch} onChange={(e) => setSubscribersSearch(e.target.value)} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" />
                    {subscribers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center gap-2 py-12 text-neutral-500 font-mono text-[10px]">
                        <Mail className="w-6 h-6 opacity-30" />
                        <span>NO SUBSCRIBERS YET</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                        {subscribers.filter((s: any) => { const q = subscribersSearch.toLowerCase(); return !q || s.email?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q); }).map((sub: any) => (
                          <div key={sub.id} className="flex items-center justify-between gap-3 bg-neutral-950/40 border border-neutral-900 px-4 py-3 rounded-xl">
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs text-white font-mono truncate">{sub.email}</span>
                              {sub.name && <span className="text-[10px] text-neutral-500">{sub.name}</span>}
                              <span className="text-[9px] text-neutral-600 font-mono mt-0.5">{sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : ""}</span>
                            </div>
                            <button onClick={() => deleteSubscriber(sub.id)} className="flex-shrink-0 text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/30 transition-colors cursor-pointer" title="Remove subscriber"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Tab: Homepage Hero ── */}
              {activeTab === "homepage" && db && (
                <form onSubmit={saveHomepage} className="flex flex-col gap-5">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-white">Homepage Hero Editor</h3>
                    <p className="text-xs text-neutral-500 font-sans mt-1">Edit the hero section text and call-to-action buttons on the home page.</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Hero Heading</label>
                    <input type="text" value={homepageForm.heroHeading || ""} onChange={(e) => setHomepageForm({ ...homepageForm, heroHeading: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" placeholder="Intelligence Beyond the Human Mind." />
                    <span className="text-[9px] font-mono text-neutral-600">The main H1 tagline displayed on the homepage.</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Hero Subheading</label>
                    <textarea rows={3} value={homepageForm.heroSubheading || ""} onChange={(e) => setHomepageForm({ ...homepageForm, heroSubheading: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Primary CTA Label</label>
                      <input type="text" value={homepageForm.heroCta || ""} onChange={(e) => setHomepageForm({ ...homepageForm, heroCta: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" placeholder="Explore Our Ecosystem" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Primary CTA Link</label>
                      <input type="text" value={homepageForm.heroCtaLink || ""} onChange={(e) => setHomepageForm({ ...homepageForm, heroCtaLink: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" placeholder="/products" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Secondary CTA Label</label>
                      <input type="text" value={homepageForm.heroSecondCta || ""} onChange={(e) => setHomepageForm({ ...homepageForm, heroSecondCta: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" placeholder="Read Research" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Secondary CTA Link</label>
                      <input type="text" value={homepageForm.heroSecondCtaLink || ""} onChange={(e) => setHomepageForm({ ...homepageForm, heroSecondCtaLink: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" placeholder="/research" />
                    </div>
                  </div>
                  <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">LIVE PREVIEW</span>
                    <p className="font-display font-bold text-white text-xl leading-tight mt-1">{homepageForm.heroHeading || "Intelligence Beyond the Human Mind."}</p>
                    <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">{homepageForm.heroSubheading}</p>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {homepageForm.heroCta && <span className="text-[10px] font-mono bg-white text-black px-3 py-1.5 rounded-lg">{homepageForm.heroCta}</span>}
                      {homepageForm.heroSecondCta && <span className="text-[10px] font-mono border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg">{homepageForm.heroSecondCta}</span>}
                    </div>
                  </div>
                  <button type="submit" className="bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-2"><span>Save Homepage Hero</span></button>
                </form>
              )}

              {/* ── Tab: Careers ── */}
              {activeTab === "careers" && db && (
                <form onSubmit={saveCareers} className="flex flex-col gap-5">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-white">Careers Page Editor</h3>
                    <p className="text-xs text-neutral-500 font-sans mt-1">Edit the careers section. Open positions are managed via LinkedIn.</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Section Title</label>
                    <input type="text" value={careersForm.title || ""} onChange={(e) => setCareersForm({ ...careersForm, title: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" placeholder="Connect with Our Mission" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Section Description</label>
                    <textarea rows={4} value={careersForm.description || ""} onChange={(e) => setCareersForm({ ...careersForm, description: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">LinkedIn Jobs Link</label>
                    <input type="url" value={careersForm.linkedinLink || ""} onChange={(e) => setCareersForm({ ...careersForm, linkedinLink: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" placeholder="https://www.linkedin.com/company/viyaan-ai/jobs" />
                    <span className="text-[9px] font-mono text-neutral-600">Candidates are directed to LinkedIn for open positions.</span>
                  </div>
                  <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">PREVIEW</span>
                    <p className="text-white font-semibold text-sm mt-1">{careersForm.title || "Connect with Our Mission"}</p>
                    <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">{careersForm.description}</p>
                    {careersForm.linkedinLink && <a href={careersForm.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-viyaan-cyan font-mono text-[10px] mt-2 hover:underline">{careersForm.linkedinLink}</a>}
                  </div>
                  <button type="submit" className="bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-2"><span>Save Careers Section</span></button>
                </form>
              )}

              {/* ── Tab: Analytics Settings ── */}
              {activeTab === "analytics" && db && (
                <form onSubmit={saveAnalytics} className="flex flex-col gap-5">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-white">Analytics Configuration</h3>
                    <p className="text-xs text-neutral-500 font-sans mt-1">Configure Google Analytics and cookie consent. Redeploy for changes to take effect.</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Google Analytics Measurement ID</label>
                    <input type="text" value={analyticsForm.gaTrackingId || ""} onChange={(e) => setAnalyticsForm({ ...analyticsForm, gaTrackingId: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none font-mono" placeholder="G-XXXXXXXXXX" />
                    <span className="text-[9px] font-mono text-neutral-600">Enter your GA4 Measurement ID. Leave blank to disable analytics.</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Privacy Policy URL</label>
                    <input type="text" value={analyticsForm.privacyPolicyUrl || ""} onChange={(e) => setAnalyticsForm({ ...analyticsForm, privacyPolicyUrl: e.target.value })} className="bg-neutral-950 border border-neutral-900 px-3 py-2 text-xs text-white rounded-lg outline-none" placeholder="/privacy" />
                  </div>
                  <div className="flex flex-col gap-3 bg-neutral-950/40 border border-neutral-900 rounded-xl p-4">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Feature Flags</span>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={!!analyticsForm.enableAnalytics} onChange={(e) => setAnalyticsForm({ ...analyticsForm, enableAnalytics: e.target.checked })} className="w-4 h-4 rounded border-neutral-800 accent-emerald-500" />
                      <span className="text-[11px] font-mono text-neutral-300">Enable Google Analytics tracking</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={!!analyticsForm.cookieConsentEnabled} onChange={(e) => setAnalyticsForm({ ...analyticsForm, cookieConsentEnabled: e.target.checked })} className="w-4 h-4 rounded border-neutral-800 accent-emerald-500" />
                      <span className="text-[11px] font-mono text-neutral-300">Show cookie consent banner</span>
                    </label>
                  </div>
                  <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4">
                    <p className="text-amber-400 font-mono text-[10px] leading-relaxed"><strong>Note:</strong> Analytics settings are injected at build time. Redeploy via Netlify or your CI/CD pipeline after saving for changes to take effect.</p>
                  </div>
                  <button type="submit" className="bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-wider font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-2"><span>Save Analytics Configuration</span></button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
