import React, { useEffect, useState, useContext } from 'react';
import styles from '../css/TransactionsPage.module.css';
import { getAllTransactions } from '../api';
import { AuthContext } from '../context/AuthContext';
import { format, isSameDay, isSameWeek, isSameMonth, isSameYear, parseISO } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionsPage = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState({ daily: 0, weekly: 0, monthly: 0, yearly: 0 });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getAllTransactions();
      const userTransactions = data.filter(
        (tx) =>
          (tx.buyer_id === user.id && !tx.is_credit) ||
          (tx.seller_id === user.id && tx.is_credit)
      );
      setTransactions(userTransactions);
      analyze(userTransactions);
    };
    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id]);

  const analyze = (txs) => {
    const now = new Date();
    let daily = 0, weekly = 0, monthly = 0, yearly = 0;

    txs.forEach((tx) => {
      const date = parseISO(tx.created_at);
      const value = parseFloat(tx.amount);

      if (isSameDay(date, now)) daily += value;
      if (isSameWeek(date, now, { weekStartsOn: 1 })) weekly += value;
      if (isSameMonth(date, now)) monthly += value;
      if (isSameYear(date, now)) yearly += value;
    });

    setFiltered({ daily, weekly, monthly, yearly });

    setChartData({
      labels: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
      datasets: [
        {
          label: 'Transaction Amount',
          data: [daily, weekly, monthly, yearly],
          borderColor: '#ff7c7c',
          backgroundColor: 'rgba(255, 124, 124, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>📊 Transaction Analysis</h1>

      <div className={styles.analysisBox}>
        <div className={styles.metric}><span>Daily:</span> {filtered.daily.toFixed(2)}<b>₸</b></div>
        <div className={styles.metric}><span>Weekly:</span> {filtered.weekly.toFixed(2)}<b>₸</b></div>
        <div className={styles.metric}><span>Monthly:</span> {filtered.monthly.toFixed(2)}<b>₸</b></div>
        <div className={styles.metric}><span>Yearly:</span> {filtered.yearly.toFixed(2)}<b>₸</b></div>
      </div>

      {chartData?.datasets?.length > 0 && (
        <div className={styles.chartContainer}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: {
                  display: true,
                  text: 'Transaction Trends',
                  font: { size: 18 },
                },
              },
              animation: {
                duration: 1500,
                easing: 'easeInOutQuart',
              },
            }}
          />
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className={tx.is_credit ? styles.income : styles.expense}>
              <td>{tx.id}</td>
              <td>{tx.type}</td>
              <td>{tx.description}</td>
              <td>{parseFloat(tx.amount).toFixed(2)}₸</td>
              <td>{tx.status}</td>
              <td>{format(parseISO(tx.created_at), 'dd MMM yyyy HH:mm')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;
