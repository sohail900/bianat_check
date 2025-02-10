import { FadeInFromDown, cn } from "@shared/lib/utils";
import TextBox from "@shared/ui/TextBox";
import Button from "@shared/ui/Button";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

const Schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(
    (schema) => {
      return !(schema.password !== schema.confirmPassword);
    },
    { message: "Passwords do not match", path: ["confirmPassword"] }
  );

type SchemaType = z.infer<typeof Schema>;

interface Props {
  defaultValuePassword: string;
  defaultValueConfirmPassword: string;
  onFinish: (password: string, confirmPassword: string) => void;
}

const Password = ({
  onFinish,
  defaultValuePassword,
  defaultValueConfirmPassword,
}: Props) => {
  const { t, i18n } = useTranslation();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      password: defaultValuePassword,
      confirmPassword: defaultValueConfirmPassword,
    },
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    onFinish(data.password, data.confirmPassword);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={FadeInFromDown}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      custom={{ delay: 0, y: 50 }}
      className="space-y-5 md:min-w-[25rem] md:max-w-[25rem]"
    >
      <h1 className="text-3xl">{t("Password").toString()}</h1>
      <TextBox
        type="password"
        autoFocus
        className={cn("w-full", {
          ["border-red-500"]: errors.password,
        })}
        {...register("password")}
        placeholder={t("Password").toString()}
      />
      {errors.password && (
        <p className="text-red-500">{t(errors.password.message!).toString()}</p>
      )}
      <TextBox
        type="password"
        className={cn("w-full", {
          ["border-red-500"]: errors.confirmPassword,
        })}
        {...register("confirmPassword")}
        placeholder={t("Confirm Password").toString()}
      />
      {errors.confirmPassword && (
        <p className="text-red-500">
          {t(errors.confirmPassword.message!).toString()}
        </p>
      )}
      <Button
        type="submit"
        disabled={
          watch("password").length <= 0 || watch("confirmPassword").length <= 0
        }
        className="w-full"
      >
        {t("Sign Up").toString()}
      </Button>
      <div className="items-center w-full justify-center hidden md:flex text-black/40">
        <p className={i18n.language === "en" ? "text-xs mr-2" : "text-xs ml-5"}>
          {t("Or_Press_Enter").toString()}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-5 w-5", {
            ["rotate-180"]: i18n.language === "ar",
            ["-rotate-180 -scale-x-[1]"]: i18n.language === "en",
          })}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 9h8a5 5 0 1 1 5 5v7" />
          <path d="M7 5l-4 4l4 4" />
        </svg>
      </div>
    </motion.form>
  );
};
export default Password;
