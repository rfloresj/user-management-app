import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const ProtectedRoute = () => {
  const [user] = useAuthState(auth);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
