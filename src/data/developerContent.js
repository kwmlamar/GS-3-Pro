export const defaultOverviewContent = {
  title: "GS-3 SecureOps Pro Platform",
  version: "1.0.0",
  lastUpdated: new Date().toISOString().split('T')[0],
  description: "A comprehensive security operations management platform designed to streamline and enhance protective services through real-time monitoring, AI-driven analytics, and robust reporting tools. This portal provides an in-depth look at the project's architecture and codebase.",
  keyFeatures: [
    {
      title: "Unified Dashboard",
      description: "Centralized view of all operational metrics, active alerts, and system statuses.",
      icon: "LayoutDashboard"
    },
    {
      title: "Hierarchical Site Management",
      description: "Flexible system to define and manage sites, regions, and national entities.",
      icon: "Network"
    },
    {
      title: "Real-time Alerts & Notifications",
      description: "A dynamic ticker and notification system for immediate operational awareness.",
      icon: "AlertTriangle"
    },
    {
      title: "Role-Based Access Control (RBAC)",
      description: "Granular permission system to tailor user access based on roles like Admin, Supervisor, and Client.",
      icon: "Users"
    },
    {
      title: "ISO & Health/Safety Compliance",
      description: "Dedicated modules for tracking compliance, incidents, and audits.",
      icon: "ShieldCheck"
    },
    {
      title: "Extensible Admin Settings",
      description: "UI for configuring system-wide parameters and integration settings.",
      icon: "Settings"
    }
  ],
  techStack: [
    { name: "React", version: "18.2.0", type: "Frontend Library" },
    { name: "Vite", version: "4.4.5", type: "Build Tool" },
    { name: "TailwindCSS", version: "3.3.3", type: "CSS Framework" },
    { name: "Supabase", version: "2.30.0", type: "Backend as a Service" },
    { name: "Framer Motion", version: "10.16.4", type: "Animation Library" },
    { name: "shadcn/ui", version: "Latest", type: "Component Library" }
  ]
};