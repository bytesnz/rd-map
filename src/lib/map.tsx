import * as React from 'react';

import * as coords from 'magellan-coords';

import { Map, TileLayer, Marker, Popup, Polygon, Polyline, Tooltip } from 'react-leaflet';

import * as sites from './sites';
import * as icons from './icons';

const defaultLanguage = 'en';

const getLangString = (...strings) => {
  let i;

  for (i = 0; i < strings.length;  i++) {
    if (strings[i]) {
      if (typeof strings[i] === 'string') {
        return strings[i];
      }
      if (strings[i][defaultLanguage]) {
        return strings[i][defaultLanguage];
      }
    }
  }
};


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

            const processCoordinates = (coordinates) => {
              let poly = [];

              coordinates.forEach((coordinate, l) => {
                if (coordinate instanceof Array) {
                  poly.push(coordinate);
                } else {
                  if (coordinate.type === 'point') {
                    poly.push(coordinate.coordinates);

                    markers.push((
                      <Marker key={`${i}:${j}:${l}`} position={coordinate.coordinates} icon={icons.chooseIcon(sites[siteKeys[i]], coordinate)}>
                        <Tooltip><span>{getLangString(coordinate.label, loc.label, sites[siteKeys[i]].name)}</span></Tooltip>
                        <Popup>
                          <div>
                            <h1>{getLangString(coordinate.label, loc.label, sites[siteKeys[i]].name)}</h1>
                            <CoordsElement coords={coordinate.coordinates} />
                            <p>{getLangString(coordinate.description, loc.description)}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ));
                  }
                }
              });

              return poly;
            };

            switch (loc.type) {
              case 'point':
                markers.push((
                  <Marker key={`${i}:${j}`} position={loc.coordinates} icon={icons.chooseIcon(sites[siteKeys[i]], loc)}>
                    <Tooltip><span>{getLangString(loc.label, sites[siteKeys[i]].name)}</span></Tooltip>
                    <Popup>
                      <div>
                        <h1>
                          {getLangString(loc.label, sites[siteKeys[i]].name)}
                          {icons.createIcons(sites[siteKeys[i]])}
                        </h1>
                        <CoordsElement coords={loc.coordinates} />
                        <p>{getLangString(loc.description, sites[siteKeys[i]].description)}</p>
                      </div>
                    </Popup>
                  </Marker>
                ));
                break;
              case 'poly':
                markers.push((
                  <Polygon key={`${i}:${j}`} positions={processCoordinates(loc.coordinates)}>
                    <Tooltip><span>{getLangString(loc.label, sites[siteKeys[i]].name)}</span></Tooltip>
                    <Popup>
                      <div>
                        <h1>
                          {getLangString(loc.label, sites[siteKeys[i]].name)}
                          {icons.createIcons(sites[siteKeys[i]])}
                        </h1>
                        <p>{getLangString(loc.description, sites[siteKeys[i]].description)}</p>
                      </div>
                    </Popup>
                  </Polygon>
                ));
                break;
              case 'line':
                markers.push((
                  <Polyline key={`${i}:${j}`} positions={processCoordinates(loc.coordinates)}>
                    <Tooltip><span>{getLangString(loc.label, sites[siteKeys[i]].name)}</span></Tooltip>
                    <Popup>
                      <div>
                        <h1>
                          {getLangString(loc.label, sites[siteKeys[i]].name)}
                          {icons.createIcons(sites[siteKeys[i]])}
                        </h1>
                        <p>{getLangString(loc.description, sites[siteKeys[i]].description)}</p>
                      </div>
                    </Popup>
                  </Polyline>
                ));
                break;

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
