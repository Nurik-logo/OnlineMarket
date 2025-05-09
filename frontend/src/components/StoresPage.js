import React, { useEffect, useState } from 'react';
import styles from '../css/StoresPage.module.css';
import { getStores, getRegionNameById } from '../api';
import { FaStar, FaArrowRight, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [regions, setRegions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoresWithRegions = async () => {
      try {
        const storeData = await getStores();
        setStores(storeData);
        setFilteredStores(storeData);

        const regionNames = {};
        for (const store of storeData) {
          if (!regionNames[store.region_id]) {
            const regionName = await getRegionNameById(store.region_id);
            regionNames[store.region_id] = regionName;
          }
        }
        setRegions(regionNames);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    };

    fetchStoresWithRegions();
  }, []);

  useEffect(() => {
    let result = [...stores];

    if (searchTerm) {
      result = result.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter) {
      result = result.filter(store => store.region_id === parseInt(regionFilter));
    }

    if (statusFilter) {
      result = result.filter(store => store.status === statusFilter);
    }

    if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredStores(result);
  }, [searchTerm, regionFilter, statusFilter, sortOption, stores]);

  const handleVisitStore = (storeId) => {
    navigate(`/store/${storeId}`);
  };

  return (
    <div className={styles.storesContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>🛒 Featured Stores</h1>
        <p className={styles.subtitle}>Explore top-rated stores in your region with beautiful, responsive layout and smart filters.</p>
      </div>

      <div className={styles.filtersWrapper}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by store name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterSelects}>
          <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
            <option value="">🌍 All Regions</option>
            {Object.entries(regions).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">📊 All Status</option>
            <option value="active">✅ Active</option>
            <option value="inactive">⛔ Inactive</option>
          </select>

          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">🔃 Sort By</option>
            <option value="name">🅰️ Name (A-Z)</option>
            <option value="rating">⭐ Rating (High-Low)</option>
          </select>
        </div>
      </div>

      {/* Store Grid */}
      <div className={styles.storeGrid}>
        {filteredStores.map((store) => (
          <div key={store.id} className={styles.storeCard}>
            <div className={styles.imageContainer}>
              <img src={store.image_url} alt={store.name} className={styles.storeImage} />
              <span className={`${styles.statusBadge} ${store.status === 'active' ? styles.active : styles.inactive}`}>
                {store.status}
              </span>
            </div>
            <div className={styles.storeContent}>
              <h3 className={styles.storeName}>{store.name}</h3>
              <p className={styles.storeRegion}><FaMapMarkerAlt /> {regions[store.region_id] || 'Loading...'}</p>
              <p className={styles.storeDescription}>{store.description}</p>
              <div className={styles.storeFooter}>
                <div className={styles.rating}><FaStar color="#FFD700" /> {store.rating || '0.0'}</div>
                <button
                  className={styles.visitBtn}
                  onClick={() => handleVisitStore(store.id)}
                >
                  Visit Store <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoresPage;
