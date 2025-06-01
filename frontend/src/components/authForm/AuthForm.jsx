import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import { AuthContext } from '../../context/AuthContext';
import classes from './AuthForm.module.scss';
import LoadingIndicator from '../../common/LoadingIndicator';
import light_logo from "../../assets/images/logo_decepta_crypto.svg";
import dark_logo from "../../assets/images/logo_decepta_crypto_dark.svg";

const AuthForm = ({ method }) => {
  const { fetchUserProfile } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const isLogin = method === 'login';
  const emailDomain = '@gmail.com';

  const validationSchema = Yup.object().shape({
    emailPrefix: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+$/, t('invalidEmailPrefix'))
      .required(t('invalidEmailPrefix')),

    password: Yup.string()
      .min(6, t('passwordTooShort'))
      .required(t('passwordTooShort')),

    ...(isLogin
      ? {
          username: Yup.string()
            .min(3, t('invalidUsername'))
            .required(t('invalidUsername')),
        }
      : {
          nickname: Yup.string()
            .min(3, t('nicknameTooShort'))
            .required(t('nicknameTooShort')),
          tagNicknamePrefix: Yup.string()
            .matches(/^[a-zA-Z0-9_]+$/, t('invalidTagNicknamePrefix'))
            .required(t('invalidTagNicknamePrefix')),
        }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const email = `${data.emailPrefix}${emailDomain}`;
    const tagNickname = `@${data.tagNicknamePrefix}`;

    const route = isLogin ? '/api/user/token/' : '/api/user/register/';
    const payload = isLogin
      ? { username: data.username, email, password: data.password }
      : {
          email,
          password: data.password,
          profile: {
            nickname: data.nickname.trim(),
            tag_nickname: tagNickname,
          },
        };

    try {
      const response = await api.post(route, payload);

      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        await fetchUserProfile();
        navigate('/');
      } else {
        navigate('/verify-email', { state: { email } });
      }
    } catch (err) {
      const res = err.response?.data;
      const serverError =
        res?.error ||
        res?.email?.[0] ||
        res?.username?.[0] ||
        res?.profile?.nickname?.[0] ||
        res?.profile?.tag_nickname?.[0] ||
        res?.detail ||
        t('errorOccurred');
      alert(serverError); 
    }
  };


  useEffect(() => {
      const observer = new MutationObserver(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(currentTheme);
      });
  
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  
      return () => observer.disconnect();
    }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <img src={theme === 'light' ? light_logo : dark_logo} alt="decepta_logotype" className={classes.logo_img} />

      <h1>{isLogin ? t('We’re happy to see you') : t('Welcome To Decepta')}</h1>

      <div className={classes.form_group}>
        <input
          type="text"
          placeholder={t('emailPrefixPlaceholder')}
          aria-label={t('email')}
          className={classes.form_input}
          {...register('emailPrefix')}
        />
        <span className={classes.input_suffix}>{emailDomain}</span>
        {errors.emailPrefix && <div className={classes.error}>{errors.emailPrefix.message}</div>}
      </div>

      {isLogin ? (
        <div className={classes.form_group}>
          <input
            type="text"
            placeholder={t('usernamePlaceholder')}
            aria-label={t('username')}
            className={classes.form_input}
            {...register('username')}
          />
          {errors.username && <div className={classes.error}>{errors.username.message}</div>}
        </div>
      ) : (
        <>
          <div className={classes.form_group}>
            <input
              type="text"
              placeholder={t('nicknamePlaceholder')}
              aria-label={t('nickname')}
              className={classes.form_input}
              {...register('nickname')}
            />
            {errors.nickname && <div className={classes.error}>{errors.nickname.message}</div>}
          </div>
          <div className={classes.form_group}>
            <span className={classes.input_prefix}>@</span>
            <input
              type="text"
              placeholder={t('tagNicknamePrefixPlaceholder')}
              aria-label={t('tagNickname')}
              className={classes.form_input}
              {...register('tagNicknamePrefix')}
            />
            {errors.tagNicknamePrefix && (
              <div className={classes.error}>{errors.tagNicknamePrefix.message}</div>
            )}
          </div>
        </>
      )}

      <div className={classes.form_group}>
        <input
          type="password"
          placeholder={t('passwordPlaceholder')}
          aria-label={t('password')}
          className={classes.form_input}
          {...register('password')}
        />
        {errors.password && <div className={classes.error}>{errors.password.message}</div>}
      </div>

      {isSubmitting && <LoadingIndicator />}

      <button type="submit" className={classes.form_button} disabled={isSubmitting}>
        {isLogin ? t('signIn') : t('sendCode')}
      </button>

      <div className={classes.form_links}>
        <p>
          {isLogin ? t('noAccount') : t('haveAccount')}{' '}
          <Link to={isLogin ? '/signup' : '/login'}>
            {isLogin ? t('signUp') : t('signIn')}
          </Link>
        </p>
      </div>
    </form>
  );
};

export default AuthForm;
