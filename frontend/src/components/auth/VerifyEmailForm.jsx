import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api';
import styles from './VerifyEmailForm.module.scss';
import LoadingIndicator from '../../common/LoadingIndicator';

const VerifyEmailForm = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(300); // 5 минут
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || '';

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
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
      await api.post('/api/user/verify-email/', { email, code });
      navigate('/login');
    } catch (error) {
      console.error('Verification failed:', error.response?.data);
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
      setResendTimer(300);
      setCanResend(false);
      setError(t('codeResent'));
    } catch (error) {
      console.error('Resend failed:', error.response?.data);
      const errorMessage =
        error.response?.data?.detail || t('errorOccurred');
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
    <form onSubmit={handleSubmit} className={styles.form_container}>
      <h1>{t('verifyEmail')}</h1>
      <p>{t('verifyEmailPrompt', { email })}</p>
      <div className={styles.form_group}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t('codePlaceholder')}
          className={styles.form_input}
          aria-label={t('verificationCode')}
          maxLength={6}
          required
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {loading && <LoadingIndicator />}
      <button type="submit" className={styles.form_button} disabled={loading}>
        {t('verify')}
      </button>
      <button
        type="button"
        className={styles.form_button}
        onClick={handleResendCode}
        disabled={loading || !canResend}
      >
        {canResend ? t('resendCode') : `${t('resendIn')} ${formatTime(resendTimer)}`}
      </button>
      <div className={styles.form_links}>
        <Link to="/login">{t('backToLogin')}</Link>
      </div>
    </form>
  );
};

export default VerifyEmailForm;