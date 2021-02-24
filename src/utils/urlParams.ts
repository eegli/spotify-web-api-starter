export interface AccessTokenObj {
  isProcessed: boolean;
  state: string;
  token: string;
  error: string | null;
}

type WindowLocation = Pick<Location, 'search' | 'hash'>;

export const getParamsFromUrl = (loc: WindowLocation): Readonly<AccessTokenObj> => {
  // When the user cancels the authorization, we get an error
  // parameter. E.g. ?error=access_denied&state=123
  const error = new URLSearchParams(loc.search).get('error');
  const state = new URLSearchParams(loc.hash.substr(1)).get('state') || '';
  const token = loc.hash.substr(1).split('&')[0].split('=')[1] || '';

  return error || (token && state)
    ? // We either have an error or a valid access token & state
      {
        error,
        token,
        state,
        isProcessed: true,
      }
    : // If there are no params (no error and no token), we mark it so
      // that we know we can't use it later
      {
        error,
        token,
        state,
        isProcessed: false,
      };
};
