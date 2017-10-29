import React from 'react';
import Songs from './Songs';



class Playlist extends React.Component{


  componentDidMount(){
    const playlistId = this.props.routeParams.playlistId*1;
    this.props.selectPlaylist(playlistId);
    this.props.selectAllSongs();
  }

  componentWillReceiveProps(nextProps){
    const nextPlaylistId = nextProps.routeParams.playlistId;
    const currentPlaylistId = this.props.routeParams.playlistId;
console.log(nextProps, this.props)
    if( nextPlaylistId !== currentPlaylistId ){
      this.props.selectPlaylist(nextPlaylistId);
    }
  }

  render(){
    // console.log('...playlist', this.props.selectedPlaylist)
    const playlist = this.props.selectedPlaylist;
    const allSongs = this.props.allSongs;
    const currentSong = this.props.currentSong;
    const isPlaying = this.props.isPlaying;
    const toggleOne = this.props.toggleOne;
    const removeSong = this.props.removeSong;
    const playlistFlag = true;

    return(
      <div>
        <h3>{ playlist.name }</h3>
        <Songs playlistFlag={playlistFlag} removeSong={removeSong} toggleOne={toggleOne} isPlaying={isPlaying} currentSong={currentSong} songs={ playlist.songs } />
        { playlist.songs && !playlist.songs.length && <small>No songs.</small> }

        <div className="well">
          <form className="form-horizontal" noValidate name="songSelect" onSubmit={ (e)=> this.props.submitPlaylistSong(e) }>
            <fieldset>
              <legend>Add to Playlist</legend>
              <div className="form-group">
                <label htmlFor="song" className="col-xs-2 control-label">Song</label>
                <div className="col-xs-10">
                  <select className="form-control" name="song" onChange={ (ev, playlist) => this.props.addPlaylistSongs(ev, playlist) }>

                  { allSongs.length && allSongs.map( song => (
                    <option key={ song.id } value={ song.id }>{ song.name }</option>
                  ))
                  }
                  </select>
                  {
                    this.props.playlistSongExists ? <div className="alert alert-warning">The song already exists!
                  </div> : ''
                  }

                </div>
              </div>
              <div className="form-group">
                <div className="col-xs-10 col-xs-offset-2">
                  <button type="submit" className="btn btn-success" >Add Song </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>

      </div>
    )
  }
}


export default Playlist;
