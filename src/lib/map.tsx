import * as React from 'react';

import * as coords from 'magellan-coords';

import { LocationProperties } from '../typings/locationProperties';

import { Map, TileLayer, Marker, Popup, Polygon, Polyline, Tooltip } from 'react-leaflet';

import * as sites from './sites';
import * as icons from './icons';
import * as lang from './lang';

import { MarkdownPreview } from 'react-marked-markdown';

lang.setDefaultLang('en');

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

          const createMapElement = (key: string, element, labels: lang.LangString[], properties: LocationProperties = {}) => {
            if (element.properties) {
              if (element.properties.label) {
                labels.unshift(element.properties.label);
              }
              properties = {
                ...properties,
                ...element.properties
              };
            }

            switch (element.type) {
              case 'FeatureCollection':
                element.features.forEach((feature, index) => createMapElement(`${key}:${index}`, feature, labels, properties));
                break;
              case 'Feature':
                createMapElement(key, element.geometry, labels, properties);
                break;
              case 'Point':
                markers.push((
                  <Marker key={key} position={element.coordinates} icon={icons.chooseIcon(sites[siteKeys[i]], properties)}>
                    <Tooltip><span>{lang.getLangString(properties.label, sites[siteKeys[i]].name)}</span></Tooltip>
                    <Popup>
                      <div>
                        <h1>
                          {lang.getLangString(properties.label, sites[siteKeys[i]].name)}
                          {icons.createIcons(sites[siteKeys[i]], properties)}
                        </h1>
                        <CoordsElement coords={element.coordinates} />
                        <MarkdownPreview value={lang.getLangString(properties.description, sites[siteKeys[i]].description)} />
                      </div>
                    </Popup>
                  </Marker>
                ));
                break;
              case 'Polygon':
                markers.push((
                  <Polygon key={key} positions={element.coordinates}>
                    <Tooltip><span>{lang.getLangString(properties.label, sites[siteKeys[i]].name)}</span></Tooltip>
                    <Popup>
                      <div>
                        <h1>
                          {lang.getLangString(properties.label, sites[siteKeys[i]].name)}
                          {icons.createIcons(sites[siteKeys[i]], properties)}
                        </h1>
                        <MarkdownPreview value={lang.getLangString(properties.description, sites[siteKeys[i]].description)} />
                      </div>
                    </Popup>
                  </Polygon>
                ));
                break;
              case 'LineString':
                markers.push((
                  <Polyline key={key} positions={element.coordinates}>
                    <Tooltip><span>{lang.getLangString(properties.label, sites[siteKeys[i]].name)}</span></Tooltip>
                    <Popup>
                      <div>
                        <h1>
                          {lang.getLangString(properties.label, sites[siteKeys[i]].name)}
                          {icons.createIcons(sites[siteKeys[i]], properties)}
                        </h1>
                        <MarkdownPreview value={lang.getLangString(properties.description, sites[siteKeys[i]].description)} />
                      </div>
                    </Popup>
                  </Polyline>
                ));
                break;
            }
          };

          while (!done) {
            if (!sites[siteKeys[i]].locations || j >= sites[siteKeys[i]].locations.length) {
              i++;
              j = 0;
            }
            if (i >= siteKeys.length) {
              return markers;
            }

            const site = sites[siteKeys[i]];
            const loc = site.locations[j];
            const labels = [loc.label, site.name];

            createMapElement(`${i}:${j}`, loc, labels);

            j++;
          }

          return markers;
          })() }
      </Map>
    );
  }
}
export default RDMap;
