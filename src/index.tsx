/** Reef Doctor Maps
 *
 * A simple map for displaying Reef Doctor sites on the LAN.
 *
 * Created by Jack Farley (bytesnz) 2017-07-11
 */
import './rdmaps.scss';

import 'leaflet/dist/leaflet.css';

import * as React from 'react';
import * as ReactDom from 'react-dom';

import RDMap from './lib/map';

class App extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <RDMap />
    );
  }
}

ReactDom.render(<App />, document.getElementById('map'));
