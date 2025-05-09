import { Outlet } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from './components/MainPage';

export default function App() {
  return (
    <div>
      <MainPage Component={<Outlet />} />
      <ToastContainer />
    </div>
  );
}
