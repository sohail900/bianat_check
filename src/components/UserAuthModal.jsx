import React, { useCallback } from "react";
import { Modal, Image } from "antd";
import { useSelector } from "react-redux";
import bianatLogo from "../assets/bianat-logo.png";
import bianatLogoDark from "../assets/bianat-logo-transparent.png";
import { verifyRecaptcha } from "../services/verifyRecaptcha";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import SignIn from "./SignIn";
import ForgotPassword from "./ForgotPassword";
import SignUp from "./SignUp";

/**
 * @name UserAuthModal
 * @description: UserAuthModal Component for the app.
 * @purpose: To render the user auth modal of the app.
 * @param {function} showModal - Function to show the modal.
 * @param {function} setShowModal - Function to set the show modal state.
 * @param {state} active - Function to set the active state.
 * @param {function} setActive - Function to set the active state.
 * @returns {JSX.Element}
 */

export default function UserAuthModal({
  showModal,
  setShowModal,
  active,
  setActive,
}) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const handleTokenVerify = useCallback((param) => verifyRecaptcha(param), []);

  const handleTokenVerfication = async () => {
    return handleTokenVerify(executeRecaptcha);
  };

  return (
    <Modal
      open={showModal}
      footer={null}
      width={400}
      wrapClassName="log-modal"
      className={` ${currentTheme === "Dark" && "dark-skin"}`}
      onCancel={() => {
        setActive("login");
        setShowModal(false);
      }}
    >
      <div
        className={`auth-form-background-box  ${
          currentTheme === "Dark" && "dark-skin"
        }`}
      >
        <div>
          <div className="brand">
            <Image
              src={currentTheme === "Dark" ? bianatLogoDark : bianatLogo}
              alt="bianat-logo"
              preview={false}
            />
          </div>
          <div>
            {active === "login" ? (
              <SignIn
                handleTokenVerfication={handleTokenVerfication}
                setShowModal={setShowModal}
                setActive={setActive}
              />
            ) : active === "forgot-password" ? (
              <ForgotPassword
                handleTokenVerfication={handleTokenVerfication}
                setShowModal={setShowModal}
                setActive={setActive}
              />
            ) : (
              <SignUp
                handleTokenVerfication={handleTokenVerfication}
                setShowModal={setShowModal}
                setActive={setActive}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
