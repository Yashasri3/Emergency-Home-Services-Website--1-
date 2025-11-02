// Global module fallbacks for imports with versioned specifiers (e.g. "lucide-react@0.487.0", "@radix-ui/react-tabs@1.1.3", "npm:...", "jsr:...")
// These declarations treat unknown module specifiers as `any` so the TypeScript
// compiler won't error while Vite's bundler handles the actual resolution.

declare module '*@*' {
  const v: any;
  export default v;
}

declare module 'npm:*' {
  const v: any;
  export default v;
}

declare module 'jsr:*' {
  const v: any;
  export default v;
}

// Fallback catch-all (keep at the end). Use only while developing locally.
declare module '*';
