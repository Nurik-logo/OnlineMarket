// components/BalanceRequestModal.js
import React, { useState } from 'react';
import styles from '../css/BalanceRequestModal.module.css';

const BalanceRequestModal = ({ onClose, onSubmit }) => {
    const [requestType, setRequestType] = useState('deposit'); // deposit | withdraw
    const [amount, setAmount] = useState('');
    const [receipt, setReceipt] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
  
    const handleSubmit = () => {
      if (!amount || (requestType === 'deposit' && !receipt) || (requestType === 'withdraw' && !phoneNumber)) {
        alert("Барлық қажетті мәліметтерді толтырыңыз");
        return;
      }
  
      const requestData = {
        type: requestType,
        amount,
        ...(requestType === 'deposit' ? { receipt } : { phoneNumber }),
      };
  
      onSubmit(requestData);
      onClose();
    };
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <span className={styles.closeIcon} onClick={onClose}>&times;</span>
          <h2 className={styles.modalTitle}>💰 Баланс сұранысы</h2>
  
          <div className={styles.inputGroup}>
            <label>Сұраныс түрі:</label>
            <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
              <option value="deposit">Баланс толтыру</option>
              <option value="withdraw">Ақша шешу</option>
            </select>
          </div>
  
          <div className={styles.inputGroup}>
            <label>Сома (₸):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Мысалы: 5000"
            />
          </div>
  
          {requestType === 'deposit' && (
            <div className={styles.inputGroup}>
              <label>Каспи түбіртек (.jpg, .png):</label>
              <input
                type="file"
                accept="image/*, application/pdf"
                onChange={(e) => setReceipt(e.target.files[0])}
              />
              <small>Каспи номер: <b>+7 777 123 4567</b></small>
            </div>
          )}
  
          {requestType === 'withdraw' && (
            <div className={styles.inputGroup}>
              <label>Каспи номеріңіз:</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+7..."
              />
            </div>
          )}
  
          <div className={styles.buttonGroup}>
            <button className={`${styles.button} ${styles.submitButton}`} onClick={handleSubmit}>
              Жіберу
            </button>
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
              Болдырмау
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default BalanceRequestModal;
