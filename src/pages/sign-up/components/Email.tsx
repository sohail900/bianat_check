import { FadeInFromDown, cn } from "@shared/lib/utils";
import TextBox from "@shared/ui/TextBox";
import Button from "@shared/ui/Button";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";

interface Props {
  defaultValue: string;
  onFinish: (email: string,phoneNumber:string) => void;
}

const Email = ({ onFinish, defaultValue }: Props) => {
  const [email, setEmail] = useState(defaultValue);
  const [phoneNumber,setPhoneNumber] = useState("")
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();

  return (
      <motion.form
          onSubmit={(e) => {
              e.preventDefault()
              const isEmail = z.string().email().safeParse(email)
              if (!isEmail.success) {
                  setError(isEmail.error.errors[0].message)
                  return
              }

              onFinish(email, phoneNumber)
          }}
          variants={FadeInFromDown}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          custom={{ delay: 0, y: 50 }}
          className="space-y-5"
      >
          <h1 className="text-3xl">{t('Email Address').toString()}</h1>
          <TextBox
              autoFocus
              className={error.length > 0 ? 'border-red-500' : ''}
              value={email}
              onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
              }}
              placeholder={t('Email Address').toString()}
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex" >
              <label className=" pr-2 pt-2">+966</label>
              <TextBox
                  autoFocus
                  value={phoneNumber}
                  onChange={(e) => {
                      setPhoneNumber(e.target.value)
                  }}
                  placeholder={t('Phone Number').toString()}
              />
          </div>

          <Button type="submit" disabled={email.length <= 0} className="w-full">
              {t('Next').toString()}
          </Button>
          <div className="items-center w-full justify-center hidden md:flex text-black/40">
              <p
                  className={
                      i18n.language === 'en' ? 'text-xs mr-2' : 'text-xs ml-5'
                  }
              >
                  {t('Or_Press_Enter').toString()}
              </p>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn('h-5 w-5', {
                      ['rotate-180']: i18n.language === 'ar',
                      ['-rotate-180 -scale-x-[1]']: i18n.language === 'en',
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
  )
};
export default Email;
