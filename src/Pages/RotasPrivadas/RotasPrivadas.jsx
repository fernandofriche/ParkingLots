import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../Services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const RotaPrivada = () => {
  const [loading, setLoading] = useState(true); // Estado para carregar
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Carregamento concluído
    });

    // Cleanup da subscrição quando o componente desmontar
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Carregando...</p>; // Mostra algo enquanto o status de autenticação está carregando
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/UserNaoAutorizado" />;
};

export default RotaPrivada;
