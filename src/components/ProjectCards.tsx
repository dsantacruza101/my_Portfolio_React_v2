import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '../types/project';

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg"
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
            {project.title}
          </h3>
          {project.isWip && (
            <span className="px-2 py-1 text-[10px] font-black bg-amber-100 text-amber-600 rounded-md uppercase">
              WIP
            </span>
          )}
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="text-[11px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <a href={project.githubUrl} className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-500">
            <Github size={18} /> Code
          </a>
          <a href={project.demoUrl} className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-500">
            <ExternalLink size={18} /> Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
};