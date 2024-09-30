import React from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './UsuarioNaoAutorizado.module.css'; 

function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className={Styles.teste}>
      <h1>Você não está autorizado a acessar esta página.</h1>
      <p>Por favor, faça login para continuar.</p>
      <button onClick={() => navigate('/')}>Voltar para a página de login</button>
    </div>
  );
}

export default NotAuthorized;
