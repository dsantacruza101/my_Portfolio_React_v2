import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { contactService } from "../services/contact.service";

const contactSchema = z.object({
  name: z.string().min(3, { message: "name_error" }),
  email: z.email({ message: "email_error" }),
  subject: z.string().min(5, { message: "subject_error" }),
  message: z.string().min(10, { message: "message_error" }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export function useContactForm() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const toastId = toast.loading(t("contact.sending"));
    try {
      await contactService.sendMessage(data);
      toast.success(t("contact.success"), { id: toastId });
      reset();
    } catch {
      toast.error(t("contact.sending_error") || "Could not send message", {
        id: toastId,
      });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}
