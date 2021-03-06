import React, { Component } from 'react';
import axios from 'axios';

import initialState from '../initialState';
import AUDIO from '../audio';

import Albums from '../components/Albums.js';
import Album from '../components/Album';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';

import { convertAlbum, convertAlbums, convertSong, skip } from '../utils';
import { hashHistory } from 'react-router';

export default class AppContainer extends Component {

  constructor (props) {
    super(props);
    this.state = initialState;

    this.toggle = this.toggle.bind(this);
    this.toggleOne = this.toggleOne.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
    this.addPlaylist = this.addPlaylist.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.selectAllSongs = this.selectAllSongs.bind(this);
    this.addPlaylistSongs = this.addPlaylistSongs.bind(this);
    this.submitPlaylistSong = this.submitPlaylistSong.bind(this);
    this.removeSong = this.removeSong.bind(this);
  }

  componentDidMount () {
    Promise
      .all([
        axios.get('/api/albums/'),
        axios.get('/api/artists/'),
        axios.get('/api/playlists')
      ])
      .then(res => res.map(r => r.data))
      .then(data => {
        this.onLoad(...data)
      });

    AUDIO.addEventListener('ended', () =>
      this.next());
    AUDIO.addEventListener('timeupdate', () =>
      this.setProgress(AUDIO.currentTime / AUDIO.duration));
  }

  onLoad (albums, artists, playlists) {
    this.setState({
      albums: convertAlbums(albums),
      artists: artists,
      playlists: playlists
    });
  }

  play () {
    AUDIO.play();
    this.setState({ isPlaying: true });
  }

  pause () {
    AUDIO.pause();
    this.setState({ isPlaying: false });
  }

  load (currentSong, currentSongList) {
    AUDIO.src = currentSong.audioUrl;
    AUDIO.load();
    this.setState({
      currentSong: currentSong,
      currentSongList: currentSongList
    });
  }

  startSong (song, list) {
    this.pause();
    this.load(song, list);
    this.play();
  }

  toggleOne (selectedSong, selectedSongList) {
    if (selectedSong.id !== this.state.currentSong.id)
      this.startSong(selectedSong, selectedSongList);
    else this.toggle();
  }

  toggle () {
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  next () {
    this.startSong(...skip(1, this.state));
  }

  prev () {
    this.startSong(...skip(-1, this.state));
  }

  setProgress (progress) {
    this.setState({ progress: progress });
  }

  selectAlbum (albumId) {
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(album => this.setState({
        selectedAlbum: convertAlbum(album)
      }));
  }

  selectArtist (artistId) {
    Promise
      .all([
        axios.get(`/api/artists/${artistId}`),
        axios.get(`/api/artists/${artistId}/albums`),
        axios.get(`/api/artists/${artistId}/songs`)
      ])
      .then(res => res.map(r => r.data))
      .then(data => this.onLoadArtist(...data));
  }

  onLoadArtist (artist, albums, songs) {
    songs = songs.map(convertSong);
    albums = convertAlbums(albums);
    artist.albums = albums;
    artist.songs = songs;

    this.setState({ selectedArtist: artist });
  }

  addPlaylist( playlistName ){

    axios.post('/api/playlists',{ name: playlistName })
    .then(res => res.data)
    .then(playlist => {
      this.setState( { playlists: [...this.state.playlists, playlist ]})
      const path = `/playlist/${ playlist.id }`;
      hashHistory.push(path);
    })
  }

  addPlaylistSongs( ev ){
    this.setState( { playlistSongExists: false })
    const songId = ev.target.value * 1;
    axios.get(`/api/songs/${ songId }`)
    .then( response => response.data )
    .then( song => {
      const songToPlaylist = convertSong(song);
      this.setState( { songToPlaylist })
    })
    .catch( err => {
      console.log('error in addPlaylistSongs',err)
    })
  }

  selectAllSongs(){
    axios.get('/api/songs')
    .then( response => response.data )
    .then( allSongs => {
      this.setState( { allSongs });
      const convertFirst = convertSong(allSongs[0]);
      this.setState({ songToPlaylist: convertFirst })
    })
  }

  selectPlaylist( playlistId ){
    axios.get(`/api/playlists/${playlistId}`)
    .then( response => response.data )
    .then( selectedPlaylist => {
      selectedPlaylist.songs = selectedPlaylist.songs.map(convertSong);
      this.setState( { selectedPlaylist })
    })
  }

  submitPlaylistSong( e ) {
    e.preventDefault();
    const selectedPlaylistId = this.state.selectedPlaylist.id;
    const selectedSongId = this.state.songToPlaylist.id;
    axios.post(`/api/playlists/${selectedPlaylistId}/songs`, { id: selectedSongId })
    .then( () => this.selectPlaylist(selectedPlaylistId))
    .catch( err => this.setState( { playlistSongExists: true }))
  }

  removeSong(songId) {
    const currentPlaylistId = this.state.selectedPlaylist.id;

    const newPlaylist = this.state.selectedPlaylist.songs.filter( song => song.id !== songId*1 );

    axios.delete(`/api/playlists/${currentPlaylistId}/songs/${songId}`)
    .then( () => this.selectPlaylist( currentPlaylistId ))
    .catch( err => console.log('Error in removeSong'))
  }

  render () {

    const props = Object.assign({}, this.state, {
      toggleOne: this.toggleOne,
      toggle: this.toggle,
      selectAlbum: this.selectAlbum,
      selectArtist: this.selectArtist,
      addPlaylist: this.addPlaylist,
      selectPlaylist: this.selectPlaylist,
      selectAllSongs: this.selectAllSongs,
      addPlaylistSongs: this.addPlaylistSongs,
      submitPlaylistSong:this.submitPlaylistSong,
      removeSong: this.removeSong
    });

    // console.log('...', this.state)
    return (
      <div id="main" className="container-fluid">
        <div className="col-xs-2">
          <Sidebar playlists={ this.state.playlists }/>
        </div>
        <div className="col-xs-10">
        {
          this.props.children && React.cloneElement(this.props.children, props)
        }
        </div>
        <Player
          currentSong={this.state.currentSong}
          currentSongList={this.state.currentSongList}
          isPlaying={this.state.isPlaying}
          progress={this.state.progress}
          next={this.next}
          prev={this.prev}
          toggle={this.toggle}
        />
      </div>
    );
  }
}
