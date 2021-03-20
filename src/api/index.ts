import axios from 'axios';
import { config } from '../config';
import store from '../redux/store';

const redirectUrl =
  process.env.NODE_ENV === 'production'
    ? config.spotifyCallbackProd
    : config.spotifyCallbackStg;

const clientId =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_CLIENT_ID_PROD
    : process.env.REACT_APP_CLIENT_ID_LOCAL;

// Change the scopes to what you need
// https://developer.spotify.com/documentation/general/guides/scopes/
const scopes =
  'user-read-email user-top-read user-library-read user-read-recently-played';

export const spotifyUrl = (state: string) => {
  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&show_dialog=true';
  url += '&state=' + encodeURIComponent(state);
  url += '&client_id=' + encodeURIComponent(clientId || '');
  url += '&redirect_uri=' + encodeURIComponent(redirectUrl);
  url += '&scope=' + encodeURIComponent(scopes);
  return url;
};

export enum Endpoints {
  GetCurrentUsersProfile = '/v1/me',
  GetSavedTracks = '/v1/me/tracks',
  GetTopTracks = '/v1/me/top/tracks',
  GetMultipleArtists = '/v1/artists',
  GetMultipleAudioFeatures = '/v1/audio-features',
  GetRecentlyPlayedTracks = '/v1/me/player/recently-played',
}

interface InstanceParams<P = any> {
  params?: P;
  shouldFail?: boolean;
}

export function instance<P extends Record<string, any>>(options: InstanceParams<P>) {
  const { params, shouldFail = false } = options;
  const accessToken = store.getState().token.accessToken;
  return axios.create({
    baseURL: 'https://api.spotify.com',
    params,
    headers: {
      Authorization: `Bearer ${accessToken}${shouldFail ? 'XXX' : ''}`,
    },
  });
}
