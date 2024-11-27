import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from './HomePage.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { IoLocationOutline, IoFilter } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { auth, db } from '../../Services/firebaseConfig';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import Header from "../Header/header"

function HomePage() {
    const [parkingLots, setParkingLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [sortOption, setSortOption] = useState('');

    const navigate = useNavigate();

    
    const Reservas = () => navigate('/Reservas');
    const VisualizarCarros = () => navigate('/RegisterCar');
    const Profile = () => navigate('/Profile');

    useEffect(() => {
        const fetchParkingLots = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "ParkingLots"));
                const lots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setParkingLots(lots);
                setLoading(false);
            } catch (err) {
                setError("Erro ao carregar os estacionamentos.");
                setLoading(false);
            }
        };

        fetchParkingLots();
    }, []);


    const handleCardClick = (id) => navigate(`/detalhes/${id}`);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

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
        parkingLots.filter(lot => lot.address   .toLowerCase().includes(searchTerm.toLowerCase()))
    );

    function Feedback() {
        navigate("/Feedback")
    }

    return (
        <div>
           <Header/>

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
                            {showFilter && (
                                <div className={Styles.FilterDropdown}>
                                    <button onClick={() => handleSortChange('highToLow')}>Maior valor</button>
                                    <button onClick={() => handleSortChange('lowToHigh')}>Menor valor</button>
                                </div>
                            )}
                        </div>
                        <IoFilter
                                className={Styles.FilterIcon}
                                size={24}
                                onClick={() => setShowFilter(!showFilter)}
                            />
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
                            <img src={lot.imageURL || '/default-image.png'} alt={lot.name} className={Styles.CardImage} />
                            <IoLocationOutline size={24} color="#277D8E" className={Styles.IconAddress}/>
                            <h2>{lot.address}</h2>
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
