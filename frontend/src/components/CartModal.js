import React, { useState } from 'react';
import styles from '../css/CartModal.module.css';

const CartModal = ({ maxQuantity, pricePerUnit, onCancel, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    if (quantity <= maxQuantity && quantity > 0) {
      onConfirm(quantity);
    } else {
      alert(`Максималды рұқсат етілген мөлшер: ${maxQuantity}`);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Сатып алу</h2>
        <label className={styles.modalLabel}>
          Қанша аласыз? (макс: {maxQuantity})
          <input
            type="number"
            value={quantity}
            min="1"
            max={maxQuantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className={styles.modalInput}
          />
        </label>
        <p className={styles.modalPrice}>Жалпы баға: ₸{(quantity * pricePerUnit).toFixed(2)}</p>
        <div className={styles.modalButtonGroup}>
          <button onClick={onCancel} className={`${styles.modalButton} ${styles.modalCancelButton}`}>Болдырмау</button>
          <button onClick={handleConfirm} className={`${styles.modalButton} ${styles.modalConfirmButton}`}>Корзинаға қосу</button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
