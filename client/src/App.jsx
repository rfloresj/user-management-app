import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/admin' element={<AdminPanel />} />
        </Route>
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
