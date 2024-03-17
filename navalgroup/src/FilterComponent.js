import React from 'react';

// Fichier qui défini les filtres par formes et par couleur
function FilterComponent({ selectedColors, selectedShapes, handleColorChange, handleShapesChange }) {
    return (
    <>
        <div className='colorfilter'>
            <h3>Couleurs:</h3>
            <div className='filtre'>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColors.includes('RED')}
                        onChange={() => handleColorChange('RED')}
                    />
                    <div className="checkmark"></div>
                    Red
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColors.includes('ORANGE')}
                        onChange={() => handleColorChange('ORANGE')}
                    />
                    <div className="checkmark"></div>
                    Orange
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColors.includes('YELLOW')}
                        onChange={() => handleColorChange('YELLOW')}
                    />
                    <div className="checkmark"></div>
                    Yellow
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColors.includes('GREEN')}
                        onChange={() => handleColorChange('GREEN')}
                    />
                    <div className="checkmark"></div>
                    Green
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColors.includes('BLUE')}
                        onChange={() => handleColorChange('BLUE')}
                    />
                    <div className="checkmark"></div>
                    Blue
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColors.includes('VIOLET')}
                        onChange={() => handleColorChange('VIOLET')}
                    />
                    <div className="checkmark"></div>
                    Violet
                </label>
            </div>
        </div>

        <div className='shapefilter'>
            <h3>Formes:</h3>
            <div className='filtre'>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedShapes.includes('SQUARE')}
                        onChange={() => handleShapesChange('SQUARE')}
                    />
                    <div className="checkmark"></div>
                    Square
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedShapes.includes('CIRCLE')}
                        onChange={() => handleShapesChange('CIRCLE')}
                    />
                    <div className="checkmark"></div>
                    Circle
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedShapes.includes('TRIANGLE')}
                        onChange={() => handleShapesChange('TRIANGLE')}
                    />
                    <div className="checkmark"></div>
                    Triangle
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedShapes.includes('DIAMOND')}
                        onChange={() => handleShapesChange('DIAMOND')}
                    />
                    <div className="checkmark"></div>
                    Diamond
                </label>
            </div>
        </div>
    </>
  );
}

export default FilterComponent;
