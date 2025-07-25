// Import libraries
import React, { useContext } from 'react';
import { GlobalContext } from '../../App'
import PropTypes from 'prop-types';

// Import styles
import './Filter.css';

const CategoryFilter = ({ setCategory, setFilterOpen }) => {

  const general_categories = [
    { "label": "Général", "category": null, "sex": null },
    { "label": "Général F", "category": null, "sex": "F" },
    { "label": "Général H", "category": null, "sex": "M" }
  ]

  const { categories } = useContext(GlobalContext);
  const men_categories = categories.filter(category => category.sex === "M");
  const women_categories = categories.filter(category => category.sex === "F");

  const handleCategorieChange = (category) => {
    setCategory(category);
    setFilterOpen(false);
  }

  return (
    <div className="filter-container">
      <button
        className="filter-button"
        onClick={() => handleCategorieChange(general_categories[0])}
      >
        {general_categories[0].label}
      </button>
      <div className="gender-filter-container">
        <div className="filter-column">
          <h3>♀</h3>
          <button
            className="filter-button"
            onClick={() => handleCategorieChange(general_categories[1])}
          >
            {general_categories[1].label}
          </button>
          {women_categories.map((category) => (
            <button
              key={`women-${category.label}`}
              className="filter-button"
              onClick={() => handleCategorieChange(category)}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="filter-column">
          <h3>♂</h3>
          <button
            className="filter-button"
            onClick={() => handleCategorieChange(general_categories[2])}
          >
            {general_categories[2].label}
          </button>
          {men_categories.map((category) => (
            <button
              key={`men-${category.label}`}
              className="filter-button"
              onClick={() => handleCategorieChange(category)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

CategoryFilter.propTypes = {
  setCategory: PropTypes.func.isRequired,
  setFilterOpen: PropTypes.func.isRequired
}

export default CategoryFilter;
