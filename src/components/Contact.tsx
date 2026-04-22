import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import { useContactForm } from "../hooks/useContactForm";

export const Contact = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, errors, isSubmitting } = useContactForm();
  
  return (
    <section
      id="contact"
      className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">
            {t("contact.title")}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            {t("contact.subtitle")}
          </p>
        </div>
        <motion.form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800"
        >
          {}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <User size={16} /> {t("contact.name")}
            </label>
            <input
              {...register("name")}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="Daniel Santacruz"
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-bold">
                {t(`contact.errors.${errors.name.message}`)}
              </p>
            )}
          </div>
          {}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Mail size={16} /> {t("contact.email")}
            </label>
            <input
              {...register("email")}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="daniel@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-bold">
                {t(`contact.errors.${errors.email.message}`)}
              </p>
            )}
          </div>
          {}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("contact.subject")}
            </label>
            <input
              {...register("subject")}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
            />
            {errors.subject && (
              <p className="text-red-500 text-xs font-bold">
                {t(`contact.errors.${errors.subject.message}`)}
              </p>
            )}
          </div>
          {}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageSquare size={16} /> {t("contact.message")}
            </label>
            <textarea
              {...register("message")}
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-xs font-bold">
                {t(`contact.errors.${errors.message.message}`)}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 py-4 bg-linear-to-r from-blue-600 to-teal-500 text-white rounded-xl font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              t("contact.sending")
            ) : (
              <>
                <Send size={20} /> {t("contact.send")}
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};
