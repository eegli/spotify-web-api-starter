import { savedTracksSelector } from '../redux/library/library.selectors';

export const makeLightTrack = (tracks: ReturnType<typeof savedTracksSelector>) => {
  return tracks.map(el => ({
    added_at: el.added_at,
    title: el.track.name,
    artists: el.track.artists.map(({ name }) => name),
    album: el.track.album.name,
    popularity: el.track.popularity,
    genres: el.track.genres,
  }));
};
