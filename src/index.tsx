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

/*import { Map, TileLayer } from 'react-leaflet';

export class RDMap extends React.Component {
  render() {
    const localMapTemplate = '../tiles/{mapId}/{z}/{x}/{y}.png';
    const center = [-23.155616, 43.612710];
    const maxBounds = [[-22.593726, 42.714843], [-23.725640, 44.296188]];
    const zoom = 11;

    return (
      <Map center={center} zoom={zoom} maxBounds={maxBounds}>
        <TileLayer
          url={localMapTemplate}
          attribution='Satellite images &copy; <a href="http://bing.com/maps">Bing Maps</a>'
          maxZoom='19'
          minZoom='11'
          mapId='OSM_sat_tiles'
        />
      </Map>
    );
  }
}*/

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
