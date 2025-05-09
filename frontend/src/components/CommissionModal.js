import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getBalance } from '../api';  // Функцияны импорттау
import styles from '../css/CommissionModal.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CommissionModal = ({ isOpenCommMod, onCloseCommMod, totalCost, onPay }) => {
  const [balance, setBalance] = useState(0.0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {user} = useContext(AuthContext)
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceInUsd = await getBalance(user.id);
        const balanceUsd = balanceInUsd.balance
        const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const exchangeData = await exchangeResponse.json();

        const usdToKzt = exchangeData.rates.KZT;
        const balanceInKzt = parseFloat((balanceUsd * usdToKzt).toFixed(2));
        setBalance(balanceInKzt);

      } catch (error) {
        toast.error('Баланс немесе валюта курсын алу кезінде қате пайда болды.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBalance();
  }, [user.id]);
  
  const commission = totalCost * 0.05;
  const isEnoughBalance = balance >= commission;

  if (!isOpenCommMod) return null;

  const handlePayment = () => {
    if (!isEnoughBalance) {
      toast.error('Жеткіліксіз баланс. Балансты толтырыңыз.');
      return;
    }
    onPay();
    onCloseCommMod();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Қызмет үшін комиссия төлеу</h2>
        <p className={styles.detail}>
          Жалпы сома: <span>{totalCost.toLocaleString()} ₸</span>
        </p>
        <p className={styles.detail}>
          5% комиссия: <span>{commission.toLocaleString()} ₸</span>
        </p>
        <p className={styles.detail}>
          Сіздің балансыңыз: <span className={isEnoughBalance ? styles.enough : styles.insufficient}>
            {loading ? 'Жүктелуде...' : balance.toLocaleString()} ₸
          </span>
        </p>

        <div className={styles.buttonGroup}>
          <button
            className={styles.payBtn}
            onClick={handlePayment}
            disabled={!isEnoughBalance || loading}
          >
            Төлеу
          </button>
          <button className={styles.topUpBtn} onClick={() => navigate('/wallet')}>
            Балансты толтыру
          </button>
          <button className={styles.cancelBtn} onClick={onCloseCommMod}>
            Болдырмау
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommissionModal;
