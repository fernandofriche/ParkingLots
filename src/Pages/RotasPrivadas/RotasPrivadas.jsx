import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../Services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const RotaPrivada = () => {
  const [loading, setLoading] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); 
    });

    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Carregando...</p>; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/UserNaoAutorizado" />;
};

export default RotaPrivada;
