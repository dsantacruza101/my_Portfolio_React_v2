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

/**
 * Manages the contact form state, validation, captcha verification, and submission.
 *
 * Enforces a 30-second cooldown after a successful send to prevent rapid resubmission.
 * The captcha token must be set via `onCaptchaVerify` before submission is allowed.
 *
 * @returns Form controls, captcha handlers, and submission state.
 */
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

  /** Resets the captcha widget and clears the stored token. */
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
    /** Bound submit handler — pass directly to `<form onSubmit>`. */
    handleSubmit: handleSubmit(onSubmit),
    errors,
    /** `true` while the form submission is in flight. */
    isSubmitting,
    /** Ref forwarded to the HCaptcha widget for programmatic reset. */
    captchaRef,
    /** Call with the token emitted by the HCaptcha `onVerify` event. */
    onCaptchaVerify: setCaptchaToken,
    /** Call when the HCaptcha token expires to invalidate the stored token. */
    onCaptchaExpire: () => setCaptchaToken(null),
    captchaToken,
    /** `true` during the 30-second cooldown after a successful send. */
    cooldown,
  };
}
