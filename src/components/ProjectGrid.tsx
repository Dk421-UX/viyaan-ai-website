import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Project = {
  id?: string;
  name?: string;
  description?: string;
  url?: string;
  status?: string;
  sortOrder?: number;
  projectStatus?: string;
  tagline?: string;
};

type VisibleProject = {
  id: string;
  name: string;
  description: string;
  url: string;
  status?: string;
  sortOrder?: number;
  projectStatus: string;
  tagline?: string;
};

const verifiedProjects = [
  {
    id: "examrag",
    name: "ExamRAG",
    description: "An AI-powered learning project for working with educational materials and finding relevant information.",
    projectStatus: "In Development",
  },
  {
    id: "examoracle",
    name: "EXAMORACLE",
    description: "A study and exam-preparation project focused on preparation insights and areas for improvement.",
    projectStatus: "In Development",
  },
  {
    id: "attendance-intelligence",
    name: "Attendance Intelligence",
    description: "A practical tool for understanding attendance calculations and planning attendance more effectively.",
    projectStatus: "Active Tool",
  },
];

function destinationFor(project: Project) {
  const value = project.url?.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const visibleProjects = verifiedProjects
    .map((fallback) => {
      const record = projects.find((project) => project.id?.toLowerCase() === fallback.id);
      if (record?.status?.toLowerCase() === "hidden") return null;
      return {
        ...fallback,
        ...record,
        id: fallback.id,
        name: record?.name || fallback.name,
        description: record?.description || fallback.description,
        projectStatus: record?.projectStatus || record?.tagline || fallback.projectStatus,
        url: record?.url ?? "",
      };
    })
    .filter((project): project is VisibleProject => Boolean(project))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (visibleProjects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProjects.map((project) => {
        const destination = destinationFor(project);
        const statusLabel = project.projectStatus?.trim();

        return (
          <article key={project.id} id={project.id} className="project-card h-full scroll-mt-24">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">Learning project</p>
                {statusLabel ? (
                  <span className="inline-flex items-center rounded-full border border-sky-400/25 bg-sky-400/10 px-2.5 py-0.5 text-[11px] font-medium text-sky-300">
                    {statusLabel}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.03em] text-white">
                {project.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {project.description}
              </p>
            </div>

            {destination ? (
              <div className="mt-6 pt-3 border-t border-white/[0.08]">
                <Link
                  href={destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-link w-fit text-sky-300 hover:text-sky-200"
                >
                  Visit project <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
