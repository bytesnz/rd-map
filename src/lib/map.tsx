/*TS1.5+ declare module "*.svg" {
  const value: any;
  export = value;
}*/
declare function require(string): string;

import * as React from 'react';

import * as coords from 'magellan-coords';

import { Map, TileLayer, Marker, Popup, Polygon, Tooltip } from 'react-leaflet';
import * as Leaflet from 'leaflet';

import * as sites from './sites';

//import buoySvg from '../assets/buoy.svg';

Object.keys(sites).forEach((site) => {
  console.log(site);
});

const defaultLanguage = 'en';

const getLangString = (...strings) => {
  let i;

  for (i = 0; i < strings.length;  i++) {
    if (strings[i]) {
      if (strings[i][defaultLanguage]) {
        return strings[i][defaultLanguage];
      }
    }
  }
};

const buoyIcon = Leaflet.icon({
  iconUrl: require('../assets/buoy.svg'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 9.5],
  popupAnchor: [0, -9.5]
});

const diveIcon = Leaflet.icon({
  iconUrl: require('../assets/dive.svg'),
  iconSize: [15, 10],
  iconAnchor: [7.5, 5],
  popupAnchor: [0, -5]
});

const rdIcon = Leaflet.icon({
  iconUrl: require('../assets/rd.png'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 9.5],
  popupAnchor: [0, -9.5]

});

let clickId = 1;

const CoordsElement = (props) => (
  <div className="coords">
    <p>
    {props.coords[0].toFixed(6)}
    &nbsp;
    {props.coords[1].toFixed(6)}
    </p>
    <p>
      {coords(props.coords[0]).latitude().toDM(' ')}
      &nbsp;
      {coords(props.coords[1]).longitude().toDM(' ')}
    </p>
  </div>
);

export class RDMap extends React.Component {
  render() {
    const localMapTemplate = '../tiles/{mapId}/{z}/{x}/{y}.png';
    const center = [-23.155616, 43.612710];
    const maxBounds = [[-22.593726, 42.714843], [-23.725640, 44.296188]];
    const zoom = 11;

    return (
      <Map center={center} zoom={zoom} maxBounds={maxBounds} onClick={(event) => {
        console.log(`click ${clickId++}: [${event.latlng.lat.toFixed(6)}, ${event.latlng.lng.toFixed(6)}]`);
      }}>
        <TileLayer
          url={localMapTemplate}
          attribution='Satellite images &copy; <a href="http://bing.com/maps">Bing Maps</a>'
          maxZoom='19'
          minZoom='11'
          mapId='OSM_sat_tiles'
        />
        { (() => {
          let markers = [];
          const siteKeys = Object.keys(sites);
          let i = 0;
          let j = 0;
          let done = false;
          while (!done) {
            if (!sites[siteKeys[i]].locations || j >= sites[siteKeys[i]].locations.length) {
              i++;
              j = 0;
            }
            if (i >= siteKeys.length) {
              return markers;
            }

            const loc = sites[siteKeys[i]].locations[j];

            switch (loc.type) {
              case 'point':
                markers.push((
                  <Marker key={`${i}:${j}`} position={loc.coordinates} icon={loc.icon === 'rd' ? rdIcon : diveIcon}>
                    <Tooltip><span>{getLangString(loc.label, sites[siteKeys[i]].name)}</span></Tooltip>
                    <Popup>
                      <div>
                        <h1>{getLangString(loc.label, sites[siteKeys[i]].name)}</h1>
                        <CoordsElement coords={loc.coordinates} />
                      </div>
                    </Popup>
                  </Marker>
                ));
                break;
              case 'poly':
                let poly = [];

                loc.coordinates.forEach((coordinate, l) => {
                  if (coordinate instanceof Array) {
                    poly.push(coordinate);
                  } else {
                    if (coordinate.type === 'point') {
                      poly.push(coordinate.coordinates);

                      markers.push((
                        <Marker key={`${i}:${j}:${l}`} position={coordinate.coordinates} icon={coordinate.icon === 'rd' ? rdIcon : buoyIcon}>
                          <Tooltip><span>{getLangString(coordinate.label, loc.label, sites[siteKeys[i]].name)}</span></Tooltip>
                          <Popup>
                            <div>
                              <h1>{getLangString(coordinate.label, loc.label, sites[siteKeys[i]].name)}</h1>
                              <CoordsElement coords={coordinate.coordinates} />
                            </div>
                          </Popup>
                        </Marker>
                      ));
                    }
                  }
                });

                markers.push((
                  <Polygon key={`${i}:${j}`} positions={poly}>
                    <Tooltip><span>{getLangString(loc.label, sites[siteKeys[i]].name)}</span></Tooltip>
                    <Popup>
                      <div>
                        <h1>{getLangString(loc.label, sites[siteKeys[i]].name)}</h1>
                      </div>
                    </Popup>
                  </Polygon>
                ));


            }

            j++;
          }

          return markers;
          })() }
      </Map>
    );
  }
}
export default RDMap;
