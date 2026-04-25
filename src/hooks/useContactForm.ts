import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type HCaptcha from "@hcaptcha/react-hcaptcha";
import { contactService } from "../services/contact.service";

const contactSchema = z.object({
  name: z.string().min(3, { message: "name_error" }),
  email: z.email({ message: "email_error" }),
  subject: z.string().min(5, { message: "subject_error" }),
  message: z.string().min(10, { message: "message_error" }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

const COOLDOWN_MS = 30_000;

export function useContactForm() {
  const { t } = useTranslation();
  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const resetCaptcha = () => {
    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!captchaToken) {
      toast.error(t("contact.captcha_required") || "Please complete the captcha");
      return;
    }

    const toastId = toast.loading(t("contact.sending"));
    try {
      await contactService.sendMessage({ ...data, captchaToken });
      toast.success(t("contact.success"), { id: toastId });
      reset();
      resetCaptcha();
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);
    } catch {
      toast.error(t("contact.sending_error") || "Could not send message", {
        id: toastId,
      });
      resetCaptcha();
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    captchaRef,
    onCaptchaVerify: setCaptchaToken,
    onCaptchaExpire: () => setCaptchaToken(null),
    captchaToken,
    cooldown,
  };
}
