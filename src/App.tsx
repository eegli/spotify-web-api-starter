import { unwrapResult } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { spotifyUrl } from './api';
import './App.css';
import Data from './components/data.component';
import Footer from './components/footer.component';
import {
  setDataToDisplay,
  setFailOnPurpose,
  setIsDownloading,
  setIsFetchAllowed,
  setShowFullLibrary,
} from './redux/app/app.slice';
import {
  fetchArtistGenres,
  fetchAudioFeatures,
  fetchRecentlyPlayedTracks,
  fetchSavedTracks,
  fetchTopTracks,
} from './redux/library/library.actions';
import {
  libraryFetchStatusSelector,
  savedTracksSelector,
} from './redux/library/library.selectors';
import { RootState } from './redux/root.reducer';
import { useAppDispatch } from './redux/store';
import {
  storeTokenFailure,
  storeTokenStart,
  storeTokenSuccess,
} from './redux/token/token.slice';
import { fetchUserProfile } from './redux/user/user.actions';
import { downloadFile, DownloadType } from './utils/fileDownload';
import { flatten } from './utils/flatten';
import { makeLightTrack } from './utils/lightTrack';
import { getParamsFromUrl } from './utils/urlParams';

declare global {
  interface Window {
    spotifyCallback: (token: ReturnType<typeof getParamsFromUrl>) => void;
  }
}

window.spotifyCallback = window.spotifyCallback || {};

