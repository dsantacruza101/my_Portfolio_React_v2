import { useTranslation } from 'react-i18next';
import { ProjectCard } from './ProjectCards';
import type { Project } from '../types/project';
export const Projects = () => {
  const { t } = useTranslation();
  const projects: Project[] = [
    {
      id: '1',
      title: 'AI RAG Explorer',
      description: t('projects.ai_desc'),
      tags: ['React', 'FastAPI', 'Llama 3', 'LangChain'],
      image: '/projects/ai-rag.jpg',
      isWip: true
    },
    {
      id: '2',
      title: 'Microservices Gateway',
      description: t('projects.micro_desc'),
      tags: ['NestJS', 'Kubernetes', 'Redis'],
      image: '/projects/micro.jpg',
    }
  ];
  return (
    <section id="projects" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-12 flex items-center gap-4">
          <span className="w-12 h-1 bg-blue-600 rounded-full" />
          {t('projects.title')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </div>
    </section>
  );
};