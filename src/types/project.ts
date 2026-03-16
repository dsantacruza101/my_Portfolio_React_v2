export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl?: string;
  demoUrl?: string;
  isWip?: boolean; // Para tus proyectos "Work in Progress"
}
