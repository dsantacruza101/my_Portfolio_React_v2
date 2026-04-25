import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SKILL_CATEGORIES } from '../data/data';
/** Skills section displaying categorized technology badges from SKILL_CATEGORIES. */
export const Skills = () => {
  const { t } = useTranslation();
  return (
    <section id="skills" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            {t('skills.title')}
          </h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {SKILL_CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {t(`skills.categories.${category.id}`)}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border border-transparent hover:border-blue-500/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};