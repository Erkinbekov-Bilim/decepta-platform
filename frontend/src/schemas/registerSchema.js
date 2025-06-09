import * as Yup from "yup";

export const registerSchema = (t) =>
  Yup.object().shape({
    emailPrefix: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+$/, t("Email contains invalid characters"))
      .transform((value) => value.toLowerCase())
      .min(5, t("Email must be at least 10 characters long"))
      .required(t("Please enter a valid email")),
    password: Yup.string()
      .matches(/^[A-Za-z0-9!@#$%^&*()_+\-={};':"\\|,.<>/?]*$/, t("Password contains invalid characters"))
      .min(10, t("Password must be at least 10 characters long"))
      .required(t("Please enter the correct password")),
  });
