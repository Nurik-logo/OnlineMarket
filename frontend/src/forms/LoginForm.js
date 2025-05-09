import React, { useState, useContext } from 'react';
import styles from '../css/LoginFrom.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    termsAccepted: false,
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      toast.error('You must accept the terms and conditions to continue.');
      return;
    }

    try {
      const loginData = {
        nicknameOrEmail: formData.identifier,
        password: formData.password,
      };

      const response = await loginUser(loginData);

      await login(response.token);

      toast.success(`Login successful`);

      setFormData({
        identifier: '',
        password: '',
        termsAccepted: false,
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please check your credentials and try again.'
      );
    }
  };

  return (
    <div className={styles.formContainer}>
      <ToastContainer />

      <div className={styles.scrollRect}></div>
      {[...Array(10)].map((_, i) => {
        const randomDuration = `${18 + Math.random() * 10}s`;
        const randomDelay = `${Math.random() * 10}s`;
        const randomZ = Math.random() > 0.5 ? -1 : 1;
        return (
          <img
            key={i}
            src={require(`../images/auth/photo${i + 1}.png`)}
            className={styles.floatingFood}
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDuration: randomDuration,
              animationDelay: randomDelay,
              transform: `translateZ(${randomZ * 50}px)`,
            }}
            alt={`photo${i + 1}`}
          />
        );
      })}
      <div className={styles.formBox}>
        <h2>Verdeluxe Market</h2>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit} className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="identifier"
              placeholder="Nickname or Email"
              value={formData.identifier}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.checkboxGroup} ${styles.fullWidth}`}>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label htmlFor="termsAccepted" className={styles.termsAccepted}>I agree to the Terms & Conditions</label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>
        </form>

        <p className={styles.switchLink}>
          If you don't have an account <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
