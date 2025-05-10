import React, { useContext, useEffect, useState } from 'react';
import styles from '../css/WalletPage.module.css';
import { AuthContext } from '../context/AuthContext';
import { getBalance, getCreditCardsByUser } from '../api';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddCardModal from '../components/AddCardModal'; 
import BalanceRequestModal from '../components/BalanceRequestModal';


const WalletPage = () => {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [cards, setCards] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);


  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error('Error fetching exchange rates', error);
    }
  };

  const handleBalanceRequest = (requestData) => {
    console.log('Balance Request Submitted:', requestData);
    toast.success('Сұраныс сәтті жіберілді!');
    // Мұнда backend API-ге сұраныс жіберуге болады
  };
  

  useEffect(() => {
    if (user?.id) {
      getBalance(user.id)
        .then((data) => {
          const fetchedBalance = parseFloat(data.balance);
          setBalance(isNaN(fetchedBalance) ? 0 : fetchedBalance);
        })
        .catch(console.error);

      getCreditCardsByUser(user.id)
        .then(setCards)
        .catch(console.error);
    }

    fetchExchangeRates();
  }, [user]);

  const renderCardTypeIcon = (type) => {
    if (type.toLowerCase() === 'visa') return <FaCcVisa className={styles.visaIcon} />;
    if (type.toLowerCase() === 'mastercard') return <FaCcMastercard className={styles.mastercardIcon} />;
    return null;
  };

  const convertBalance = (currency) => {
    if (!exchangeRates[currency]) return balance;
    return (balance * exchangeRates[currency]).toFixed(2);
  };

  const handleAddCard = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]);
    toast.success("Card added successfully!");
  };

  return (
    <div className={styles.walletContainer}>
      <h2 className={styles.title}>💳 Your Wallet</h2>
      <div className={styles.balanceCard}>
        <p className={styles.balanceLabel}><b>Balance5</b></p>
        <div className={styles.balanceCurrency}>
          <b><p>₸ {convertBalance('KZT')}</p></b>
          <b><p>₽ {convertBalance('RUB')}</p></b>
          <b><p>${balance.toFixed(2)}</p></b>
        </div>
      </div>

      <div className={styles.cardsSection}>
        <div className={styles.cardsHeader}>
          <h3 className={styles.cardsTitle}>Saved Credit Cards</h3>
          <button className={styles.addCardBtn} onClick={() => setShowAddModal(true)}>
            ➕ Add Card
          </button>
        </div>

        <div className={styles.cardList}>
          {cards.length === 0 ? (
            <p className={styles.noCards}>No cards added yet.</p>
          ) : (
            cards.map((card) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardIcon}>
                  {renderCardTypeIcon(card.card_type)}
                </div>
                <div className={styles.cardDetails}>
                  <p className={styles.cardNumber}>•••• •••• •••• {card.card_number.slice(-4)}</p>
                  <p className={styles.cardExpiry}>Expiry: {card.expiry_date}</p>
                  <p className={styles.cardType}>{card.card_type}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <AddCardModal
          onClose={() => setShowAddModal(false)}
          onAddCard={handleAddCard}
        />
      )}
      {showBalanceModal && (
        <BalanceRequestModal
          onClose={() => setShowBalanceModal(false)}
          onSubmit={handleBalanceRequest}
        />
      )}

      <div className={styles.balanceAction}>
        <button
          className={styles.balanceButton}
          onClick={() => setShowBalanceModal(true)}
        >
          💵 Баланс толтыру / Ақша шешу
        </button>
      </div>
    </div>
    
  );
};

export default WalletPage;
