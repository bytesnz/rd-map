/** Reef Doctor Maps
 *
 * A simple map for displaying Reef Doctor sites on the LAN.
 *
 * Created by Jack Farley (bytesnz) 2017-07-11
 */
import 'rd-base/dist/assets/style.css';

import 'leaflet/dist/leaflet.css';

import './rdmaps.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';

import RDMap from './lib/map';
import { RDHeader } from 'rd-base';

class App extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <main>
        <RDHeader />
        <RDMap />
      </main>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
