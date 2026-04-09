import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare } from 'lucide-react';

// 1. Definición del Esquema de Validación (Zod)
const contactSchema = z.object({
  name: z.string().min(3, { message: 'name_error' }),
  email: z.email({ message: 'email_error' }),
  subject: z.string().min(5, { message: 'subject_error' }),
  message: z.string().min(10, { message: 'message_error' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact = () => {
  const { t } = useTranslation();
  
  // 2. Configuración de React Hook Form
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulación de envío (Aquí conectarás tu API de FastAPI en el futuro)
    console.log('Form Data:', data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(t('contact.success'));
    reset();
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">
            {t('contact.title')}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            {t('contact.subtitle')}
          </p>
        </div>

        <motion.form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
          
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <User size={16} /> {t('contact.name')}
            </label>
            <input 
              {...register('name')}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="Daniel Santacruz"
            />
            {errors.name && <p className="text-red-500 text-xs font-bold">{t(`contact.errors.${errors.name.message}`)}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Mail size={16} /> {t('contact.email')}
            </label>
            <input 
              {...register('email')}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="daniel@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs font-bold">{t(`contact.errors.${errors.email.message}`)}</p>}
          </div>

          {/* Asunto (Full Width) */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('contact.subject')}</label>
            <input 
              {...register('subject')}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
            />
            {errors.subject && <p className="text-red-500 text-xs font-bold">{t(`contact.errors.${errors.subject.message}`)}</p>}
          </div>

          {/* Mensaje (Full Width) */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageSquare size={16} /> {t('contact.message')}
            </label>
            <textarea 
              {...register('message')}
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs font-bold">{t(`contact.errors.${errors.message.message}`)}</p>}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 py-4 bg-linear-to-r from-blue-600 to-teal-500 text-white rounded-xl font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? t('contact.sending') : <><Send size={20} /> {t('contact.send')}</>}
          </button>
        </motion.form>
      </div>
    </section>
  );
};