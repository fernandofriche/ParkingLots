import React from "react";
import Styles from './LandingPage.module.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from '../../assets/Images/Logo.png'


function LandingPage() {

    const navigate = useNavigate;
    const teste = useState();


    const AcessarPortal = () => {
        navigate('/')
    }


    return (
        <>
            <header className={Styles.Cabecalho}>
                <div className={Styles.Acesso}>
                    <h1>PARKING</h1>
                    <h1><img src={Logo} alt="" srcset="" />LOTS</h1>
                </div>  
                <button>Acessar ao portal</button>
            </header>

        </>
    )

}
export default LandingPage;