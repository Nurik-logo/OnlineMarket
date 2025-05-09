import React, { useEffect, useState, useContext } from 'react';
import stylesRegionForm from '../css/RegionForm.module.css';
import { AuthContext } from '../context/AuthContext';
import {
  getCountries,
  getRegionsByCountryId,
  updateUserLocation
} from '../api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegionForm = () => {
  const { user, login } = useContext(AuthContext);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getRegionsByCountryId(selectedCountry).then(setRegions).catch(console.error);
    } else {
      setRegions([]);
    }
  }, [selectedCountry]);

  const handleConfirm = async () => {
    if (!selectedCountry || !selectedRegion) {
      toast.warn('Please select both country and region!');
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserLocation(user.id, selectedCountry, selectedRegion);
      login(res.token);
      toast.success('Location updated successfully!');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error confirming region:', err);
      toast.error('Failed to update location!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={stylesRegionForm.regionFormContainer}>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className={stylesRegionForm.regionCard}>
        <h2 className={stylesRegionForm.title}>🌍 Select Your Location</h2>

        <div className={stylesRegionForm.dropdowns}>
          <select
            className={stylesRegionForm.selectInput}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className={stylesRegionForm.selectInput}
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            disabled={!selectedCountry}
          >
            <option value="">Select Region</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <button
          className={stylesRegionForm.confirmBtn}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default RegionForm;
