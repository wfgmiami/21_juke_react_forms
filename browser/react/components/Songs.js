import React from 'react';

const Songs = (props) => {

  const songs = props.songs;
  const currentSong = props.currentSong;
  const isPlaying = props.isPlaying;
  const toggle = props.toggleOne;
  const removeSong = props.removeSong;
  const playlistFlag = props.playlistFlag;
  console.log('....removeSong', props)

  const getSongToRemove = (e) => {
    e.preventDefault();
    removeSong( e.target.id );
  }

  return (
    <table className='table'>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Artists</th>
          <th>Genre</th>
        </tr>
      </thead>
      <tbody>
        {
          songs && songs.map(song => (
            <tr key={song.id}>
              <td>
                <button className="btn btn-default btn-xs" onClick={() => toggle(song, songs)}>
                  <span className={song.id === currentSong.id && isPlaying ? "glyphicon glyphicon-pause" : "glyphicon glyphicon-play"}></span>
                </button>
                { playlistFlag ?
                <button id={song.id} className="glyphicon glyphicon-remove" onClick={ (e)=> getSongToRemove(e) }> </button> : null }
              </td>
              <td>{ song.name }</td>
              <td>
                <span>{ song.artists ? song.artists.map(artist => artist.name).join(', ') : null }</span>
              </td>
              <td>{ song.genre }</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default Songs;
