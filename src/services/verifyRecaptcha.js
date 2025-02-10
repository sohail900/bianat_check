import authApi from "./authApi";

export const verifyRecaptcha = async (executeRecaptcha) => {
  if (!executeRecaptcha) {
    console.log("Execute recaptcha not yet available");
    return;
  }

  const token = await executeRecaptcha("yourAction");

  const result = await authApi.post(`verify-recaptcha/${token}`);

  return result.data;
};
