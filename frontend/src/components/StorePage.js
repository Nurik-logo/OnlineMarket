import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/StorePage.module.css';
import { getStoreById, getProductsByStoreId, getRegionNameById } from '../api';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';
import { addProduct } from '../api';
import { AuthContext } from '../context/AuthContext';

const StorePage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [regionName, setRegionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {user} = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      const storeData = await getStoreById(id);
      setStore(storeData);
      setRegionName(await getRegionNameById(storeData.region_id));
      const productList = await getProductsByStoreId(id);
      setProducts(productList);
    };

    fetchData();
  }, [id]);

  const handleAddProduct = async (productData) => {
    try {
        await addProduct({ ...productData, store_id: id }); 
      setProducts(prevProducts => [...prevProducts, productData]);
    } catch (error) {
      console.error("Product addition failed", error);
    }
  };

  if (!store) return <div className={styles.loading}>Loading store...</div>;

  return (
    <div className={styles.storePage}>
      <div className={styles.storeHeader}>
        <img src={store.image_url} alt={store.name} className={styles.storeImage} />
        <div className={styles.storeInfo}>
          <h1>{store.name}</h1>
          <p>{store.description}</p>
          <p><FaMapMarkerAlt /> Region: {regionName}</p>
          <p><FaStar /> Rating: {store.rating || '0.0'}</p>
          {store.user_id === user.id && ( 
            <button onClick={() => setIsModalOpen(true)} className={styles.addProductBtn}>
              Add Product
            </button>
          )}
        </div>
      </div>

      <h2 className={styles.productTitle}>🛍 Products</h2>
      <div className={styles.productGrid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddProduct} 
        storeId={id}
      />
    </div>
  );
};

export default StorePage;
