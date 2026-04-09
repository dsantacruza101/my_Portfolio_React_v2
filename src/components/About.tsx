import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Award, Briefcase, GraduationCap } from "lucide-react";
// Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import aboutImage from '../assets/images/portfolio_02.png';

export const About = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-white dark:bg-slate-900 transition-colors overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          {/* Visual: Foto con marcos decorativos */}
          <div className="flex-1 relative w-full max-w-md mx-auto md:max-w-none">
            {/* Marco decorativo azul */}
            <div className="absolute -top-4 -left-4 w-full h-full border-4 border-blue-600 rounded-2xl z-0" />
            
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group">
              {/* Overlay de gradiente corregido para Tailwind estándar */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
              
              <img
                src={aboutImage}
                alt="Daniel Santacruz"
                className="w-full h-auto min-h-10 object-cover rounded-2xl transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Badge de Experiencia */}
            <motion.div 
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-blue-600 p-6 rounded-2xl shadow-2xl z-20 hidden md:block border-4 border-white dark:border-slate-900"
            >
              <p className="text-white font-black text-3xl">+5</p>
              <p className="text-blue-100 text-[10px] uppercase font-black tracking-tighter">
                {t("about.years_exp")}
              </p>
            </motion.div>
          </div>

          {/* Contenido: Tu Historia */}
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                {t("about.title")}
              </h2>
              <div className="h-1.5 w-20 bg-blue-600 my-6 rounded-full" />
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                {t("about.description")}
              </p>
            </motion.div>

            {/* Stats Rápidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <AboutItem
                icon={<Briefcase size={20} />}
                title={t("about.experience")}
                detail="MRE El Salvador"
                delay={0.4}
              />
              <AboutItem
                icon={<Award size={20} />}
                title={t("about.specialty")}
                detail="AI & Microservices"
                delay={0.5}
              />
              <AboutItem
                icon={<GraduationCap size={20} />}
                title={t("about.education")}
                detail={t("hero.role")}
                delay={0.6}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const AboutItem = ({
  icon,
  title,
  detail,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  delay: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/30 transition-colors group"
  >
    <div className="text-blue-600 dark:text-blue-400 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
        {title}
      </p>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
        {detail}
      </p>
    </div>
  </motion.div>
);