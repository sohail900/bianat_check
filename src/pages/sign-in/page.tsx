import Button from "@shared/ui/Button";
import TextBox from "@shared/ui/TextBox";
import React, { useContext, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn as SignInRedux } from "../../features/Auth/authSlice";
import { signIn } from "@shared/api/auth";
import type { Dispatch } from "@reduxjs/toolkit";
import { showToast } from "@shared/utilites/toast";
import { motion } from "framer-motion";
import { FadeInFromDown, cn } from "@shared/lib/utils";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { authChatBot, dbChatBot } from "../../utils/firebase/config";
import { SubscriptionContext } from "../../contexts/subscriptionContext";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { subDispatch } = useContext(SubscriptionContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const checkFirebaseSubscription = async (responseData: any): Promise<any> => {
    const { paymentId, id } = responseData;

    if (!paymentId) {
      return { subscribed: false, username: id };
    }

    try {
      const docRef = doc(dbChatBot, "payments", paymentId); // Get the document directly using paymentId
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const paymentData = docSnapshot.data();

        // Process the expiry date
        let expiryDate;
        if (paymentData.expiryDate instanceof Timestamp) {
          expiryDate = paymentData.expiryDate.toDate();
        } else if (
          typeof paymentData.expiryDate === "object" &&
          paymentData.expiryDate.seconds
        ) {
          expiryDate = new Date(paymentData.expiryDate.seconds * 1000);
        } else {
          console.error("Invalid expiryDate format");
          return { subscribed: false, username: id };
        }

        const currentDate = new Date();

        // Check if the subscription is expired
        if (currentDate > expiryDate) {
          console.log("Subscription expired");
          return { subscribed: false, username: id };
        } else {
          console.log("Subscription is active");
          return {
            subscribed: true,
            username: id,
            subscriptionData: paymentData,
            expiryDate,
          };
        }
      } else {
        console.log("No payment data found");
        return { subscribed: false, username: id };
      }
    } catch (error) {
      console.error("Error checking subscription: ", error);
      return { subscribed: false, username: id };
    }
  };

  async function fetchAccessToken() {
    try {
      // collection ref
      const docRef = doc(dbChatBot, "api", "bianatStockData");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const access_token = data.token.split(" ")[1];
        console.log("ACCESS_TOKEN", access_token);
        localStorage.setItem("access_token", access_token);
        return access_token;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching access token: ", error);
      return null;
    }
  }
  const signInWithFirebase = async (data: {
    email: string;
    password: string;
  }): Promise<any> => {
    try {
      console.log("Signing in with data:", data);

      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        authChatBot,
        data.email,
        data.password
      );
      const user = userCredential.user;

      console.log("User signed in:", user);
      // Fetch user data from Firestore using the user's UID
      const userDocRef = doc(dbChatBot, "users", user.uid); // Assumes "users" collection has documents with user UIDs
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const access_token = await fetchAccessToken();
        // User data successfully fetched from Firestore
        const userData = userDocSnap.data();
        console.log("User data from Firestore:", userData);
        return {
          code: "success",
          data: userData,
          access_token,
        };
      } else {
        // No user data found in Firestore
        console.log("No user data found in Firestore");
        await signOut(authChatBot);
        return {
          code: "error",
          error: {
            message: "Error In Finding User Data",
          },
        };
      }
    } catch (error) {
      console.error("Error signing in or fetching user data:", error);

      // Handle specific errors
      if (error.code === "auth/invalid-credential") {
        return {
          code: "error",
          error: {
            message: "Invalid Credentials",
          },
        };
      } else {
        return {
          code: "error",
          error: {
            message: "An unknown error occurred",
          },
        };
      }
    }
  };

  async function loginWithKuzzle(data:any){
    const response = await signIn(data);

    if (response.code === "error") {
      showToast(t(response.error.response?.data.message), "error");
    }


    if (response.code === "success") {
        localStorage.setItem(
          "temp_data",
          JSON.stringify({...response.data})
        );
      navigate("/update-profile-t")
    }
  }

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    setLoading(true);

    const response = await signInWithFirebase(data);
    
    if (response.code === "success") {
      // check for subscription
      if (response.data.subscription && response.data.subscription === "paid") {
        const subscription = await checkFirebaseSubscription(response.data);
        if (subscription) {
          localStorage.setItem(
            "new_sub",
            JSON.stringify({
              subscribed: subscription.subscribed,
              username: subscription.username,
              expiryDate: subscription.expiryDate ?? "",
              packageName:
                subscription?.subscriptionData?.subscriptionPlan?.titleEn ?? "",
            })
          );
        }
      } else {
        console.log("Subscription is free so skipping the subscription check.")
        localStorage.setItem(
          "new_sub",
          JSON.stringify({
            subscribed: false,
            username: response.data.id,
            expiryDate: "",
            packageName: "",
          })
        );
      }
      const rData = {
        user: response.data,
        access_token: response.access_token,
      };
      dispatch(SignInRedux(rData));
      navigate("/dashboard");
      window.location.reload();
    }
    
    if (response.code === "error") {
      showToast(response.error.message, "error");
      // logging in with kuzzle
      await loginWithKuzzle(data)
    }


    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center font-cairo flex-col px-4">
      <Link to="/">
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

      <div className="fixed w-screen h-screen bg-gradient-to-br from-white to-[#F8FAFF] right-0 left-0 -z-10" />
      <motion.form
        variants={FadeInFromDown}
        initial="hidden"
        animate="visible"
        custom={{ delay: 0, y: 50 }}
        onSubmit={handleSubmit(onSubmit)}
        className="md:w-1/3 w-full space-y-4"
      >
        <h1 className="text-xl">
          {t("Welcome Back").toString()} <span>👋🏻</span>
        </h1>
        <TextBox
          {...register("email")}
          type="email"
          autoFocus
          placeholder={t("Email Address")}
          className={errors.email && "border-red-600"}
        />
        {errors.email && (
          <h4 className="text-red-600">
            {t(errors.email.message!).toString()}
          </h4>
        )}
        <TextBox
          {...register("password")}
          type="password"
          placeholder={t("Password")}
          className={errors.password && "border-red-600"}
        />
        {errors.password && (
          <h4 className="text-red-600">
            {t(errors.password.message!).toString()}
          </h4>
        )}
        <div className="flex items-center justify-between">
          <div>
            <input type="checkbox" className="mx-2" />{" "}
            {t("Remember me").toString()}
          </div>
          <Link
            to="/forget-password"
            className="text-blue-600 hover:text-blue-600 hover:underline underline-offset-4"
          >
            {t("Forgot password").toString()}
          </Link>
        </div>
        <Button className="w-full" disabled={loading}>
          {t("Sign_In").toString()}
        </Button>
        <div className="flex items-center justify-between">
          <h1
            className={`${
              i18n.language === "en" ? "text-left" : "text-right"
            } w-full`}
          >
            {t("Don't have an account?").toString()}{" "}
            <Link to="/sign-up" className="text-blue-600">
              {t("Sign_Up").toString()}
            </Link>
          </h1>
          <div className="items-center w-full justify-end hidden md:flex text-black/40">
            <p
              className={
                i18n.language === "en" ? "text-xs mr-2" : "text-xs ml-5"
              }
            >
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
        </div>
      </motion.form>
    </div>
  );
}
