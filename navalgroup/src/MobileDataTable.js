import React from 'react';

// Fonction pour afficher les mobiles dans un tableau
function MobileDataTable({
  sortedMobiles,
  selectedMobile,
  handleMobileClick,
  searchedMobileId,
  setSearchedMobileId,
  handleKeyPress,
  radianToDegree,
  x0,
  y0
}) {
  return (
    <div className='tab'>
      <h2>Données des mobiles</h2>
      <div className='search'>
        <input
          type="text"
          value={searchedMobileId}
          onChange={(e) => setSearchedMobileId(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Rechercher par ID"
        />
      </div>
      <div className='tableau'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Créé le</th>
              <th>Mise à jour</th>
              <th>Environnement</th>
              <th>Couleur</th>
              <th>Forme</th>
              <th>X</th>
              <th>Y</th>
              <th>Z</th>
              <th>Heading (deg)</th>
              <th>Orientation (deg)</th>
              <th>Speed (m/s)</th>
              <th>Vitesse de rotation (deg/s)</th>
              <th>Extra Data 1</th>
              <th>Extra Data 2</th>
              <th>Extra Data 3</th>
              <th>Extra Data 4</th>
              <th>Extra Data 5</th>
              <th>Extra Data 6</th>
              <th>Extra Data 7</th>
              <th>Extra Data 8</th>
              <th>Extra Data 1</th>
              <th>Extra Data 2</th>
              <th>Extra Data 3</th>
              <th>Extra Data 4</th>
              <th>Extra Data 5</th>
              <th>Extra Data 6</th>
              <th>Extra Data 7</th>
              <th>Extra Data 8</th>
            </tr>
          </thead>
          <tbody>
            {sortedMobiles.map((mobile) => (
              <tr
                key={mobile.id}
                className={selectedMobile === mobile.id ? 'selected-mobile' : ''}
                onClick={() => handleMobileClick(mobile.id)}
              >
                <td>{mobile.id}</td>
                <td>{mobile.creationTimestampMs}</td>
                <td>{mobile.updateTimestampMs}</td>
                <td>{mobile.environment.charAt(0).toUpperCase() + mobile.environment.slice(1).toLowerCase()}</td>
                <td>{mobile.color.charAt(0).toUpperCase() + mobile.color.slice(1).toLowerCase()}</td>
                <td>{mobile.shape.charAt(0).toUpperCase() + mobile.shape.slice(1).toLowerCase()}</td>
                <td>{(mobile.kinematics.xM - x0).toFixed(2)}</td>
                <td>{(mobile.kinematics.yM - y0).toFixed(2)}</td>
                <td>{(mobile.kinematics.zM).toFixed(2)}</td>
                <td>{radianToDegree(mobile.kinematics.headingRad).toFixed(2)}</td>
                <td>{radianToDegree(mobile.kinematics.orientationRad).toFixed(2)}</td>
                <td>{mobile.kinematics.speedMS}</td>
                <td>{radianToDegree(mobile.kinematics.spinningSpeedRadS).toFixed(2)}</td>
                <td>{mobile.extraMobileData1?.data1.toFixed(2)}</td>
                <td>{mobile.extraMobileData1 && mobile.extraMobileData1.data2?.toFixed(2)}</td>
                <td className='metadata'>{mobile.extraMobileData1?.data3}</td>
                <td>{mobile.extraMobileData1?.data4.toFixed(2)}</td>
                <td>{mobile.extraMobileData1 && mobile.extraMobileData1.data5?.toFixed(2)}</td>
                <td className='metadata'>{mobile.extraMobileData1?.data6}</td>
                <td>{mobile.extraMobileData1?.data7.toFixed(2)}</td>
                <td>{mobile.extraMobileData1 && mobile.extraMobileData1.data8 ? 'true' : 'false'}</td>
                <td>{mobile.extraMobileData2?.data1.toFixed(2)}</td>
                <td>{mobile.extraMobileData2 && mobile.extraMobileData2.data2?.toFixed(2)}</td>
                <td className='metadata'>{mobile.extraMobileData2?.data3}</td>
                <td>{mobile.extraMobileData2?.data4.toFixed(2)}</td>
                <td>{mobile.extraMobileData2 && mobile.extraMobileData2.data5?.toFixed(2)}</td>
                <td className='metadata'>{mobile.extraMobileData2?.data6}</td>
                <td>{mobile.extraMobileData2?.data7.toFixed(2)}</td>
                <td>{mobile.extraMobileData2 && mobile.extraMobileData2.data8 ? 'true' : 'false'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MobileDataTable;
