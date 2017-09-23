import * as React from 'react';

import * as Leaflet from 'leaflet';

import * as tags from './tag';

declare function require(string): string;

const iconPriority = [
  'coral-table',
  'coral-structure',
  'uvc',
  'uvc-survey',
  'fish-family-survey',
  'mpa',
  'fishing-ground',
  'dive-site',
  'evac-point',
  'base'
];

export const yellowBuoy = Leaflet.icon({
  iconUrl: require('../assets/buoy.svg'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 9.5],
  popupAnchor: [0, -9.5]
});

export const whiteBuoy = Leaflet.icon({
  iconUrl: require('../assets/wbuoy.svg'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 9.5],
  popupAnchor: [0, -9.5]
});

export const redBuoy = Leaflet.icon({
  iconUrl: require('../assets/rbuoy.svg'),
  iconSize: [19, 19],
  iconAnchor: [9.5, 9.5],
  popupAnchor: [0, -9.5]
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

const tagIcons = {
  'uvc': uvc,
  'coral-table': coral,
  'coral-structure': coral,
  'coral': coral,
  'uvc-survey': uvc,
  'fish-family-survey': uvc,
  'landmark': binoculars,
  'mpa': mpa,
  'fishing-ground': fishing,
  'dive-site': dive,
  'evac-point': evac,
  'base': rd
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
          return tagIcons[iconPriority[i]];
        }
      }
    }

    if (site.tags) {
      for (i = 0; i < iconPriority.length; i++) {
        if (site.tags.indexOf(iconPriority[i]) !== -1) {
          return tagIcons[iconPriority[i]];
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
      icons.push(<img src={tagIcons[tag].options.iconUrl} title={tags.tagToString(tag)} key={tag} />);
    }
    if (site.tags && site.tags.indexOf(tag) !== -1) {
      icons.push(<img src={tagIcons[tag].options.iconUrl} title={tags.tagToString(tag)} key={tag} />);
    }
  });

  return <span className="icons">{icons}</span>;
};
