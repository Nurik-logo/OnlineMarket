import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styleAddPr from '../css/AddProductModal.module.css';
import { toast } from 'react-toastify';
import CommissionModal from './CommissionModal';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { payCommission } from '../api';

const AddProductModal = ({ isOpen, onClose, onSubmit, storeId}) => {
  const [showCommission, setShowCommission] = useState(false);
  const [productData, setProductData] = useState(null);
  const {user} = useContext(AuthContext)
  const initialValues = {
    name: '',
    short_description: '',
    image_url: '',
    price: '',
    unit_of_measure: '',
    quantity: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    short_description: Yup.string().required('Required'),
    image_url: Yup.string().url('Invalid URL').required('Required'),
    price: Yup.number().positive().required('Required'),
    unit_of_measure: Yup.string().required('Required'),
    quantity: Yup.number().min(1).required('Required')
  });

  const handleFormSubmit = (values, { setSubmitting }) => {
    setProductData(values);
    setShowCommission(true);
    setSubmitting(false);
  };

  const handlePayCommission = async () => {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/KZT');
        const data = await response.json();
        const kztToUsd = data.rates.USD;

        // Төлем KZT-мен
        const totalCostKZT = productData.price * productData.quantity;
        const commissionKZT = totalCostKZT * 0.05;

        // Тек баланс тексеру үшін USD-ға айналдырамыз
        const commissionUSD = commissionKZT * kztToUsd;

        // Комиссияны екі валютада жібереміз
        await payCommission(user.id, commissionUSD, commissionKZT);
      await onSubmit({ ...productData, store_id: storeId });
      toast.success('Product added successfully!');
      setProductData(null);
      setShowCommission(false);
      onClose();
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  const totalCost = productData ? productData.price * productData.quantity : 0;

  return (
    <>
      <div className={styleAddPr.modalOverlay}>
        <div className={styleAddPr.modal}>
          <h2 className={styleAddPr.modalTitle}>Add Product</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ isSubmitting }) => (
              <Form className={styleAddPr.form}>
                <div className={styleAddPr.formGroup}>
                  <label htmlFor="name" className={styleAddPr.inputLabel}>Product Name</label>
                  <Field type="text" name="name" id="name" className={styleAddPr.inputField} />
                  <ErrorMessage name="name" component="div" className={styleAddPr.error} />
                </div>

                <div className={styleAddPr.formGroup}>
                  <label htmlFor="short_description" className={styleAddPr.inputLabel}>Short Description</label>
                  <Field type="text" name="short_description" id="short_description" className={styleAddPr.inputField} />
                  <ErrorMessage name="short_description" component="div" className={styleAddPr.error} />
                </div>

                <div className={styleAddPr.formGroup}>
                  <label htmlFor="image_url" className={styleAddPr.inputLabel}>Image URL</label>
                  <Field type="text" name="image_url" id="image_url" className={styleAddPr.inputField} />
                  <ErrorMessage name="image_url" component="div" className={styleAddPr.error} />
                </div>

                <div className={styleAddPr.formGroup}>
                  <label htmlFor="price" className={styleAddPr.inputLabel}>Price</label>
                  <Field type="number" name="price" id="price" className={styleAddPr.inputField} />
                  <ErrorMessage name="price" component="div" className={styleAddPr.error} />
                </div>

                <div className={styleAddPr.formGroup}>
                  <label htmlFor="unit_of_measure" className={styleAddPr.inputLabel}>Unit of Measure</label>
                  <Field as="select" name="unit_of_measure" id="unit_of_measure" className={styleAddPr.inputField}>
                    <option value="">Select unit</option>
                    <option value="кг">кг</option>
                    <option value="шт">шт</option>
                  </Field>
                  <ErrorMessage name="unit_of_measure" component="div" className={styleAddPr.error} />
                </div>

                <div className={styleAddPr.formGroup}>
                  <label htmlFor="quantity" className={styleAddPr.inputLabel}>Quantity</label>
                  <Field type="number" name="quantity" id="quantity" className={styleAddPr.inputField} />
                  <ErrorMessage name="quantity" component="div" className={styleAddPr.error} />
                </div>

                <div className={styleAddPr.buttons}>
                  <button type="submit" disabled={isSubmitting} className={styleAddPr.submitBtn}>Add</button>
                  <button type="button" onClick={onClose} className={styleAddPr.cancel}>Cancel</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {showCommission && (
        <CommissionModal
          isOpenCommMod={showCommission}
          onCloseCommMod={() => setShowCommission(false)}
          totalCost={totalCost}
          onPay={handlePayCommission}
        />
        )}


    </>
  );
};

export default AddProductModal;
