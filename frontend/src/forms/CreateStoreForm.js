import React, { useState, useEffect, useContext } from 'react';
import stylesCrFr from '../css/CreateStoreForm.module.css';
import { createStore, getRegionsByCountryId, getStoreCategories } from '../api';
import { AuthContext } from '../context/AuthContext';

const CreateStoreForm = ({ onStoreCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    region_id: '',
    store_category_id: '',
  });
  const { user } = useContext(AuthContext);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const regionsData = await getRegionsByCountryId(user.country_id);
        setRegions(regionsData);

        const categoriesData = await getStoreCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch regions or categories:', error);
      }
    }
    fetchData();
  }, [user.country_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStore(formData);
      alert('Дүкен сәтті қосылды!');
      onStoreCreated();
    } catch (error) {
      alert('Қате: дүкен қосу мүмкін болмады.');
      console.error(error);
    }
  };

  return (
    <form className={stylesCrFr.formContainer} onSubmit={handleSubmit}>
      <div className={stylesCrFr.formGroup}>
        <label className={stylesCrFr.inputLabel} htmlFor="name">Дүкен атауы</label>
        <input 
          name="name" 
          className={stylesCrFr.inputField} 
          placeholder="Дүкен атауы" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className={stylesCrFr.formGroup}>
        <label className={stylesCrFr.inputLabel} htmlFor="description">Сипаттама</label>
        <textarea 
          name="description" 
          className={stylesCrFr.textareaField} 
          placeholder="Сипаттама" 
          value={formData.description} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className={stylesCrFr.formGroup}>
        <label className={stylesCrFr.inputLabel} htmlFor="image_url">Сурет URL</label>
        <input 
          name="image_url" 
          className={stylesCrFr.imageField} 
          placeholder="Сурет URL" 
          value={formData.image_url} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className={stylesCrFr.formGroup}>
        <label className={stylesCrFr.inputLabel} htmlFor="region_id">Қаланы таңдаңыз</label>
        <select 
          name="region_id" 
          className={stylesCrFr.selectField} 
          value={formData.region_id} 
          onChange={handleChange} 
          required
        >
          <option value="">Қаланы таңдаңыз</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className={stylesCrFr.formGroup}>
        <label className={stylesCrFr.inputLabel} htmlFor="store_category_id">Санатты таңдаңыз</label>
        <select 
          name="store_category_id" 
          className={stylesCrFr.selectField} 
          value={formData.store_category_id} 
          onChange={handleChange} 
          required
        >
          <option value="">Санатты таңдаңыз</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className={stylesCrFr.submitBtn}>Қосу</button>
    </form>
  );
};

export default CreateStoreForm;
