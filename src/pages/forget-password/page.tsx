import { zodResolver } from "@hookform/resolvers/zod";
import { FadeInFromDown, cn } from "@shared/lib/utils";
import TextBox from "@shared/ui/TextBox";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { z } from "zod";
import { forgotPassword as forgotPasswordAPI } from "@shared/api/auth";
import { showToast } from "@shared/utilites/toast";
import Button from "@shared/ui/Button";

const Schema = z.object({
  email: z.string().email(),
});

type SchemaType = z.infer<typeof Schema>;

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    setLoading(true);

    const response = await forgotPasswordAPI(data);

    if (response.code === "error") {
      showToast(t(response.error.response?.data.message), "error");
    }

    if (response.code === "success") {
      showToast(t(response.data.message), "success");
    }

    setLoading(false);

    console.log(data);
  };

  return (
    <div className="flex justify-center items-center h-screen font-cairo px-4">
      <div className="fixed w-screen h-screen bg-gradient-to-br from-white to-[#F8FAFF] right-0 left-0 -z-10" />

      <Link to="/sign-in">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 absolute left-5 top-5 hover:text-blue-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
          />
        </svg>
      </Link>
      <motion.form
        variants={FadeInFromDown}
        initial="hidden"
        animate="visible"
        custom={{ delay: 0, y: 50 }}
        onSubmit={handleSubmit(onSubmit)}
        className="md:w-1/3 w-full space-y-4"
      >
        <h1 className="text-3xl mb-5">{t("Forgot password")}</h1>
        <h2 className="text-md text-black/40">
          {t(
            "Please fill in the email field below. We'll send you a link to reset your password."
          )}
        </h2>
        <TextBox
          {...register("email")}
          placeholder={t("Email Address")}
          className={cn("w-full", {
            ["border-red-500"]: errors.email,
          })}
        />
        {errors.email && (
          <p className="text-red-500">{t(errors.email.message!)}</p>
        )}
        <Button className="w-full" disabled={loading}>
          {t("Send")}
        </Button>
      </motion.form>
    </div>
  );
}