const App: React.FC = () => {
  // * Redux selectors
  const token = useSelector((s: RootState) => s.token);
  const userData = useSelector((s: RootState) => s.user);
  const isDownloading = useSelector((s: RootState) => s.app.isDownloading);
  const failOnPurpose = useSelector((s: RootState) => s.app.failOnPurpose);
  const showLibraryFull = useSelector((s: RootState) => s.app.showFullLibrary);
  const dataDisplay = useSelector((s: RootState) => s.app.dataToDisplay);
  const topTracks = useSelector((s: RootState) => s.library.extras.topTracks);
  const recentlyPlayedTracks = useSelector(
    (s: RootState) => s.library.extras.recentlyPlayedTracks
  );
  const audioFeatures = useSelector((s: RootState) => s.library.extras.audioFeatures);

  // * Derived selectors
  const savedTracks = useSelector(savedTracksSelector);
  const libraryFetchStatus = useSelector(libraryFetchStatusSelector);

  // * [DEMO] What will be shown on the page
  // Set how many tracks you want to fetch & display initially
  const demoDisplayTopAndRecent = 10;
  const demoDisplaySaved = 3;
  const savedTracksDemo = useMemo(() => savedTracks.slice(0, demoDisplaySaved), [
    savedTracks,
  ]);
  const savedTracksLightDemo = useMemo(() => makeLightTrack(savedTracksDemo), [
    savedTracksDemo,
  ]);

  // Create a typed dispatched
  const dispatch = useAppDispatch();

  // Create a temporary id to authenticate with Spotify. This provides
  // protection against attacks such as cross-site request forgery
  const state = nanoid(16);

  const handleSpotifyLogin = (): void => {
    // * Store a reference to the popup and open it
    dispatch(storeTokenStart());

    const popup = window.open(
      spotifyUrl(state),
      'Login with Spotify',
      'width=500,height=700'
    );

    // * The callback will store the token in redux and close the popup
    window.spotifyCallback = paramObj => {
      // Make sure the temp id we get back is the same as the one that
      // we just created
      if (paramObj.token && paramObj.state === state) {
        dispatch(storeTokenSuccess(paramObj));
      } else if (paramObj.error) {
        dispatch(storeTokenFailure(paramObj));
      }
      popup?.close();
    };
  };

  // * Effect to get token and invoke the above callback
  // * This will dispatch an action with our token in the payload
  useEffect(() => {
    const hashParams = getParamsFromUrl(window.location);
    // We have an error OR a token if isProcessed is true. Otherwise,
    // there were no query params in the url
    if (hashParams.isProcessed) {
      window.opener.spotifyCallback(hashParams);
    }
  }, []);

  // Effect to react to changes to the radio buttons (which version of
  // the library to show)
  useEffect(() => {
    showLibraryFull
      ? dispatch(setDataToDisplay(savedTracksDemo))
      : dispatch(setDataToDisplay(savedTracksLightDemo));
  }, [dispatch, savedTracks, showLibraryFull, demoDisplaySaved]);

  // * Effect to fetch the songs that are initially displayed on the
  // * page. Only done at mount.

  // 1. Fetch the user's saved tracks
  // 2. Unwrap result and extract artist ids/track ids from tracks
  // 3. Fetch the *first* artist's details for each track - used for
  //    track genres
  // 4. Fetch the audio features for each track
  // 5. Fetch the user's top tracks

  useEffect(() => {
    if (token.accessToken) {
      let artistIds: string;
      let trackIds: string;
      dispatch(fetchSavedTracks({ limit: demoDisplaySaved }))
        .then(unwrapResult)
        .then(res => {
          artistIds = res.items.map(el => el.track.artists[0].id).join(',');
          trackIds = res.items.map(el => el.track.id).join(',');
          return dispatch(fetchArtistGenres({ ids: artistIds }));
        })
        .then(() => dispatch(fetchAudioFeatures({ ids: trackIds })))
        .then(() => dispatch(fetchTopTracks({ limit: demoDisplayTopAndRecent })))
        .then(() =>
          dispatch(fetchRecentlyPlayedTracks({ limit: demoDisplayTopAndRecent }))
        )
        .catch(() => {});
    }
  }, [dispatch, token.accessToken, demoDisplayTopAndRecent, demoDisplaySaved]);

  // * Since only 50 tracks can be requested at once, the user's
  // * library needs to be fetched recursively. Procedure is as above

  // A rejected promise is returned when there is no next page or
  // when the the user cancelled the recursive action manually. In
  // this case, we need to additionally dispatch an action to
  // enable fetching again

  const fetchRecursively = () => {
    let artistIds: string;
    let trackIds: string;
    dispatch(fetchSavedTracks())
      .then(unwrapResult)
      .then(res => {
        artistIds = res.items.map(el => el.track.artists[0].id).join(',');
        trackIds = res.items.map(el => el.track.id).join(',');
        return dispatch(fetchArtistGenres({ ids: artistIds }));
      })
      .then(() => dispatch(fetchAudioFeatures({ ids: trackIds })))
      .then(() => {
        fetchRecursively();
      })
      .catch(() => {
        dispatch(setIsFetchAllowed(true));
        dispatch(setIsDownloading(false));
      });
  };

  const handleStartFetching = (): void => {
    dispatch(setIsDownloading(true));
    fetchRecursively();
  };

  const handleCancelFetching = (): void => {
    dispatch(setIsFetchAllowed(false));
  };

  const handleDownloadJSON = (type: DownloadType): void => {
    switch (type) {
      case 'flat':
        // Flat tracks are only created upon request
        const flat = savedTracks.map(el => flatten(el));
        downloadFile(flat, type);
        break;
      case 'full':
        downloadFile(savedTracks, type);
        break;
      case 'light':
        downloadFile(makeLightTrack(savedTracks), type);
        break;
      case 'audio-features':
        downloadFile(audioFeatures, type);
    }
  };

  // Focus is on the login popup, display any loading state
  if (token.pending) {
    return (
      <div className="col">
        <p>Please login with Spotify on the popup page</p>
      </div>
    );
  }
  return (
    <>
      <main role="main" className="container pt-5">
        <div className="col">
          <h1>Spotify Web API Auth Flow Demo</h1>
        </div>

        {/* **** Spotify login **** */}
        <div className="col mt-4">
          <button
            type="button"
            className="btn btn-primary my-3"
            onClick={handleSpotifyLogin}
          >
            Login with Spotify
          </button>

          {token.tokenError ? (
            <div className="alert alert-danger" role="alert">
              <p>
                Authentication unsuccessful. You likely clicked "Cancel" in the previous
                window. Try again.
              </p>
            </div>
          ) : (
            token.accessToken && (
              <div className="alert alert-success" role="alert">
                <p>Authentication successful! Here's your token:</p>
                <span style={{ wordWrap: 'break-word' }}>{token.accessToken}</span>
              </div>
            )
          )}
        </div>

        {/* **** USER PROFILE DATA **** */}
        {token.accessToken && (
          <>
            <hr />

            <div className="col">
              <h2>Your User Data</h2>
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-secondary my-3"
                  onClick={() => dispatch(fetchUserProfile())}
                >
                  Show my user data
                </button>
                <div className="form-check form-check-inline ml-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox"
                    checked={failOnPurpose}
                    onChange={() => dispatch(setFailOnPurpose(!failOnPurpose))}
                  />
                  <label className="form-check-label" htmlFor="inlineCheckbox">
                    Fail on purpose
                  </label>
                </div>
              </div>
              {/* User data success */}
              {Object.entries(userData.profileData).length !== 0 ? (
                <Data data={userData.profileData} color="alert-info" />
              ) : userData.error ? (
                <Data data={userData.error} color="alert-danger" />
              ) : null}
            </div>
          </>
        )}
        {/* **** USER LIBRARY CURRENT TOP SONGS **** */}
        {token.accessToken && (
          <>
            <hr />
            <div className="col">
              <h2>Your Top Songs</h2>
              <p>
                Here are your {demoDisplayTopAndRecent} favorite songs based on calculated
                affinity (short period).
              </p>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Artist</th>
                    <th scope="col">Popularity</th>
                  </tr>
                </thead>
                <tbody>
                  {topTracks.map((el, idx) => (
                    <tr key={el.trackId}>
                      <th scope="row">{idx + 1}</th>
                      <th>{el.title}</th>
                      <th>{el.artists.join(', ')}</th>
                      <th>{el.popularity}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {/* **** USER LIBRARY RECENTLY PLAYED **** */}
        {token.accessToken && (
          <>
            <hr />
            <div className="col">
              <h2>Your Recently Played Songs</h2>
              <p>Here are your {demoDisplayTopAndRecent} recently played songs.</p>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Artist</th>
                    <th scope="col">Played at</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyPlayedTracks.map((el, idx) => (
                    <tr key={el.trackId + el.playedAt}>
                      <th scope="row">{idx + 1}</th>
                      <th>{el.title}</th>
                      <th>{el.artists.join(', ')}</th>
                      <th>{new Date(el.playedAt).toLocaleString()}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* **** USER LIBRARY DATA CONTROLS **** */}
        {token.accessToken && (
          <>
            <hr />
            <div className="col">
              <h2>Your Recently Added Songs</h2>
              <p>
                These tracks have recently been added to your library. The "full" output
                of these tracks demonstrates what the Spotify Web API returns when asked
                for a user's saved tracks. The "light" output omits most properties except
                for a few selected ones. Each track in both versions is enriched with a
                list of genres, which is based on the tracks' first artist.
              </p>
              {/* **** Radio **** */}
              <div className="mb-3">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    id="radio1"
                    className="custom-control-input"
                    checked={!showLibraryFull}
                    onChange={() => dispatch(setShowFullLibrary(false))}
                  />
                  <label className="custom-control-label" htmlFor="radio1">
                    Light output (omitted properties)
                  </label>
                </div>
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    id="radio2"
                    className="custom-control-input"
                    checked={showLibraryFull}
                    onChange={() => dispatch(setShowFullLibrary(true))}
                  />
                  <label className="custom-control-label" htmlFor="radio2">
                    Full output (entire track object)
                  </label>
                </div>
              </div>

              {/* **** USER LIBRARY DOWNLOAD START **** */}
              {isDownloading ? (
                <button
                  type="button"
                  className="btn text-primary bg-transparent m-0 p-0 font-weight-bold mb-2"
                  onClick={handleCancelFetching}
                >
                  Cancel download
                </button>
              ) : (
                <button
                  type="button"
                  className="btn text-primary bg-transparent m-0 p-0 font-weight-bold mb-2"
                  onClick={handleStartFetching}
                >
                  <u>Download library as JSON</u>
                </button>
              )}

              {/* **** LIBRARY DOWNLOAD LINK TABLE **** */}
              {libraryFetchStatus.isFetched && (
                <div>
                  <div className="alert alert-success mt-2" role="alert">
                    <h4 className="alert-heading">Download complete </h4>
                    <p>
                      Click a link below to download your Spotify library as a JSON file.
                    </p>
                    <p>
                      For details regarding what will be included, please read{' '}
                      <a
                        href="https://eric.film/blog/getting-started-with-the-spotify-api#download-your-spotify-library"
                        target="_blank"
                        rel="noopener"
                      >
                        this blog post
                      </a>
                      . Be aware that downloading your full library might result in a huge
                      file.
                    </p>
                    <hr />
                    <table className="table table-sm table-borderless">
                      <thead>
                        <tr>
                          <th>Link</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <button
                              className="alert-link download-button"
                              onClick={() => handleDownloadJSON('light')}
                            >
                              Light library
                            </button>
                          </td>
                          <td>Corresponds to "light output" above</td>
                        </tr>
                        <tr>
                          <td>
                            <button
                              className="alert-link download-button"
                              onClick={() => handleDownloadJSON('full')}
                            >
                              Full library
                            </button>
                          </td>
                          <td>Corresponds to "full output" above</td>
                        </tr>
                        <tr>
                          <td>
                            <button
                              className="alert-link download-button text-nowrap"
                              onClick={() => handleDownloadJSON('flat')}
                            >
                              Full library (flat)
                            </button>
                          </td>
                          <td>
                            Same properties as the "full output" but with each track
                            flattened into a 2-dimensional object
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <button
                              className="alert-link download-button text-nowrap"
                              onClick={() => handleDownloadJSON('audio-features')}
                            >
                              Audio features
                            </button>
                          </td>
                          <td>Audio features for each track in your library</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="d-flex flex-column justify-content-start"></div>
                  </div>
                </div>
              )}

              {/* **** LIBRARY DOWNLOAD STATUS **** */}
              <p className="text-muted">
                {`Currently displaying ${demoDisplaySaved} items (${
                  showLibraryFull ? 'full' : 'light'
                } output). Fetched ${libraryFetchStatus.currentCount} of ${
                  libraryFetchStatus.totalCount
                } tracks.`}
              </p>
              {isDownloading && (
                <div className="progress mb-3">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    role="progressbar"
                    style={{
                      width: `${libraryFetchStatus.percentageFetched}%`,
                    }}
                    aria-valuenow={libraryFetchStatus.percentageFetched}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {libraryFetchStatus.percentageFetched}%
                  </div>
                </div>
              )}

              <Data data={dataDisplay} color="alert-secondary" />
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default App;
