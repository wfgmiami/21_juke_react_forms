import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import AppContainer from './containers/AppContainer';
import Albums from './components/Albums';
import Album from './components/Album';
import Artists from './components/Artists';
import Artist from './components/Artist';
import Songs from './components/Songs';
import NewPlaylistContainer from './containers/NewPlaylistContainer';
import FilterableArtistsContainer from './containers/FilterableArtistsContainer.js';
import Playlist from './components/Playlist';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={AppContainer} foo={'foo'}>
      <Route path="/albums" component={Albums} />
      <Route path="/albums/:albumId" component={Album} />
      {/* <Route path="/artists" component={Artists} /> */}
      <Route path="/artists/NewPlaylist" component={NewPlaylistContainer} />
      <Route path="/playlist/:playlistId" component={ Playlist } />
      <Route path="/artists" component={FilterableArtistsContainer} />
      <Route path="/artists/:artistId" component={Artist}>
        <Route path="/artists/:artistId/albums" component={Albums} />
        <Route path="/artists/:artistId/songs" component={Songs} />
      </Route>
      <IndexRedirect to='/albums' />
    </Route>
  </Router>,
  document.getElementById('app')
);
