import React from 'react';

const FilterInput = (props) =>{


  return(
    <form className="form-group" style={{ marginTop: '20px' }}>
      <input type="text" placeholder="Enter artist name" className="form-control" onChange={ props.handleChange }></input>
    </form>
  )

}

export default FilterInput;
