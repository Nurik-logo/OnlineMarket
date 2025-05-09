import React, { useEffect, useState } from 'react';
import styles from '../css/MyStoresPage.module.css';
import StoreCard from './StoreCard';
import { getMyStores } from '../api';
import CreateStoreForm from '../forms/CreateStoreForm';

const MyStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await getMyStores();
        setStores(response);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    }
    fetchStores();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Менің дүкендерім</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          + Дүкен қосу
        </button>
      </div>

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={() => setShowForm(false)}>
            <i className='bx bx-x'></i>
          </button>

            <CreateStoreForm
              onStoreCreated={() => {
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

      <div className={styles.cardGrid}>
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};

export default MyStoresPage;
