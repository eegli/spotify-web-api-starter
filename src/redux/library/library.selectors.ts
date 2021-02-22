import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../root.reducer';

/* Root selectors */
const __savedTracksSelector = (s: RootState) => s.library.tracks.items;
const __genresSelector = (s: RootState) => s.library.genres;
export const trackCountSelector = (s: RootState) => s.library.trackCount;

/* Derived selectors */

// * Each track of the user's library is enriched with
// * the genres of its first artist
// To improve performance, the track analysis is not added here
export const savedTracksSelector = createSelector(
  [__savedTracksSelector, __genresSelector],
  (tracks, _genres) =>
    tracks.length > 0
      ? tracks.map(el => {
          return {
            ...el,
            track: {
              ...el.track,
              genres: _genres.find(artist => artist.artistId === el.track.artists[0].id)
                ?.genres,
            },
          };
        })
      : []
);

// Returns how many tracks have already been fetched from the library
// and how many total tracks there are, used for progress bar
export const libraryFetchStatusSelector = createSelector(
  [savedTracksSelector, trackCountSelector],
  (items, count) => ({
    currentCount: items.length,
    totalCount: count,
    // Count is initially 0, so we return 0 explicitly instead of possibly NaN
    percentageFetched: count ? parseFloat(((items.length / count) * 100).toFixed(2)) : 0,
    isFetched: items.length !== 0 && items.length >= count,
  })
);
