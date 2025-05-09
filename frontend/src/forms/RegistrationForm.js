import React, { useState } from 'react';
import styles from '../css/RegistrationForm.module.css';
import { Link } from 'react-router-dom';
import { registerUser } from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = ({ notification }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    nickname: '',
    email: '',
    birthdate: '',
    gender: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.', { autoClose: 5000 });
      return;
    }

    try {
      const response = await registerUser(formData);
      toast.success('Registration successful! Please check your email for confirmation.', { autoClose: 5000 });
      console.log('Registration response:', response);

      setFormData({
        firstname: '',
        lastname: '',
        nickname: '',
        email: '',
        birthdate: '',
        gender: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
      });
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'An error occurred during registration.', { autoClose: 5000 });
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      {notification}
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
        <p>Create your account</p>
        <ToastContainer />
        <form onSubmit={handleSubmit} className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <input type="text" name="firstname" placeholder="Firstname" value={formData.firstname} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <input type="text" name="lastname" placeholder="Lastname" value={formData.lastname} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <input type="text" name="nickname" placeholder="Nickname" value={formData.nickname} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          </div>
          <div className={`${styles.checkboxGroup} ${styles.fullWidth}`}>
            <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} />
            <label htmlFor="termsAccepted" className={styles.termsAccepted}>I agree to the Terms & Conditions</label>
          </div>
          <button type="submit" className={`${styles.submitButton} ${styles.fullWidth}`}>Sign Up</button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
