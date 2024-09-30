import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from './HomePage.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import AeroportoImage from '../../assets/Cards/Aeroporto.svg';
import CentralImage from '../../assets/Cards/Central.svg';
import ShoppingImage from '../../assets/Cards/Shopping.svg';
import PraiaImage from '../../assets/Cards/Praia.svg';
import HospitalImage from '../../assets/Cards/Hospital.svg';
import EstadioImage from '../../assets/Cards/Estadio.svg';
import UniversidadeImage from '../../assets/Cards/Universidade.svg';
import BairroImage from '../../assets/Cards/Bairro.svg';
import MercadoImage from '../../assets/Cards/Mercado.svg';
import ParqueImage from '../../assets/Cards/Parque.svg';
import EmpresarialImage from '../../assets/Cards/Empresarial.svg';
import HotelImage from '../../assets/Cards/Hotel.svg';
import EventosImage from '../../assets/Cards/Eventos.svg';
import PortoImage from '../../assets/Cards/Porto.svg';
import NorteImage from '../../assets/Cards/Norte.svg';
import { IoLocationOutline } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import { FaSearch, FaFilter } from "react-icons/fa";


function HomePage() {
    const [parkingLots, setParkingLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [sortOption, setSortOption] = useState('');
    
    const navigate = useNavigate();



    function Reservas() {
        navigate('/Reservas')
    }

    const VisualizarCarros = () => {
        navigate('/RegisterCar')
    }

    const Profile = () => {
        navigate('/Profile')
    }

    useEffect(() => {
        fetch('/parkinglots.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados.');
                }
                return response.json();
            })
            .then(data => {
                setParkingLots(data.parkingLots);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleCardClick = (id) => {
        navigate(`/detalhes/${id}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        setShowFilter(false);
    };

    const sortParkingLots = (lots) => {
        if (sortOption === 'highToLow') {
            return [...lots].sort((a, b) => b.hourlyRate - a.hourlyRate);
        } else if (sortOption === 'lowToHigh') {
            return [...lots].sort((a, b) => a.hourlyRate - b.hourlyRate);
        }
        return lots;
    };

    const filteredParkingLots = sortParkingLots(
        parkingLots.filter(lot =>
            lot.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    // Crie um mapeamento de ID para imagens
    const imageMap = {
        1: CentralImage,
        2: ShoppingImage,
        3: AeroportoImage,
        4: PraiaImage,
        5: HospitalImage,
        6: EstadioImage,
        7: UniversidadeImage,
        8: BairroImage,
        9: MercadoImage,
        10: ParqueImage,
        11: EmpresarialImage,
        12: HotelImage,
        13: EventosImage,
        14: PortoImage,
        15: NorteImage
    };

    // Filtra os estacionamentos com base no termo de pesquisa
    //const filteredParkingLots = parkingLots.filter(lot =>
    //    lot.name.toLowerCase().includes(searchTerm.toLowerCase())
    //);

    return (
        <div>
            <header className={Styles.Cabecalho}>
                <div className={Styles.DivLista}>
                    <ul>
                        <li>
                            <a href="/HomePage">
                                <img className={Styles.Logo} src={LogoNew} alt="Logo" />
                            </a>
                        </li>
                        <li><a href="#estacionamentos">Estacionamentos</a></li>
                        <li><a href="#reservas" onClick={Reservas}>Reservas</a></li>
                        <li><a href="#seu-carro" onClick={VisualizarCarros}>Seu Carro</a></li>
                        <li><a href="#parceiros">Como funciona</a></li>
                        <li>
                            <a href="#usuario" onClick={Profile}>
                                <img src={CircleUser} alt="User" className={Styles.UserIcon} />
                            </a>
                        </li>
                    </ul>
                </div>
            </header>

            <main className={Styles.MainContent}>
                <h1>Nossos Estacionamentos</h1>

                <div className={Styles.SearchBarContainer}>
                    <div className={Styles.SearchBarWrapper}>
                        <input
                            type="text"
                            placeholder="Onde você quer estacionar?"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={Styles.SearchBar}
                        />
                        <FaSearch className={Styles.SearchIcon} size={24} />
                        <div className={Styles.FilterContainer}>
                            <IoFilter
                                className={Styles.FilterIcon}
                                size={24}
                                onClick={() => setShowFilter(!showFilter)}
                            />
                            {showFilter && (
                                <div className={Styles.FilterDropdown}>
                                    <button onClick={() => handleSortChange('highToLow')}>Maior valor</button>
                                    <button onClick={() => handleSortChange('lowToHigh')}>Menor valor</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {loading && <p>Carregando estacionamentos...</p>}
                {error && <p>Error: {error}</p>}

                <div className={Styles.CardContainer}>
                    {filteredParkingLots.map(lot => (
                        <div
                            key={lot.id}
                            className={Styles.Card}
                            onClick={() => handleCardClick(lot.id)}
                        >
                            <img src={imageMap[lot.id]} alt={lot.name} className={Styles.CardImage} />
                            <IoLocationOutline size={24} color="#277D8E" />
                            <h2>{lot.name}</h2>
                            <p>Preço por hora: R$ {lot.hourlyRate}</p>

                            <button className={Styles.BtnReserar}>Reservar</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default HomePage;
