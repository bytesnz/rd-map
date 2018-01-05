import * as React from 'react';

import * as Leaflet from 'leaflet';

import * as tags from './tag';

declare function require(string): string;

const iconPriority = [
  'coral-table',
  'coral-structure',
  'collection',
  'uvc',
  'uvc-survey',
  'fish-family-survey',
  'mpa',
  'fishing-ground',
  'dive-site',
  'evac-point',
  'base',
  'village',
  'anchor'
];

export const yellowBuoy = Leaflet.icon({
  iconUrl: require('../assets/buoy.svg'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 19],
  popupAnchor: [0, -19]
});

export const whiteBuoy = Leaflet.icon({
  iconUrl: require('../assets/wbuoy.svg'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 19],
  popupAnchor: [0, -19]
});

export const redBuoy = Leaflet.icon({
  iconUrl: require('../assets/rbuoy.svg'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 19],
  popupAnchor: [0, -19]
});

export const dive = Leaflet.icon({
  iconUrl: require('../assets/dive.svg'),
  iconSize: [15, 15],
  iconAnchor: [7.5, 7.5],
  popupAnchor: [0, -7.5]
});

export const rd = Leaflet.icon({
  iconUrl: require('../assets/rd.png'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 9.5],
  popupAnchor: [0, -9.5]
});

export const anchor = Leaflet.icon({
  iconUrl: require('../assets/anchor.svg'),
  iconSize: [13, 13],
  iconAnchor: [6.5, 6.5],
  popupAnchor: [0, -6.5]
});

export const evac = Leaflet.icon({
  iconUrl: require('../assets/evac.svg'),
  iconSize: [15, 15],
  iconAnchor: [7.5, 7.5],
  popupAnchor: [0, -7.5]
});

export const uvc = Leaflet.icon({
  iconUrl: require('../assets/survey.svg'),
  iconSize: [15, 19],
  iconAnchor: [7.5, 9.5],
  popupAnchor: [0, -9.5]
})

export const mpa = Leaflet.icon({
  iconUrl: require('../assets/mpa.svg'),
  iconSize: [16, 19],
  iconAnchor: [8, 9.5],
  popupAnchor: [0, -9.5]
});;

export const fishing = Leaflet.icon({
  iconUrl: require('../assets/fishing.svg'),
  iconSize: [18, 20],
  iconAnchor: [9, 10],
  popupAnchor: [0, -10]
});

export const binoculars = Leaflet.icon({
  iconUrl: require('../assets/binoculars.svg'),
  iconSize: [20, 14],
  iconAnchor: [10, 7],
  popupAnchor: [0, -7]
});

export const coral = Leaflet.icon({
  iconUrl: require('../assets/coral.svg'),
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

export const home = Leaflet.icon({
  iconUrl: require('../assets/home.svg'),
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

export const rebar = Leaflet.icon({
  iconUrl: require('../assets/rebar.svg'),
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -20]
});

export const sensor = Leaflet.icon({
  iconUrl: require('../assets/sensor.svg'),
  iconSize: [20, 17],
  iconAnchor: [10, 8.5],
  popupAnchor: [0, -8.5]
});

const styling = {
  uvc: {
    icon: uvc
  },
  'coral-table': {
    icon: coral
  },
  'coral-structure': {
    icon: coral
  },
  coral: {
    icon: coral
  },
  'uvc-survey': {
    icon: uvc
  },
  'fish-family-survey': {
    icon: uvc
  },
  landmark: {
    icon: binoculars
  },
  mpa: {
    icon: mpa,
    weight: 3,
    color: '#ff0'
  },
  fishing: {
    icon: 'fishing'
  },
  'fishing-ground': {
    icon: fishing,
    weight: 1,
    color: '#999'
  },
  outcrop: {
    weight: 1,
    color: '#d1a449'
  },
  'dive-site': {
    icon: dive
  },
  'evac-point': {
    icon: evac
  },
  base: {
    icon: rd
  },
  village: {
    icon: home
  },
  'seagrass-survey': {
    weight: 3,
    color: '#188918'
  },
  seaweed: {
    weight: 3,
    color: '#e3ba15'
  },
  collection: {
    icon: rebar
  }
};


export const chooseWeight = (site, point?) => {
  let tags = [];

  if (point && point.tags) {
    tags = tags.concat(point.tags);
  }

  if (site.tags) {
    tags = tags.concat(site.tags)
  }

  const weightTag = tags.find((tag) => styling[tag] && typeof styling[tag].weight !== 'undefined');

  return weightTag ? styling[weightTag].weight : 3;
};

export const chooseColor = (site, point?) => {
  let tags = [];

  if (point && point.tags) {
    tags = tags.concat(point.tags);
  }

  if (site.tags) {
    tags = tags.concat(site.tags)
  }

  const colorTag = tags.find((tag) => styling[tag] && typeof styling[tag].color !== 'undefined');

  return colorTag ? styling[colorTag].color : '#3388ff';
};

/**
 * Return the correct Leaflet icon for given site/point
 *
 * @param site Site (or site of the point) to return the icon for
 * @param point Point to return the icon for
 *
 * @returns The Leaflet icon
 */
export const chooseIcon = (site, point?) => {
  let icon;

  if (point.icon) {
    icon = point.icon;
  } else if (site.icon) {
    icon = site.icon;
  } else {
    let i;
    if (point && point.tags) {
      for (i = 0; i < iconPriority.length; i++) {
        if (point.tags.indexOf(iconPriority[i]) !== -1) {
          return styling[iconPriority[i]].icon;
        }
      }
    }

    if (site.tags) {
      for (i = 0; i < iconPriority.length; i++) {
        if (site.tags.indexOf(iconPriority[i]) !== -1) {
          return styling[iconPriority[i]].icon;
        }
      }
    }
  }

  switch (icon) {
    case 'landmark':
      return binoculars;
    case 'rd':
      return rd;
    case 'buoy':
      return whiteBuoy;
    case 'yellow-buoy':
      return yellowBuoy;
    case 'dive':
      return dive;
    case 'anchor':
      return anchor;
    case 'red':
      return redBuoy;
    case 'rebar':
      return rebar;
    case 'sensor':
      return sensor;
    case 'fishing':
      return fishing;
  }

  return whiteBuoy;
};

/**
 * Creates a list of icons for the given site
 *
 * @param site Site to return the icons for
 *
 * @returns React component
 */
export const createIcons = (site, point?) => {
  let icons = [];

  iconPriority.forEach((tag) => {
    if (point && point.tags && point.tags.indexOf(tag) !== -1) {
      icons.push(<img src={styling[tag].icon.options.iconUrl} title={tags.tagToString(tag)} key={tag} />);
    }
    if (site.tags && site.tags.indexOf(tag) !== -1) {
      icons.push(<img src={styling[tag].icon.options.iconUrl} title={tags.tagToString(tag)} key={tag} />);
    }
  });

  return <span className="icons">{icons}</span>;
};
