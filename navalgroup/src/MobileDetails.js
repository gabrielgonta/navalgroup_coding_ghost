
import React, { useState } from 'react';

// Fonction pour afficher les détails de mobiles
const MobileDetails = ({ mobile }) => {
  const [newSpinningSpeedDeg, setNewSpinningSpeedDeg] = useState('');
  const [newEnvironment, setNewEnvironment] = useState('');
  const [newShape, setNewShape] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newSpeedMS, setNewSpeedMS] = useState('');

  if (!mobile) {
    console.log("La variable 'mobile' est undefined dans MobileDetails.");
    return null;
  }

  const environments = {
    AIR: 'Air',
    LAND: 'Land',
    UNDERGROUND: 'Underground'
  };

  const shapes = {
    CIRCLE: 'Circle',
    SQUARE: 'Square',
    TRIANGLE: 'Triangle',
    DIAMOND: 'Diamond'
  };

  const colors = {
    RED: 'Red',
    YELLOW: 'Yellow',
    ORANGE: 'Orange',
    BLUE: 'Blue',
    GREEN: 'Green',
    VIOLET: 'Violet'
  };

  const radianToDegree = (radian) => {
    return radian * (180 / Math.PI);
  };

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleUpdate = () => {
    const updatedValues = {};

    if (newEnvironment !== '') {
      updatedValues.environment = newEnvironment;
    }

    if (newShape !== '') {
      updatedValues.shape = newShape;
    }

    if (newColor !== '') {
      updatedValues.color = newColor;
    }

    if (newSpeedMS !== '') {
      updatedValues.speedMS = parseFloat(newSpeedMS);
    }

    if (newSpinningSpeedDeg !== '') {
      const spinningSpeedRadS = parseFloat(newSpinningSpeedDeg) * (Math.PI / 180);
      updatedValues.spinningSpeedRadS = spinningSpeedRadS;
    }

    if (Object.keys(updatedValues).length > 0) {
      updateMobile({ mobile, ...updatedValues });
    } else {
      console.log("Aucune mise à jour n'a été effectuée.");
    }
  };

  // Modifier la forme, la couleur, l'environnement, la vitesse ou la vitesse d'orientation en fonction du mobile séléctionné

  const updateMobile = ({ mobile, ...updatedValues }) => {
    const apiUrl = `http://localhost:7000/api/mobiles/${mobile.id}`;
    const requestBody = JSON.stringify(updatedValues);
  
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Échec de la mise à jour: ${response.statusText}`);
      }
      console.log('Mise à jour réussie pour le mobile avec ID :', mobile.id);
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour du mobile :', error);
    });
  };  

  const { displayId, shape, environment, color, kinematics } = mobile;
  const infoToShow = {
    displayId,
    shape,
    environment,
    color,
    xM: kinematics.xM.toFixed(2),
    yM: kinematics.yM.toFixed(2),
    zM: kinematics.zM.toFixed(2),
    headingDeg: radianToDegree(kinematics.headingRad).toFixed(2),
    orientationDeg: radianToDegree(kinematics.orientationRad).toFixed(2),
    speedMS: kinematics.speedMS,
    spinningSpeedDegS: radianToDegree(kinematics.spinningSpeedRadS).toFixed(2)
  };

  return (
    <div className="mobile-details">
      <h2>Détails mobile</h2><br/>
      <h3>Informations générales :</h3><br/>
      <div className="info-container">
        <div className='id'><strong>{infoToShow.displayId}</strong></div>
        <div><strong>Forme: </strong>{infoToShow.shape.charAt(0).toUpperCase() + infoToShow.shape.slice(1).toLowerCase()}</div>
        <div>
          <label htmlFor="newShape"></label>
          <select id="newShape" value={newShape} onChange={(event) => handleInputChange(event, setNewShape)}>
            {Object.entries(shapes).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <div><strong>Environnement:</strong> {infoToShow.environment.charAt(0).toUpperCase() + infoToShow.environment.slice(1).toLowerCase()}</div>
        <div>
          <label htmlFor="newEnvironment"></label>
          <select id="newEnvironment" value={newEnvironment} onChange={(event) => handleInputChange(event, setNewEnvironment)}>
            {Object.entries(environments).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <div><strong>Couleur:</strong> {infoToShow.color.charAt(0).toUpperCase() + infoToShow.color.slice(1).toLowerCase()}</div>
        <div>
          <label htmlFor="newColor"></label>
          <select id="newColor" value={newColor} onChange={(event) => handleInputChange(event, setNewColor)}>
            {Object.entries(colors).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      <h3>Kinematics :</h3><br/>
      <div className='kinematics'>
        <div className='position'>
          <div><strong>Position X:</strong> {infoToShow.xM}</div>
          <div><strong>Position Y:</strong> {infoToShow.yM}</div>
          <div className='posZ'><strong>Position Z:</strong> {infoToShow.zM}</div>
        </div>
        <div className='otherkine'>
          <div><strong>Heading (°):</strong> {infoToShow.headingDeg}</div>
          <div className='orientation'><strong>Orientation (°):</strong> <div className='orientationval'> {infoToShow.orientationDeg}</div></div>
          <div className='vitesse'><strong>Vitesse (m/s):</strong><div className='vitesseval'> {infoToShow.speedMS}.00 </div></div>
          <div className='updatevitesse'><input type="number" value={newSpeedMS} placeholder="Update" onChange={(event) => handleInputChange(event, setNewSpeedMS)}/></div>
          <div className='rotaspeed'><strong>Vitesse de rotation (°/s):</strong>{infoToShow.spinningSpeedDegS}</div>
          <div className='upfaterota'><input type="number" value={newSpinningSpeedDeg} placeholder="Update" onChange={(event) => handleInputChange(event, setNewSpinningSpeedDeg)} /></div>
        </div>
      </div>
      <button className='update2' onClick={handleUpdate}>
        <span className="button__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" viewBox="0 0 48 48" height="48" className="svg">
            <path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z"></path>
            <path fill="none" d="M0 0h48v48h-48z"></path>
          </svg>
        </span>
        <span className="button__text">Mettre à jour</span>
      </button>
    </div>
  );
};

export default MobileDetails;
