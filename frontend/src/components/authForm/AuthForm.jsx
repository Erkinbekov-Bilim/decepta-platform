import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { AuthContext } from "../../context/AuthContext";
import classes from "./AuthForm.module.scss";
import LoadingIndicator from "../../common/LoadingIndicator";
import light_logo from "../../assets/images/logo_decepta_crypto.svg";
import dark_logo from "../../assets/images/logo_decepta_crypto_dark.svg";
import icons from "../../assets/icons/icons";
import { useIconConfig } from "../../context/IconConfigContext";
import { registerSchema } from "../../schemas/registerSchema";
import { loginSchema } from "../../schemas/loginSchema";
import nav_icons from '../../assets/nav_icons/nav_Icons'
import LanguageDropdown from "../../components/header/dropdownMenus/themeLanguageNav/languageDropdown/LanguageDropdown";


const { OpenEyeIcon, CloseEyeIcon } = icons;
const {
  LanguageIcon,
} = nav_icons

const AuthForm = ({ method }) => {
  const { iconConfig } = useIconConfig();
  const { fetchUserProfile } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [visible, setVisible] = useState(false);

  const isLogin = method === "login";
  const emailDomain = "@gmail.com";
  const isRegister = method === "signup";
  const validationSchema = isRegister ? registerSchema(t) : loginSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const email = `${data.emailPrefix}${emailDomain}`;

    if (isLogin) {
      try {
        const response = await api.post("/api/user/token/", {
          email,
          password: data.password,
          username: data.username
        });

        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate("/");
        await fetchUserProfile();
      } catch (err) {
        const res = err.response?.data;
        const serverError =
          res?.error || res?.email?.[0] || res?.detail || t("Error occurred");
        alert(serverError);
      }
    } else {
      navigate("/verify-email", {
        state: {
          email,
          password: data.password,
          username: data.username
        },
      });
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleVisibility = () => {
    setVisible(prev => !prev);
  }

  return (
    <>
    <div className={classes.auth_wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <div className={classes.form_container}>
          <img
            src={theme === "light" ? light_logo : dark_logo}
            alt="decepta"
            className={classes.logo_img}
          />

          <h1>{isLogin ? t("We’re happy to see you") : t("Welcome To Decepta")}</h1>

          <div className={classes.form_inputs}>
            <div className={classes.form_group} style={{ position: "relative" }}>
              <label htmlFor="email">
                {t("Email")}
                <input
                  id="email"
                  maxLength={20}
                  type="text"
                  placeholder={t("Enter your email")}
                  aria-label={t("email")}
                  className={classes.form_input}
                  {...register("emailPrefix")}
                />
              </label>
              <span className={classes.input_suffix}>@gmail.com</span>
              <div className={classes.form_error}>
                {errors.emailPrefix?.message || "\u00A0"}
              </div>
            </div>

            <div>
              <input type="text" {...register("username")}/>
            </div>

            <div className={classes.form_group} style={{ position: "relative" }}>
              <label htmlFor="password">
                {t("Password")}
                <input
                  id="password"
                  maxLength={20}
                  type={visible ? "text" : "password"}
                  placeholder={t("Enter your password")}
                  aria-label={t("password")}
                  className={classes.form_input}
                  {...register("password")}
                />
              </label>

              <div className={classes.password_visibility} onClick={toggleVisibility}>
                {visible ? (
                  <OpenEyeIcon color={iconConfig.color} />
                ) : (
                  <CloseEyeIcon color={iconConfig.color} />
                )}
              </div>

              <div className={classes.form_error}>
                {errors.password?.message || "\u00A0"}
              </div>
            </div>
          </div>


          <button
            type="submit"
            className={classes.form_button}
            disabled={isSubmitting}
          >
            {isLogin ? t("Log in") : t("Next")}
          </button>
        </div>
        

        {isSubmitting && <LoadingIndicator />}

        <div className={classes.form_links}>
          <p>
            {isLogin ? t("Don’t have an account?") : t("Already have an account?")}{" - "}
            <Link to={isLogin ? "/signup" : "/login"} replace>
              {isLogin ? t("Sign up") : t("Log in")}
            </Link>
          </p>
        </div>
      </form>
    </div>
    </>
  );
};

export default AuthForm;
