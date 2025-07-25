export const package_json = {
  name: "package.json",
  type: "file",
  content: `{
  "name": "security-management-platform",
  "type": "module",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.3",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-select": "^1.2.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@supabase/supabase-js": "2.30.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.285.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-helmet": "^6.1.0",
    "react-router-dom": "^6.16.0",
    "tailwind-merge": "^1.14.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.8.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}`
};

export const rootFiles = [
    package_json,
    { name: "tailwind.config.js", type: "file", content: `// Not relevant for this snapshot` },
    { name: "postcss.config.js", type: "file", content: `// Not relevant for this snapshot` },
    { name: "index.html", type: "file", content: `// Not relevant for this snapshot` },
    { name: "vite.config.js", type: "file", content: `// Not relevant for this snapshot` },
];