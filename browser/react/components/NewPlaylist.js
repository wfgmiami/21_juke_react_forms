import React from 'react';

const NewPlaylist = function ( props ) {


  return (
  <div className="well">
    <form className="form-horizontal" onSubmit={ (ev) => props.handleSubmit(ev) }>

      <fieldset>
        <legend>New Playlist</legend>
        <div className="form-group">
          <label className="col-xs-2 control-label">Name</label>
          <div className="col-xs-10">
            <input className="form-control" type="text" value={props.inputValue} onChange={ (e) => props.handleChange(e) } />
          </div>
          { props.disableButton ? <div className="alert alert-warning">Please enter a name</div> : ''}
        </div>
        <div className="form-group">
          <div className="col-xs-10 col-xs-offset-2">
            <button type="submit"  disabled={ props.disableButton } className="btn btn-success">Create Playlist</button>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
  )}

export default NewPlaylist;
