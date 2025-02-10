import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import TermsAndConditions from "./components/TermsAndConditions";
import Name from "./components/Name";
import { cn } from "@shared/lib/utils";
import Email from "./components/Email";
import Password from "./components/Password";
import { useTranslation } from "react-i18next";
import { showToast } from "@shared/utilites/toast";
import { HashLoader } from "react-spinners";
import { signIn, signUp } from "@shared/api/auth";
import { useDispatch } from "react-redux";
import { signIn as SignInRedux } from "../../features/Auth/authSlice";
import { message } from "antd";
import Payment from "../Subscription-old/Payment";
import { EllipsisOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { authChatBot, dbChatBot } from "../../utils/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
export default function SignUp() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [totalSteps, setTotalSteps] = useState(4);
  const [subscriptionResponse, setSubscriptionResponse] = useState(
    undefined as any
  );
  const [userData, setUserData] = useState({} as any);
  const [data, setData] = useState({
    acceptTerms: false,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [step, setStep] = useState(1);
  const isComplete = step <= totalSteps;

  const signUpFirebase = async (params: any): Promise<any> => {
    // axios.post(`${process.env.REACT_APP_API_URL}auth/signup`, params)
    try {
      const nData = {
        email: params?.email || "",
        password: params?.password || "",
        username: params?.email ? params.email.split("@")[0] : "",
        phone: {
          dialCode: "+966",
          number: params?.phoneNumber || "",
        },
        name: params?.name || "",
      };
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        authChatBot,
        nData?.email,
        nData?.password
      );

      // Get the user ID from the created user
      const userId = userCredential.user.uid;

      // Store additional user data in Firestore
      await setDoc(doc(dbChatBot, "users", userId), {
        email: nData.email,
        username: nData.username,
        phone: nData.phone,
        name: nData.name,
        userType: "Email",
        createdDate: new Date(),
        subscription: "free",
        id: userId,
        roles:["user"]
      });

      return {
        code: "success",
      };
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        return {
          code: "error",
          error: {
            message: "Email already in use",
          },
        };
      }
      return {
        code: "error",
        error: {
          message: "An unknown error occurred",
        },
      };
    }
  };
  async function fetchAccessToken(){
    try {
      // collection ref
      const docRef = doc(dbChatBot, "api", "bianatStockData");
      const docSnap = await getDoc(docRef);
      
      if(docSnap.exists()){
        const data = docSnap.data();
        const access_token = data.token.split(" ")[1]
        console.log("ACCESS_TOKEN" , access_token)
        localStorage.setItem("access_token", access_token);
        return access_token
      }else{
        console.log("No such document!");
        return null
      }

    } catch (error) {
        console.error("Error fetching access token: ", error);
        return null
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
        const access_token = await fetchAccessToken()
        // User data successfully fetched from Firestore
        const userData = userDocSnap.data();
        console.log("User data from Firestore:", userData);
        return {
          code: "success",
          data: userData,
          access_token
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

  const onSubmit = async (password: string, confirmPassword: string) => {
    setLoading(true);
    const response = await signUpFirebase({
      ...data,
      password,
      confirmPassword,
    });
    console.log(response);
    if (response.code === "error") {
      // console.log(response.error.response?.data.message)
      showToast(response.error.message, "error");
      setStep(3);
    }
    if (response.code === "success") {
      const signInResponse = await signInWithFirebase({
        email: data.email,
        password,
      });
      const rData = {
        user: signInResponse.data,
        access_token: signInResponse.access_token,
      };
      if (signInResponse.code === "error") {
        showToast(signInResponse.error.message, "error");
      }
      if (signInResponse.code === "success") {
        // dispatch(SignInRedux(signInResponse.data));
        dispatch(SignInRedux(rData));
        navigate("/settings");
        // window.location.reload();
      }
    }
    setLoading(false);
  };
  const addressChange = async (data: any, userData: any) => {
    const myApi = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true,
    });
    try {
      // const response = await myApi.patch(
      //     'subscriptions/update_customer_address',
      //     data,
      //     {
      //         headers: {
      //             Authorization: `Bearer ${userData.access_token}`,
      //         },
      //     }
      // )

      const { promocode: coupon_code } = data;

      // if (response.status === 200) {
      const subscriptionResponse = await myApi.post(
        "subscriptions",
        {
          plan_id: planId ? planId : "1",
          coupon_code,
          address_detail: {
            ...data,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        }
      );
      if (subscriptionResponse.status === 201) {
        setSubscriptionResponse(subscriptionResponse);
        setStep(5);
      } else {
        message.error(subscriptionResponse.data.message);
      }
      // }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handlePayment = async (userData: any) => {
    let detail: any = {
      prefix: "966",
      phone: data?.phoneNumber,
      address: "RAGI2929 2929 Rayhanah Bint Zaid 8118 Al Arid District",
      city: "Al Arid",
      zip: "13337",
      district: "Al Arid",
      state: "RIYADH",
      country: "Saudi Arabia",
      subscription: planId ? planId : "1",
    };
    let address = {
      ...detail,
      phone: detail?.prefix + detail.phone,
    };

    delete address.prefix;

    await addressChange(address, userData);
  };

  useEffect(() => {
    if (planId && planId != null) {
      setIsOffer(true);
      setTotalSteps(5);
    }
  }, [planId]);

  return (
    <AnimatePresence exitBeforeEnter>
      <div className="w-full h-screen flex justify-center items-center font-cairo flex-col px-4">
        <div className="fixed w-screen h-screen bg-gradient-to-br from-white to-[#F8FAFF] right-0 left-0 -z-10" />

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
        {loading && <HashLoader color="#2563eb" size="42" />}
        {isComplete && (
          <motion.div
            className="flex space-x-2 absolute top-[10rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1>
              {t("Step").toString()} {step} / {totalSteps}
            </h1>
          </motion.div>
        )}
        {step == 1 && (
          <TermsAndConditions
            defaultValue={data.acceptTerms}
            onFinish={() => {
              console.log(planId);
              setStep((value) => value + 1);
              setData({ ...data, acceptTerms: true });
            }}
          />
        )}
        {step == 2 && (
          <Name
            defaultValue={data.name}
            onFinish={(name) => {
              setStep((value) => value + 1);
              setData({ ...data, name });
            }}
          />
        )}
        {step == 3 && (
          <Email
            defaultValue={data.email}
            onFinish={(email: string, phoneNumber: string) => {
              setStep((value) => value + 1);
              setData({ ...data, email, phoneNumber });
            }}
          />
        )}
        {step == 4 && (
          <Password
            defaultValuePassword={data.password}
            defaultValueConfirmPassword={data.confirmPassword}
            onFinish={(password, confirmPassword) => {
              //   setStep((value) => value + 1)
              setData({ ...data, password, confirmPassword });
              onSubmit(password, confirmPassword);
            }}
          />
        )}
        {/* {step == 5 && <Payment handlePayment={handlePayment} />} */}
        {step == 5 && subscriptionResponse === undefined && (
          <HashLoader color="#2563eb" size="42" />
        )}
        {step == 5 && subscriptionResponse !== undefined && (
          <>
            <Button
              className="ml-2"
              type="primary"
              onClick={() => {
                window.open(`${subscriptionResponse?.data}`, "_blank");
                setStep(6);
              }}
            >
              {t("Make Payment")}
            </Button>
            <br />

            <span className="text-black/40 text-sm">
              {t("Click above button to make Payment")}
            </span>
          </>
        )}
        {step == 6 && (
          <>
            <h3 className="text-center">
              <EllipsisOutlined />
              {t("Subscription in Progress")}
            </h3>
          </>
        )}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" flex text-blue-600 absolute bottom-5 right-5"
          >
            <button
              disabled={step == 1}
              className={cn(
                "flex justify-center items-center px-4 py-2 bg-blue-100/40 rounded-full",
                {
                  ["bg-black/10 text-black/20"]: step == 1,
                }
              )}
              onClick={() => setStep(step == 1 ? 1 : step - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
