import * as React from 'react';

import * as coords from 'magellan-coords';

import { LocationProperties } from '../typings/locationProperties';

import { Map, TileLayer, Marker, Popup, Polygon, Polyline, Tooltip } from 'react-leaflet';

import {
  chooseColor,
  chooseIcon,
  chooseWeight,
  createIcons
} from './tagStyling';

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
  public state = {
    data: {}
  };
  constructor(props, context) {
    super(props, context);

    require.ensure(['./villages'], () => {
      const villages = require('./villages');
      this.setState({
        data: Object.assign({}, this.state.data, { villages })
      });
    });

    require.ensure(['./fishing-grounds'], () => {
      let grounds = require('./fishing-grounds');
      for (const g in grounds) {
        grounds[g].tags = ['fishing-ground'];
      }
      this.setState({
        data: Object.assign({}, this.state.data, { grounds })
      });
    });

    require.ensure(['./sites'], () => {
      const sites = require('./sites');
      this.setState({
        data: Object.assign({}, this.state.data, { sites })
      });
    });

    require.ensure(['./projects'], () => {
      const projects = require('./projects');
      this.setState({
        data: Object.assign({}, this.state.data, { projects })
      });
    });
  }

  render() {
    const localMapTemplate = '//maps.rd/tiles/{mapId}/{z}/{x}/{y}.png';
    const center = [-23.155616, 43.612710];
    const maxBounds = [[-22.593726, 42.714843], [-23.725640, 44.296188]];
    const zoom = 11;

    return (
      <div id="mapContainer">
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

            const createMapElement = (key: string, item, loc, labels: lang.LangString[], properties: LocationProperties = {}) => {
              if (loc.properties) {
                if (loc.properties.label) {
                  labels.unshift(loc.properties.label);
                }
                properties = {
                  ...properties,
                  ...loc.properties
                };
              }

              switch (loc.type) {
                case 'FeatureCollection':
                  loc.features.forEach((feature, index) => createMapElement(`${key}:${index}`, item, feature, labels, properties));
                  break;
                case 'Feature':
                  createMapElement(key, item, loc.geometry, labels, properties);
                  break;
                case 'Point':
                  markers.push((
                    <Marker key={key} position={loc.coordinates} icon={chooseIcon(item, properties)}>
                      <Tooltip><span>{lang.getLangString(properties.label, item.name)}</span></Tooltip>
                      <Popup>
                        <div>
                          <h1>
                            {lang.getLangString(properties.label, item.name)}
                            {createIcons(item, properties)}
                          </h1>
                          <CoordsElement coords={loc.coordinates} />
                          <MarkdownPreview value={lang.getLangString(properties.description, item.description)} />
                        </div>
                      </Popup>
                    </Marker>
                  ));
                  break;
                case 'Polygon':
                  markers.push((
                    <Polygon key={key} fillOpacity='0.05' color={chooseColor(item, properties)} weight={chooseWeight(item, properties)} positions={loc.coordinates}>
                      <Tooltip><span>{lang.getLangString(properties.label, item.name)}</span></Tooltip>
                      <Popup>
                        <div>
                          <h1>
                            {lang.getLangString(properties.label, item.name)}
                            {createIcons(item, properties)}
                          </h1>
                          <MarkdownPreview value={lang.getLangString(properties.description, item.description)} />
                        </div>
                      </Popup>
                    </Polygon>
                  ));
                  break;
                case 'LineString':
                  markers.push((
                    <Polyline key={key} color={chooseColor(item, properties)} weight={chooseWeight(item, properties)} positions={loc.coordinates}>
                      <Tooltip><span>{lang.getLangString(properties.label, item.name)}</span></Tooltip>
                      <Popup>
                        <div>
                          <h1>
                            {lang.getLangString(properties.label, item.name)}
                            {createIcons(item, properties)}
                          </h1>
                          <MarkdownPreview value={lang.getLangString(properties.description, item.description)} />
                        </div>
                      </Popup>
                    </Polyline>
                  ));
                  break;
              }
            };

            const renderData = (data, id) => {
              const keys = Object.keys(data);

              keys.forEach((key, i) => {
                const item = data[key];

                if (item.locations && item.locations.length) {
                  item.locations.forEach((loc, j) => {
                    const labels = [loc.label, item.name];

                    createMapElement(`${id}:${i}:${j}`, item, loc, labels);
                  });
                }
              });
            };

            Object.keys(this.state.data).forEach((key) => {
              renderData(this.state.data[key], key);
            });

            return markers;
            })() }
        </Map>
        <div id="buttons">
          <button id="controls-button">Filters</button>
        </div>
        <div id="controls"></div>
      </div>
    );
  }
}
export default RDMap;
