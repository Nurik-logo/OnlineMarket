
import React from 'react';
import styles from '../css/StoreCard.module.css';
import { useNavigate } from 'react-router-dom';

const StoreCard = ({ store, onDelete, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.storeCard}>
      <img src={store.image_url} alt={store.name} className={styles.storeImage} />
      <div className={styles.storeInfo}>
        <h2>{store.name}</h2>
        <p className={styles.description}>{store.description}</p>
        <p><strong>Ауданы:</strong> {store.region_name}</p>
        <p><strong>Санаты:</strong> {store.category_name}</p>
        <p><strong>Рейтинг:</strong> {store.rating}</p>
        <p><strong>Күйі:</strong> {store.status}</p>
        <p><strong>Құрылған:</strong> {new Date(store.created_at).toLocaleDateString()}</p>
        <div className={styles.buttonGroup}>
          <button onClick={() => navigate(`/store/${store.id}`)} className={styles.viewBtn}>Дүкенге өту</button>
          <button onClick={() => onEdit(store.id)} className={styles.editBtn}>Өзгерту</button>
          <button onClick={() => onDelete(store.id)} className={styles.deleteBtn}>Өшіру</button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
