/// <reference types="vite/client" />

declare module 'markdown-it-katex' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const katex: (md: MarkdownIt, options?: any) => void;
  export default katex;
}
