import React from 'react';
import Sidebar from './Sidebar';
import styles from '../css/Sidebar.css';

const MainPage = ({ Component }) => {
  return (
    <div className={styles.pageWrapper}>
      <Sidebar Component={Component} />
    </div>
  );
};

export default MainPage;
