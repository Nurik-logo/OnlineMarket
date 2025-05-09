import React, { useContext, useEffect } from 'react';
import '../css/Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RegionForm from '../forms/RegionForm';

const Sidebar = ({ Component }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const body = document.querySelector('body');
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector(".toggle");
    const searchBtn = document.querySelector(".search-box");
    const modeSwitch = document.querySelector(".toggle-switch");
    const modeText = document.querySelector(".mode-text");

    const handleToggle = () => sidebar.classList.toggle("close");
    const handleSearch = () => sidebar.classList.remove("close");
    const handleModeSwitch = () => {
      body.classList.toggle("dark");
      modeText.innerText = body.classList.contains("dark") ? "Light mode" : "Dark mode";
    };

    toggle?.addEventListener("click", handleToggle);
    searchBtn?.addEventListener("click", handleSearch);
    modeSwitch?.addEventListener("click", handleModeSwitch);

    return () => {
      toggle?.removeEventListener("click", handleToggle);
      searchBtn?.removeEventListener("click", handleSearch);
      modeSwitch?.removeEventListener("click", handleModeSwitch);
    };
  }, []);

  if (loading || !user) return null;
  return (
    <div>
      <nav className="sidebar close">
        <header>
          <div className="image-text">
            <span className="image">
              <Link to="/profile">
                <img src={user.image} alt="User" />
              </Link>
            </span>
            <div className="text logo-text">
              <span className="name">{user.firstname} {user.lastname}</span>
              <span className="profession">{user.email}</span>
            </div>
          </div>
          <i className='bx bx-chevron-right toggle'></i>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <li className="search-box">
              <i className='bx bx-search icon'></i>
              <input type="text" placeholder="Search" />
            </li>

            <ul className="menu-links">
              <li className="nav-link">
                {user.role === "admin" ? (
                  <Link to="/stores/acces">
                  <i className='bx bx-store icon'></i>
                  <span className="text nav-text">Дүкендерге рұқсат</span>
                </Link>
                ):(
                  <Link to="/stores">
                  <i className='bx bx-store icon'></i>
                  <span className="text nav-text">Stores </span>
                </Link>
                )}
              </li>

              <li className="nav-link">
                <Link to="/my-stores">
                  <i className='bx bxs-store icon'></i>
                  <span className="text nav-text">My Stores</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="/users">
                  <i className='bx bx-user icon'></i>
                  <span className="text nav-text">Users</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="/create-post">
                  <i className='bx bx-edit icon'></i>
                  <span className="text nav-text">Create Post</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="/create-category">
                  <i className='bx bx-category icon'></i>
                  <span className="text nav-text">Create Category</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="#">
                  <i className='bx bx-bell icon'></i>
                  <span className="text nav-text">Notifications</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="/transactions">
                  <i className='bx bx-pie-chart-alt icon'></i>
                  <span className="text nav-text">Analytics</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="/wallet">
                  <i className='bx bx-wallet icon'></i>
                  <span className="text nav-text">Wallets</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="bottom-content">
            <li>
              <Link to="/logout">
                <i className='bx bx-log-out icon'></i>
                <span className="text nav-text">Logout</span>
              </Link>
            </li>

            <li className="mode">
              <div className="sun-moon">
                <i className='bx bx-moon icon moon'></i>
                <i className='bx bx-sun icon sun'></i>
              </div>
              <span className="mode-text text">Dark mode</span>
              <div className="toggle-switch">
                <span className="switch"></span>
              </div>
            </li>
          </div>
        </div>
      </nav>

      <section className="home" style={{ backgroundColor: 'linear-gradient(135deg, #e3f2fd, #ffffff' }}>
        {user.region_id == null && user.country_id == null ? (
          <RegionForm />
        ) : (
          Component
        )}
      </section>
    </div>
  );
};

export default Sidebar;
