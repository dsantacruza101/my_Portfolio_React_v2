/** Data shape for a single portfolio project card. */
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  /** Optional preview image path; omitting it renders a "Coming Soon" placeholder. */
  image?: string;
  githubUrl?: string;
  demoUrl?: string;
  /** When `true`, renders an amber "WIP" badge on the card. */
  isWip?: boolean;
}
