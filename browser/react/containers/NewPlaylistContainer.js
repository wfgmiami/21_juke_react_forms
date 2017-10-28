import React from 'react';
import NewPlaylist from '../components/NewPlaylist';
import axios from 'axios';


class NewPlaylistContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      inputValue: '',
      disableButton: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }


  handleChange(e){
    this.setState( { disableButton: false })

    const inputValue = e.target.value;
    this.setState( { inputValue });
    const validateText = inputValue.match(/[a-z]/gi);

    if( inputValue.length > 16 || !validateText ){
      this.setState( { disableButton: true })
    }
  }

  handleSubmit(ev){
    ev.preventDefault();
    this.props.addPlaylist(this.state.inputValue)
    this.setState( { inputValue:'' });
  }

  render(){
    return(
      <NewPlaylist disableButton={ this.state.disableButton } handleSubmit={ this.handleSubmit } inputValue={ this.state.inputValue } handleChange={ this.handleChange }/>
    )
  }
}

export default NewPlaylistContainer;
