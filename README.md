# Spotify Web API Starter Kit 🎧🎺

### User Authorization and Data Fetching Demo

A small, opinionated guideline on how to talk to the Spotify API via the implicit grant flow with React.js and the Redux Toolkit. Check out the live demo to download your Spotify library as a JSON file!

More info can be found in [this blog post](https://eric.film/blog/getting-started-with-the-spotify-api).

## App flow

1. App registers a global callback in the `window` object
2. On click, a popup is opened to authenticate the user
3. After the user grants the app permission to access their data, Spotify redirects to the starting page
4. The resulting url will contain a hash fragment with the data encoded in a query string
5. A first effect reads the token (or error) from the url and stores it in Redux for subsequent requests
6. A follow up effect fetches the library data from Spotify
7. Enjoy the playground - see what kind of responses you get from Spotify, download your library or just take your access token and do whatever you want with it 🤗

**Live demo: https://spotify-api-starter.nougatfactory.com/**

## Prerequisites

- Node 10.16.0 or later
- A [Spotify developer account](https://developer.spotify.com/dashboard) (free)
- A Spotify web app with the redirect url set to `http://localhost:3000` (also free)

## Getting Started

The following steps describe how to run this template _locally_.

Either clone this repo and use it as a starting point or copy paste the revelant parts and install the dependencies from `package.json`. Feel free to use different methods, libraries, project structure, etc.

1. Clone/fork and clone this repository
2. Make sure all the dependencies are installed
3. Copy the `client ID` from your newly created Spotify web app
4. Create an `.env` file in your project's root directory and paste `REACT_APP_CLIENT_ID_LOCAL=your_client_id`
5. (Optional) Configure the scopes you need in `src/api/index`
6. Run `yarn start`

### About the demo

#### Is it safe to use?

Yes. The demo uses read-only scopes [`user-read-email` `user-top-read` `user-library-read`](https://developer.spotify.com/documentation/general/guides/scopes/) and does not change or store your data anywhere. The access token you see only lives for 1 hour and is bound to the scope. The data does not leave your browser.

#### Logging

Logging has been enabled for the live demo so you can see what and how actions are dispatched (and what happens in case of errors). To speed up the fetching process, the default middlewares `serializableCheck` and `immutableCheck` have been disabled.

## Sources

This project was bootstrapped via the typescript template of [Create React App](https://github.com/facebook/create-react-app).

- [Redux Toolkit docs](https://redux-toolkit.js.org/)
- [Carl Rippon's great guide to Redux Hooks and Typescript](https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/)
- [Lee Martin's tutorial on Spotify's implict grant flow](https://leemartin.medium.com/creating-a-simple-spotify-authorization-popup-in-javascript-7202ce86a02f)
