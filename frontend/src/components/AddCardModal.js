import React, { useState } from 'react';
import styles from '../css/AddCardModal.module.css';
import { toast } from 'react-toastify';
import { addCreditCard } from '../api';

const AddCardModal = ({ onClose, userId, onCardAdded }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('Visa');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cardNumber || !expiryDate || !cvv) {
      toast.error("All fields are required");
      return;
    }

    try {
      await addCreditCard({
        user_id: userId,
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvv,
        card_type: cardType,
      });

      toast.success("Card added successfully");
      onCardAdded(); 
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add card");
    }
  };

    const handleExpiryInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiryDate(value);
  };
  

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Add New Card</h3>
        <div className={styles.cardPreview}>
            <div className={styles.chip}></div>
            <p className={styles.previewNumber}>
              {cardNumber ? cardNumber.replace(/\d{4}(?=.)/g, '$& ') : '#### #### #### ####'}
            </p>
            <div className={styles.previewBottom}>
              <p>{expiryDate || 'MM/YY'}</p>
              <p>{cardType}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <input
            className={styles.modalInput}
            type="text"
            placeholder="Card Number"
            maxLength="16"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
          <input
            className={styles.modalInput}
            type="text"
            placeholder="Expiry Date (MM/YY)"
            maxLength="5"
            value={expiryDate}
            onChange={handleExpiryInput}
            required
           />
          <input
            className={styles.modalInput}
            type="text"
            placeholder="CVV"
            maxLength="4"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
          <select className={styles.modalSelect} value={cardType} onChange={(e) => setCardType(e.target.value)}>
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
          </select>
          <div className={styles.modalButtons}>
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
