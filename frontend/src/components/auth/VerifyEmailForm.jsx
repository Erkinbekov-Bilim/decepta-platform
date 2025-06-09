import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api';
import classes from '../authForm/AuthForm.module.scss';
import LoadingIndicator from '../../common/LoadingIndicator';
import light_logo from "../../assets/images/logo_decepta_crypto.svg";
import dark_logo from "../../assets/images/logo_decepta_crypto_dark.svg";

const VerifyEmailForm = ({ method }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(300);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || '';
  const password = state?.password || '';


  useEffect(() => {
      const observer = new MutationObserver(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(currentTheme);
      });
  
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  
      return () => observer.disconnect();
    }, []);

  useEffect(() => {
      const storedTime = localStorage.getItem(`verify:${email}`);
      if (storedTime) {
        const elapsed = Math.floor((Date.now() - parseInt(storedTime)) / 1000);
        const remaining = Math.max(300 - elapsed, 0);
        setResendTimer(remaining);
        setCanResend(remaining === 0);
      } else {
        setResendTimer(300);
        localStorage.setItem(`verify:${email}`, Date.now().toString());
        setCanResend(false);
      }
    }, [email]);


  useEffect(() => {
      if (resendTimer > 0) {
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              setCanResend(true);
              clearInterval(interval);
            }
            return next;
          });
        }, 1000);

        return () => clearInterval(interval);
      } else {
        setCanResend(true);
      }
    }, [resendTimer]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError(t('invalidCode'));
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/user/verify-email/', { 
        email, 
        code 
      });

      await api.post('api/user/register', {
        email, password
      })

      navigate('/login');
    } catch (error) {
      console.error('Verification or registration failed:', error.response?.data);
      const errorMessage =
        error.response?.data?.detail || t('errorOccurred');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/api/user/resend-verification/', { email });
      const now = Date.now();
      localStorage.setItem(`verify:${email}`, now.toString());
      setResendTimer(300);
      setCanResend(false);
      setError(t('codeResent'));
    } catch (error) {
      console.error('Resend failed:', error.response?.data);
      const errorMessage = error.response?.data?.detail || t('errorOccurred');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <img src={theme === 'light' ? light_logo : dark_logo} alt="decepta_logotype" className={classes.logo_img} />
      <h1>{t('Verify your email')}</h1>
      <span className={classes.form_text}>
        {t(`A 6-digit code has been sent to ${email} Please enter it within the next 5 minutes.`)}
      </span>
      <div className={classes.form_inputs}>
        <div className={classes.form_group}>
          <label htmlFor="email-code">
            {t('Verification code')}
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('Enter verification code')}
              className={classes.form_input}
              aria-label={t('verificationCode')}
              maxLength={6}
              required
            />
          </label>
          <div className={classes.input_resend_container}>
            <p
              type="button"
              className={classes.input_resend_text}
              onClick={handleResendCode}
              disabled={loading || !canResend}
            >
              {canResend ? t('resend') : `${formatTime(resendTimer)}`}
            </p>
            <div className={classes.input_resend_line}></div>
          </div>
        </div>
      {error && <div className={classes.form_error}>{error}</div>}
      {loading && <LoadingIndicator />}
      <button type="submit" className={classes.form_button} disabled={loading}>
        {t('Verify')}
      </button>

      </div>
      
    </form>
  );
};

export default VerifyEmailForm;