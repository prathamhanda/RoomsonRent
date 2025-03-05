import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OwnerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'landlord') {
    return <Navigate to="/" />;
  }

  return children;
};

export default OwnerRoute; 