import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicOnlyRoute; 