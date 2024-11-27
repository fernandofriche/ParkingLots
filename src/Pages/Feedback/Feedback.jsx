import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  emailjs  from '@emailjs/browser';
import Styles from './Feedback.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { FaUser, FaEnvelope, FaCommentAlt, FaStar } from 'react-icons/fa';
import Header from "../Header/header"

function Feedback() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        mensagem: '',
        avaliacao: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const serviceId = 'service_tc97xvr';
        const templateId = 'template_xz3e2cg';
        const publicKey = 'h2lfepIlAepnAaV2Y';
    
        const templateParams = {
            from_name: formData.nome,
            from_email: formData.email,
            message: formData.mensagem,
            rating: formData.avaliacao
        };
    
        emailjs.send(serviceId, templateId, templateParams,publicKey)
            .then((response) => {
                console.log('Email enviado com sucesso!', response.status, response.text);
                alert('Obrigado pelo seu feedback!');
                setFormData({ nome: '', email: '', mensagem: '', avaliacao: '' });
            })
            .catch((error) => {
                console.error('Erro ao enviar email:', error);
                alert('Desculpe, houve um erro ao enviar o feedback.');
            });
    };
   
    return (
        <div>
           <Header/>

            <main className={Styles.FeedbackMainContent}>
                <h1 className={Styles.Title}>Envie seu Feedback</h1>
                <form className={Styles.FormContainer} onSubmit={handleSubmit}>
                    <div className={Styles.FormGroup}>
                        <label htmlFor="nome">
                            <FaUser /> Nome Completo
                        </label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={Styles.FormGroup}>
                        <label htmlFor="email">
                            <FaEnvelope /> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={Styles.FormGroup}>
                        <label htmlFor="avaliacao">
                            <FaStar /> Avaliação
                        </label>
                        <select
                            id="avaliacao"
                            name="avaliacao"
                            value={formData.avaliacao}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="5">Excelente</option>
                            <option value="4">Muito Bom</option>
                            <option value="3">Bom</option>
                            <option value="2">Ruim</option>
                            <option value="1">Muito Ruim</option>
                        </select>
                    </div>
                    <div className={Styles.FormGroup}>
                        <label htmlFor="mensagem">
                            <FaCommentAlt /> Mensagem
                        </label>
                        <textarea
                            id="mensagem"
                            name="mensagem"
                            rows="4"
                            value={formData.mensagem}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className={Styles.SubmitButton}>
                        Enviar Feedback
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Feedback;