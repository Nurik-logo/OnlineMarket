import React, { useContext, useState } from 'react';
import styles from '../css/ProductCard.module.css';
import { FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { addToCart } from '../api';
import CartModal from './CartModal';

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const handleAddToCartClick = () => {
    if (!user) return alert("Тіркеліңіз немесе кіріңіз");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmAddToCart = async (quantity) => {
    try {
      await addToCart({
        product_id: product.id,
        customer_id: user.id,
        quantity,
        unit_of_measure: product.unit_of_measure,
        price: product.price * quantity,
      });
      alert("Корзинаға сәтті қосылды!");
    } catch (error) {
      alert("Қате шықты, кейінірек қайталап көріңіз.");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <>
      <div className={styles.productCard}>
        <img src={product.image_url} alt={product.name} className={styles.productImage} />
        <h3>{product.name}</h3>
        <p className={styles.description}>{product.short_description}</p>
        <p className={styles.price}><strong>₸{product.price}</strong> / {product.unit_of_measure}</p>
        <p className={styles.quantity}>қолжетімді: {product.quantity} {product.unit_of_measure}</p>
        <button className={styles.addToCartBtn} onClick={handleAddToCartClick}>
          <FaShoppingCart /> Корзинаға
        </button>
      </div>

      {showModal && (
        <CartModal
          maxQuantity={product.quantity}
          pricePerUnit={product.price}
          onCancel={handleCloseModal}
          onConfirm={handleConfirmAddToCart}
        />
      )}
    </>
  );
};

export default ProductCard;
