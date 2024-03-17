import React, { useState, useEffect } from 'react';
import log from 'loglevel';
import Mobile from './Mobile';
import MobileDetails from './MobileDetails';
import VideoPlayer from './VideoPlayer';
import FilterComponent from './FilterComponent';
import MobileDataTable from './MobileDataTable'; 
import "./App.css"

log.setLevel('info');

function App() {
  // Déclaration des variables d'état pour gérer différents aspects de l'interface utilisateur et de la logique de l'application.
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [simulationData, setSimulationData] = useState(null);
  const [numMobilesToShow, setNumMobilesToShow] = useState(100);
  const [refreshPeriodMs, setRefreshPeriodMs] = useState(100);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [selectedMobile, setSelectedMobile] = useState(null);
  const [socket, setSocket] = useState(null);
  const [updatedNumMobiles, setUpdatedNumMobiles] = useState(numMobilesToShow);
  const [numVideos, setNumVideos] = useState(1);
  const [updatedNumVideos, setUpdatedNumVideos] = useState(1);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [x0] = useState(0);
  const [y0] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(10000);
  const [selectedColors, setSelectedColors] = useState(['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'VIOLET']);
  const [selectedShapes, setSelectedShapes] = useState(['SQUARE', 'CIRCLE', 'TRIANGLE', 'DIAMOND']);
  const [numSectors, setNumSectors] = useState(8);
  const [numQuarters, setNumQuarters] = useState(4);
  const [updatedNumSectors, setUpdatedNumSectors] = useState(8);
  const [updatedNumQuarters, setUpdatedNumQuarters] = useState(4);
  const [searchedMobileId, setSearchedMobileId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup_2, setShowPopup_2] = useState(false);
  const [whitePercentage, setWhitePercentage] = useState(24);
  const [newPercentage, setNewPercentage] = useState(24);
  const [palebluePercentage, setPaleBluePercentage] = useState(49);
  const [newPercentage_2, setNewPercentage_2] = useState(49);
  const [bluePercentage, setBluePercentage] = useState(74);
  const [newPercentage_3, setNewPercentage_3] = useState(74);

  useEffect(() => {
    log.info('Component App rendered');
  }, []);

  // Etablir une connexion WebSocket pour les données de simulation, traiter les messages entrants et fermer la connexion lors du nettoyage
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:7000/ws/simulation/sitac');
  
    newSocket.onopen = () => {
      setIsConnected(true);
      setErrorMessage('');
      setSocket(newSocket);
      log.info('WebSocket connection established');
    };
  
    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      simulationMessage(message);
    };
  
    newSocket.onerror = (error) => {
      setIsConnected(false);
      setErrorMessage('Error connecting to server:');
      console.error('Error connecting to server:', error);
      log.error('Error connecting to server:', error);
    };
  
    return () => {
      if (newSocket) {
        newSocket.close();
        log.info('WebSocket connection closed');
      }
    };
  }, []);
  
  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket connection is not open.');
    }
  };

  // Fonction pour traiter les messages de simulation
  const simulationMessage = (message) => {
    const { eventType, config, mobiles } = message;
  
    switch (eventType) {
      case 'INITIAL_LOAD':
        log.info('Handling INITIAL_LOAD event');
        setSimulationData({ config, mobiles });
        break;
      case 'MOBILES_CREATED':
        log.info('Handling MOBILES_CREATED event');
        setSimulationData((prevData) => ({
          ...prevData,
          mobiles: {
            ...prevData.mobiles,
            ...mobiles
          }
        }));
        break;
      case 'MOBILES_UPDATED':
        setSimulationData((prevData) => {
          const updatedMobiles = { ...prevData.mobiles };
          Object.keys(mobiles).forEach((mobileId) => {
            if (updatedMobiles[mobileId]) {
              const newMobileData = mobiles[mobileId];
              updatedMobiles[mobileId] = {
                ...updatedMobiles[mobileId],
                ...newMobileData,
                kinematics: {
                  ...updatedMobiles[mobileId].kinematics,
                  ...newMobileData.kinematics
                }
              };
            }
          });
          return {
            ...prevData,
            mobiles: updatedMobiles
          };
        });
        break;
      case 'MOBILES_DELETED':
        log.info('Handling MOBILES_DELETED event');
        setSimulationData((prevData) => {
          const updatedMobiles = { ...prevData.mobiles };
          Object.keys(mobiles).forEach((mobileId) => {
            delete updatedMobiles[mobileId];
          });
          return {
            ...prevData,
            mobiles: updatedMobiles
          };
        });
        break;
      case 'SIMULATION_CONFIG_UPDATED':
        log.info('Handling SIMULATION_CONFIG_UPDATED event');
        setSimulationData((prevData) => ({
          ...prevData,
          config
        }));
        break;
      default:
        log.warn('Unknown event type:', eventType);
    }
  };    

  // Pause et reprise de la simulation
  const toggleSimulation = () => {
    const action = isSimulationRunning ? 'pause' : 'resume';
    fetch(`http://localhost:7000/api/simulation/sitac/${action}`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            const errorMessage = `Error ${action} of the simulation`;
            throw new Error(errorMessage);
        }
        setIsSimulationRunning(!isSimulationRunning);
    })
    .catch(error => {
        console.error(`Error ${action} of the simulation :`, error);
    });
    console.log(`Simulation ${action}d`);
  };
  
  const handleUpdateNumMobiles = () => {
    if (updatedNumMobiles > Object.keys(simulationData.mobiles).length) {
      fetch('http://localhost:7000/api/simulation/sitac/size/' + updatedNumMobiles, {
        method: 'PUT'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Echec update of the simulation size');
        }
        setNumMobilesToShow(updatedNumMobiles);
      })
      .catch(error => {
        console.error('Error update of the simulation size :', error);
      });
      console.log('Number of mobiles updated');
    } else if (updatedNumMobiles < Object.keys(simulationData.mobiles).length) {
      const mobileIdsToDelete = Object.keys(simulationData.mobiles).slice(updatedNumMobiles);
  
      fetch('http://localhost:7000/api/simulation/sitac/size/' + updatedNumMobiles, {
        method: 'PUT',
        body: JSON.stringify({ deletedMobiles: mobileIdsToDelete }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error delete mobile :');
        }
        setNumMobilesToShow(updatedNumMobiles);
      })
      .catch(error => {
        console.error('Error delete mobile :', error);
      });
      console.log('Number of mobiles updated');
    } else {
      setNumMobilesToShow(updatedNumMobiles);
      console.log('Number of mobiles updated');
    }
  };
  
  const handleRefreshPeriodChange = (event) => {
    const periodMs = parseInt(event.target.value);
    setRefreshPeriodMs(periodMs);
    console.log('Refresh period changed to', periodMs);
  };

  // Fonction pour modifier le taux de rafraichissement  
  const updateSimulationParams = () => {
    const updatedRefreshPeriodMs = Math.max(100, refreshPeriodMs);
  
    fetch(`http://localhost:7000/api/simulation/sitac/refreshperiod/${updatedRefreshPeriodMs}`, {
      method: 'PUT'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Echec refreshperiod');
      }
      setSimulationData(prevData => ({
        ...prevData,
        config: {
          ...prevData.config,
          updatePeriodMs: updatedRefreshPeriodMs
        }
      }));
    })
    .catch(error => {
      console.error('Error refreshperiod :', error);
    });
  
    setSimulationData(prevData => ({
      ...prevData,
      numMobilesToShow: numMobilesToShow
    }));
  
    setRefreshPeriodMs(updatedRefreshPeriodMs);
    console.log('Simulation parameters updated');
  };
  
  const selectMobile = (mobileId) => {
    if (selectedMobile === mobileId) {
      setSelectedMobile(null);
    } else {
      setSelectedMobile(mobileId);
    }
    console.log('Selected mobile:', mobileId);
  };
  
  const handleUpdateVideos = () => {
    let updatedNum = updatedNumVideos;
    if (updatedNumVideos > 20) {
        updatedNum = 20;
    }
    setNumVideos(updatedNum);
    setUpdatedNumVideos(updatedNum);
    console.log('Number of videos updated to', updatedNum);
  };
  
  const handleUpdateZoomLevel = () => {
    if (zoomLevel >= 2000 && zoomLevel <= 10000) {
      setZoomFactor(10000 / zoomLevel);
    } else {
      console.error('Le niveau de zoom doit être compris entre 2000 et 10000.');
    }
    console.log('Zoom level updated');
  };  

  const handleZoomIn = () => {
    const newZoomLevel = Math.max(zoomLevel / 1.2, 2000);
    setZoomLevel(newZoomLevel);
    setZoomFactor(10000 / newZoomLevel);
  };
  
  const handleZoomOut = () => {
    const newZoomLevel = Math.min(zoomLevel * 1.2, 10000);
    setZoomLevel(newZoomLevel);
    setZoomFactor(10000 / newZoomLevel);
  };

  const radianToDegree = (radian) => {
    let degree = radian * (180 / Math.PI);
    return degree;
  };

  const handleColorChange = (color) => {
    const colorIndex = selectedColors.indexOf(color);
    if (colorIndex === -1) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter(c => c !== color));
    }
  };
  
  const handleShapesChange = (shape) => {
    const shapeIndex = selectedShapes.indexOf(shape);
    if (shapeIndex === -1) {
      setSelectedShapes([...selectedShapes, shape]);
    } else {
      setSelectedShapes(selectedShapes.filter(s => s !== shape));
    }
  };
  
  const filteredMobiles = simulationData ? Object.values(simulationData.mobiles).filter(mobile => {
    return (
      selectedColors.includes(mobile.color) &&
      selectedShapes.includes(mobile.shape)
    );
  }) : [];

  const handleNumSectorsChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setUpdatedNumSectors(value);
    } else {
      setUpdatedNumSectors(0);
    }
  };

  const handleNumQuartersChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setUpdatedNumQuarters(value);
    } else {
      setUpdatedNumQuarters(0);
    }
  };

  const handleUpdateNumSectors = () => {
    setNumSectors(updatedNumSectors);
  };

  const handleUpdateNumQuarters = () => {
    setNumQuarters(updatedNumQuarters);
  };

  // Fonction pour calculer et créer les secteurs
  const sectorRadius = (500 / (numSectors * 2)) * zoomFactor;

  const sectors = [];
  for (let i = 1; i <= numSectors; i++) {
    const radius = sectorRadius * i;
    const angle = 0;
    const xM = 250 + radius * Math.cos(angle * Math.PI / 180);
    const yM = 250 + radius * Math.sin(angle * Math.PI / 180);
    const x2M = 250 - radius * Math.cos(angle * Math.PI / 180);
    const y2M = 250 - radius * Math.sin(angle * Math.PI / 180);
    sectors.push(
      <g key={`sector-group-${i}`}>
        <circle
          cx={250}
          cy={250}
          r={radius}
          fill="none"
          stroke="black"
          strokeDasharray="5,5"
          strokeWidth={1}
        />
        {/* Afficher les coordonnées de chaque secteur */}
        <text
          x={250}
          y={240 + radius}
          textAnchor="middle"
          alignmentBaseline="middle"
          dominantBaseline="central"
          fontSize="10"
        >
          -{(i * 10000 / numSectors).toFixed(0)}
        </text>
        <text
          x={250}
          y={260 - radius}
          textAnchor="middle"
          alignmentBaseline="middle"
          dominantBaseline="central"
          fontSize="10"
        >
          {(i * 10000 / numSectors).toFixed(0)}
        </text>
        <text
        x={250 + radius}
        y={260}
        textAnchor="middle"
        alignmentBaseline="middle"
        dominantBaseline="central"
        fontSize="10"
        transform={`rotate(90, ${xM}, ${yM})`}
      >
        {(i * 10000 / numSectors).toFixed(0)}
      </text>
      <text
        x={250 - radius}
        y={260}
        textAnchor="middle"
        alignmentBaseline="middle"
        dominantBaseline="central"
        fontSize="10"
        transform={`rotate(270, ${x2M}, ${y2M})`}
      >
        -{(i * 10000 / numSectors).toFixed(0)}
      </text>
      </g>
    );
  }  

  // Calculer la densité par quartiers
  const calculatePercentageByQuarters = (numQuarters) => {
    const numMobilesByQuarter = new Array(numQuarters).fill(0);

    for (const mobile of filteredMobiles) {
        const xPos = mobile.kinematics.xM;
        const yPos = mobile.kinematics.yM;

        const quarterIndex = Math.floor((Math.atan2(yPos, xPos) + Math.PI) / (Math.PI * 2 / numQuarters));

        numMobilesByQuarter[quarterIndex]++;
    }

    const totalMobiles = filteredMobiles.length;
    const percentages = numMobilesByQuarter.map((numMobiles) => {
        return ((numMobiles / totalMobiles) * 100).toFixed(2);
    });

    return percentages;
  };
  
  const getFillForPercentage = (percentage) => {
    if (percentage <= whitePercentage) {
      return "rgba(255, 255, 255, 0.5)";
    } else if (percentage <= palebluePercentage) {
      return "rgba(173, 216, 230, 0.5)";
    } else if (percentage <= bluePercentage) {
      return "rgba(0, 0, 255, 0.5)";
    } else {
      return "rgba(0, 0, 139, 0.5)";
    }
  };

  const handlePercentageChange = () => {
    if (newPercentage !== '' && !isNaN(newPercentage) && parseInt(newPercentage) > 0 && parseInt(newPercentage) < parseInt(newPercentage_2)) {
      setWhitePercentage(parseInt(newPercentage));
    }
  };

  const handlePercentageChange_2 = () => {
    if (newPercentage_2 !== '' && !isNaN(newPercentage_2) && parseInt(newPercentage_2) >= whitePercentage && parseInt(newPercentage_2) < parseInt(newPercentage_3)) {
      setPaleBluePercentage(parseInt(newPercentage_2));
    }
  };
  
  const handlePercentageChange_3 = () => {
    if (newPercentage_3 !== '' && !isNaN(newPercentage_3) && parseInt(newPercentage_3) >= newPercentage_2 && parseInt(newPercentage_3) < 100) {
      setBluePercentage(parseInt(newPercentage_3));
    }
  };  
  
  const percentagesByQuarters = calculatePercentageByQuarters(numQuarters);
  
  const quarterLength = (250 * zoomFactor) * 2;
  
  const quarters = [];
  for (let i = 1; i <= numQuarters; i++) {
    quarters.push(
      <path
        key={i}
        d={`
          M 250 250
          L ${250 - Math.cos((i * 2 * Math.PI) / numQuarters) * quarterLength} ${250 + Math.sin((i * 2 * Math.PI) / numQuarters) * quarterLength}
          ${numQuarters > 4 ? `A ${quarterLength} ${quarterLength} 0 0 1` : ''}
          ${250 - Math.cos(((i + 1) * 2 * Math.PI) / numQuarters) * quarterLength} ${250 + Math.sin(((i + 1) * 2 * Math.PI) / numQuarters) * quarterLength}
          Z
        `}
        fill="white"
        stroke="black"
        strokeDasharray="5,5"
        strokeWidth={1}
      />
    );
  }

  const quarters_2 = [];
  for (let i = 0; i < numQuarters; i++) {
    quarters_2.push(
      <path
        key={i}
        d={`
          M 250 250
          L ${250 - Math.cos((i * 2 * Math.PI) / numQuarters) * quarterLength} ${250 + Math.sin((i * 2 * Math.PI) / numQuarters) * quarterLength}
          ${numQuarters > 4 ? `A ${quarterLength} ${quarterLength} 0 0 1` : ''}
          ${250 - Math.cos(((i + 1) * 2 * Math.PI) / numQuarters) * quarterLength} ${250 + Math.sin(((i + 1) * 2 * Math.PI) / numQuarters) * quarterLength}
          Z
        `}
        fill={getFillForPercentage(percentagesByQuarters[i])}
        stroke="black"
        strokeDasharray="5,5"
        strokeWidth={1}
      />
    );
  } 
  
  const MenuKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdateNumMobiles();
      updateSimulationParams();
      handleUpdateVideos();
      handleUpdateZoomLevel();
      handleUpdateNumSectors();
      handleUpdateNumQuarters();
      handlePercentageChange();
      handlePercentageChange_2();
      handlePercentageChange_3();
    }
  };

  const handleUpdateAll_1 = () => {
    handleUpdateNumMobiles();
    updateSimulationParams();
    handleUpdateVideos();
    handleUpdateZoomLevel();
    handleUpdateNumSectors();
    handleUpdateNumQuarters();
    handlePercentageChange();
    handlePercentageChange_2();
    handlePercentageChange_3();
  };

  // Fonction pour pouvoir rechercher un mobile dans le tableau 
  const searchMobile = () => {
    if (searchedMobileId.trim() !== '') {
      const foundMobile = Object.values(simulationData.mobiles).find(
        (mobile) => mobile.id.toString() === searchedMobileId.toString()
      );
      if (foundMobile) {
        setSelectedMobile(foundMobile.id);
        setSearchedMobileId('');
        console.log('Mobile found with ID:', foundMobile.id);
      } else {
        console.log('Aucun mobile trouvé avec cet ID.');
      }
    } else {
      console.log('Veuillez entrer un ID de mobile.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMobile();
    }
  };

  const handleMobileClick = (mobileId) => {
    setSelectedMobile(mobileId);
  };

  let sortedMobiles = filteredMobiles.slice();
  if (selectedMobile) {
    const selectedIndex = sortedMobiles.findIndex((mobile) => mobile.id === selectedMobile);
    if (selectedIndex !== -1) {
      const selectedMobile = sortedMobiles.splice(selectedIndex, 1)[0];
      sortedMobiles.unshift(selectedMobile);
    }
  }

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const openPopup_2 = () => {
    setShowPopup_2(true);
  };

  const closePopup_2 = () => {
    setShowPopup_2(false);
  };

  return (
    <div className="App">
      {isConnected ? (
        <div className='big_header'>Server connected !</div>
      ) : (
        <h2>{errorMessage}</h2>
      )}

      <button className='message_handler' onClick={() => sendMessage({ type: 'example', data: 'Hello' })}>
        Send Message
      </button>

      {simulationData && (
        <div className='NumberOne'>
          <div className='global'>
            <div className='datas'>
              <div className='parametrage'>
                <h2>Paramétrage</h2>
                <div className='parametres'>
                  <div className='repartition'>
                    <h3>Répartition :</h3>
                    <label htmlFor="zoomLevel">Rayon (m):
                      <input
                        type="number"
                        id="zoomLevel"
                        value={zoomLevel.toFixed(0)}
                        onChange={(event) => setZoomLevel(parseInt(event.target.value))}
                        onKeyPress={MenuKeyPress}
                        min="100"
                        max="10000"
                      />
                    </label><br/>
    
                    <label htmlFor="updatedNumMobiles">Mobiles :
                      <input
                        type="number"
                        id="updatedNumMobiles"
                        value={updatedNumMobiles}
                        onChange={(event) => setUpdatedNumMobiles(parseInt(event.target.value))}
                        onKeyPress={MenuKeyPress}
                        min="1"
                      />
                    </label><br/>
    
                    <label className='refresh' htmlFor="refreshPeriodMs">Rafraîchissement (ms):
                      <input
                        type="number"
                        id="refreshPeriodMs"
                        value={refreshPeriodMs}
                        onChange={handleRefreshPeriodChange}
                        onKeyPress={MenuKeyPress}
                        min="1"
                      />
                    </label>
                  </div>
                  <br/>
                  
                  <div className='densite'>
                    <h3>Densité :</h3>
                    <label htmlFor="numSectors">Nombre de zones :
                      <input
                        type="number"
                        id="numSectors"
                        value={updatedNumSectors === 0 ? '' : updatedNumSectors}
                        onChange={handleNumSectorsChange}
                        onKeyPress={MenuKeyPress}
                        min="1"
                        max="20"
                      />
                    </label>
    
                    <label htmlFor="numQuarters">Nombre de quartiers :
                      <input
                        type="number"
                        id="numQuarters"
                        value={updatedNumQuarters === 0 ? '' : updatedNumQuarters}
                        onChange={handleNumQuartersChange}
                        onKeyPress={MenuKeyPress}
                        min="1"
                        max="20"
                      />
                    </label>
    
                    <div className='pourcent'>
                      <p>
                        <span className="circle_white"></span>
                        de 0% &nbsp;&nbsp;à 
                        <input
                          type="number"
                          value={newPercentage}
                          onChange={(e) => setNewPercentage(e.target.value)}
                          onKeyPress={MenuKeyPress}
                        />
                        %
                      </p>
                      <p>
                        <span className="circle_blue"></span>
                        de {palebluePercentage+1}% à 
                        <input
                          type="number"
                          value={newPercentage_3}
                          onChange={(e) => setNewPercentage_3(e.target.value)}
                          onKeyPress={MenuKeyPress}
                        />
                        %
                      </p>
                      <p>
                        <span className="circle_paleblue"></span>
                        de {whitePercentage+1}% à 
                        <input
                          type="number"
                          value={newPercentage_2}
                          onChange={(e) => setNewPercentage_2(e.target.value)}
                          onKeyPress={MenuKeyPress}
                        /> 
                        %
                      </p>
                      <p>
                        <span className="circle_darkblue"></span>
                        {bluePercentage+1}% et + 
                      </p>
                    </div>
                  </div>
                  <br/>

                  <div className='video'>
                    <h3>Vidéo :</h3>
                    <label htmlFor="updatedNumVideos">Nombre de vidéos :</label>
                    <input
                      type="number"
                      id="updatedNumVideos"
                      value={updatedNumVideos}
                      onChange={(event) => setUpdatedNumVideos(parseInt(event.target.value))}
                      onKeyPress={MenuKeyPress}
                      min="1"
                      max="20"
                    />
                  </div>
                  <br/>
                  
                  <div className='parambuttons'>
                    <button className='update' onClick={handleUpdateAll_1}>
                      <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" viewBox="0 0 48 48" height="48" className="svg"><path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z"></path><path fill="none" d="M0 0h48v48h-48z"></path></svg></span>
                      <span className="button__text">Mettre à jour</span>
                    </button>
    
                    <label className="container">
                      <input type="checkbox" id="simulationCheckbox" className="pausebutton" checked={isSimulationRunning} onChange={toggleSimulation}/>
                      <label htmlFor="simulationCheckbox">
                        {isSimulationRunning ? (
                          <>
                            <span>Mettre en pause </span>
                          </>
                        ) : (
                          <>
                            <span>Reprendre </span>
                          </>
                        )}
                      </label>
                    </label>
                  </div>
                </div>
              </div>

              <div className='mobileselect'>
                {selectedMobile && (
                  <MobileDetails mobile={simulationData.mobiles[selectedMobile]} />
                )}
              </div>
            </div>


            <div className='mobmap'>

              <h2>Représentation des mobiles</h2>
              <div className='zoom'>
                <span>{((zoomLevel / 10000) * 100).toFixed(0)}%</span>
                <button onClick={handleZoomIn} className='zoom-in'></button>
                <button onClick={handleZoomOut} className='zoom-out'></button>
              </div>

              <svg width="500" height="500" style={{ borderRadius: '50%', marginBottom: '20px' }}>
              {quarters}
              {sectors}
                {filteredMobiles.map((mobile, index) => (
                  <Mobile
                    key={index}
                    shape={mobile.shape}
                    color={mobile.color}
                    xM={(mobile.kinematics.xM - x0) * zoomFactor + 200}
                    yM={(mobile.kinematics.yM - y0) * zoomFactor + 200}
                    zM={mobile.kinematics.zM}
                    headingRad={mobile.kinematics.headingRad}
                    orientationRad={mobile.kinematics.orientationRad}
                    onClick={() => selectMobile(mobile.id)}
                    isSelected={selectedMobile === mobile.id}
                  />
                ))}
              </svg>

              <label className="fs">
                  <input type="checkbox" id="simulationCheckbox" checked={showPopup} onChange={openPopup}/>
                  <span className={showPopup ? 'open' : 'close'}></span>
              </label>

              {showPopup && (
                <div className="popup-background">
                  <div className="popup">
                    <label className="ls">
                      <input type="checkbox" id="simulationCheckbox" checked={showPopup} onChange={closePopup}/>
                      <span className={showPopup ? 'open' : 'close'}></span>
                    </label>
                    
                    <svg className='popupmap' width="500" height="500" style={{borderRadius: '50%', marginBottom: '20px'}}>
                      {quarters}
                      {sectors}
                      {filteredMobiles.map((mobile, index) => (
                        <Mobile
                          key={index}
                          shape={mobile.shape}
                          color={mobile.color}
                          xM={(mobile.kinematics.xM - x0) * zoomFactor + 200}
                          yM={(mobile.kinematics.yM - y0) * zoomFactor + 200}
                          zM={mobile.kinematics.zM}
                          headingRad={mobile.kinematics.headingRad}
                          orientationRad={mobile.kinematics.orientationRad}
                          onClick={() => selectMobile(mobile.id)}
                          isSelected={selectedMobile === mobile.id}
                        />
                      ))}
                    </svg>
                    <div className='popupzoom'>
                      <button onClick={handleZoomIn} className='zoom-in'></button><br/>
                      <button onClick={handleZoomOut} className='zoom-out'></button><br/>
                      <span>{((zoomLevel / 10000) * 100).toFixed(0)}%</span><br/>
                    </div>
                    <div popupdatas>
                      {selectedMobile && (
                        <MobileDetails mobile={simulationData.mobiles[selectedMobile]} />
                      )}
                    </div>
                    <FilterComponent
                      selectedColors={selectedColors}
                      selectedShapes={selectedShapes}
                      handleColorChange={handleColorChange}
                      handleShapesChange={handleShapesChange}
                    />
                    <label className="ls">
                      <input type="checkbox" id="simulationCheckbox" checked={showPopup} onChange={closePopup}/>
                      <span className={showPopup ? 'open' : 'close'}></span>
                    </label>
                  </div>
                </div>
              )}
              <FilterComponent
                selectedColors={selectedColors}
                selectedShapes={selectedShapes}
                handleColorChange={handleColorChange}
                handleShapesChange={handleShapesChange}
              />
            </div>
            
            <div className='density'>
              <h2>Diagramme de Densité</h2>
              <div className='zoom'>
                <span>{((zoomLevel / 10000) * 100).toFixed(0)}%</span>
                <button onClick={handleZoomIn} className='zoom-in'></button>
                <button onClick={handleZoomOut} className='zoom-out'></button>
              </div>
              <svg width="500" height="500" style={{ borderRadius: '50%', marginBottom: '20px' }}>
                {quarters_2}
                {sectors}
              </svg>

              <label className="fs">
                  <input type="checkbox" id="simulationCheckbox" checked={showPopup_2} onChange={openPopup_2}/>
                  <span className={showPopup_2 ? 'open' : 'close'}></span>
              </label>

              {showPopup_2 && (
                <div className="popup-background">
                  <div className="popup">
                    <svg width="500" height="500" style={{ borderRadius: '50%', marginBottom: '20px' }}>
                      {quarters_2}
                      {sectors}
                    </svg>
                    <div className='popupzoom'>
                      <button onClick={handleZoomIn} className='zoom-in'></button>
                      <button onClick={handleZoomOut} className='zoom-out'></button>
                      <span>{((zoomLevel / 10000) * 100).toFixed(0)}%</span>
                    </div>
                    <label className="ls">
                      <input type="checkbox" id="simulationCheckbox" checked={showPopup_2} onChange={closePopup_2}/>
                      <span className={showPopup_2 ? 'open' : 'close'}></span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <MobileDataTable
            sortedMobiles={sortedMobiles}
            selectedMobile={selectedMobile}
            handleMobileClick={handleMobileClick}
            searchedMobileId={searchedMobileId}
            setSearchedMobileId={setSearchedMobileId}
            handleKeyPress={handleKeyPress}
            radianToDegree={radianToDegree}
            x0={x0}
            y0={y0}
          />
          <div className="App">
            <VideoPlayer numVideos={numVideos} />
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
