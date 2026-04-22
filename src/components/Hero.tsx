import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GithubIcon, Linkedin, Terminal } from "lucide-react";
import profilePic from "../assets/images/portfolio_01.png";
export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section
      id="home"
      className="
        relative 
        w-full 
        min-h-screen 
        flex 
        items-center 
        justify-center 
        overflow-hidden
        bg-white 
        dark:bg-slate-900"
    >
      {" "}
      {}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px] dark:bg-blue-600/10" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-teal-500/20 rounded-full blur-[120px] dark:bg-teal-600/10" />
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        {}
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6">
              <Terminal size={16} />
              <span>{t("hero.role")}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1]">
              Daniel <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-teal-400">
                Santacruz
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-1"
              >
                {t("hero.cta_projects")}
              </button>
              <div className="flex items-center gap-3 ml-2">
                <a
                  target="_blank"
                  href="https://github.com/dsantacruza101"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <GithubIcon size={24} />
                </a>
                <a
                  target="_blank"
                  href="https://www.linkedin.com/in/daniel-santacruz-5a71a61a9/"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
        {}
        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-72 h-72 md:w-112.5 md:h-112.5 mx-auto">
            {}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 animate-[spin_20s_linear_infinite]" />
            {}
            <div className="absolute inset-8 rounded-3xl overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent z-10" />
              <img
                src={profilePic}
                alt="Daniel"
                className="w-full h-full object-cover"
              />
            </div>
            {}
            <TechBadge label="NestJS" className="top-10 -left-5 bg-red-500" />
            <TechBadge
              label="React"
              className="bottom-20 -right-5 bg-blue-500"
            />
            <TechBadge
              label="Docker"
              className="-bottom-5 left-20 bg-blue-700"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
const TechBadge = ({
  label,
  className,
}: {
  label: string;
  className: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    className={`absolute z-20 px-4 py-2 rounded-lg text-white font-bold text-sm shadow-xl ${className}`}
  >
    {label}
  </motion.div>
);
