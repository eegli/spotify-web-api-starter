import { flatten } from '../../utils/flatten';

describe('flattens track object', () => {
  const input = {
    added_at: '2021-02-10T19:28:05Z',
    track: {
      album: {
        album_type: 'album',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/2lmGTNC0PsE7j5KDO9POvW',
            },
            href: 'https://api.spotify.com/v1/artists/2lmGTNC0PsE7j5KDO9POvW',
            id: '2lmGTNC0PsE7j5KDO9POvW',
            name: 'Moi Je',
            type: 'artist',
            uri: 'spotify:artist:2lmGTNC0PsE7j5KDO9POvW',
          },
        ],
        available_markets: ['AD', 'AE'],
        external_urls: {
          spotify: 'https://open.spotify.com/album/6Hw68lfchRLr4nfRAnC45E',
        },
        href: 'https://api.spotify.com/v1/albums/6Hw68lfchRLr4nfRAnC45E',
        id: '6Hw68lfchRLr4nfRAnC45E',
        images: [
          {
            height: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b273d8477803c9d9373bf815118a',
            width: 640,
          },
          {
            height: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e02d8477803c9d9373bf815118a',
            width: 300,
          },
          {
            height: 64,
            url: 'https://i.scdn.co/image/ab67616d00004851d8477803c9d9373bf815118a',
            width: 64,
          },
        ],
        name: 'Fabrique Club',
        release_date: '2015-03-30',
        release_date_precision: 'day',
        total_tracks: 7,
        type: 'album',
        uri: 'spotify:album:6Hw68lfchRLr4nfRAnC45E',
      },
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/2lmGTNC0PsE7j5KDO9POvW',
          },
          href: 'https://api.spotify.com/v1/artists/2lmGTNC0PsE7j5KDO9POvW',
          id: '2lmGTNC0PsE7j5KDO9POvW',
          name: 'Moi Je',
          type: 'artist',
          uri: 'spotify:artist:2lmGTNC0PsE7j5KDO9POvW',
        },
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/7dwoKc64TML5mj1uPvPL6A',
          },
          href: 'https://api.spotify.com/v1/artists/7dwoKc64TML5mj1uPvPL6A',
          id: '7dwoKc64TML5mj1uPvPL6A',
          name: 'Plage 84',
          type: 'artist',
          uri: 'spotify:artist:7dwoKc64TML5mj1uPvPL6A',
        },
      ],
      available_markets: ['AD', 'AE'],
      disc_number: 1,
      duration_ms: 273232,
      explicit: false,
      external_ids: {
        isrc: 'FR9W11503184',
      },
      external_urls: {
        spotify: 'https://open.spotify.com/track/1fFF9kHEpY5mmjhAiUrVJv',
      },
      href: 'https://api.spotify.com/v1/tracks/1fFF9kHEpY5mmjhAiUrVJv',
      id: '1fFF9kHEpY5mmjhAiUrVJv',
      is_local: false,
      name: 'Fais rien (Plage 84 Remix)',
      popularity: 5,
      preview_url:
        'https://p.scdn.co/mp3-preview/7aceaab5b317cff36bc38734181267ea7e383333?cid=9e9437096cb8456e8ed599501e0c9bfb',
      track_number: 6,
      type: 'track',
      uri: 'spotify:track:1fFF9kHEpY5mmjhAiUrVJv',
      genres: ['electropop', 'indie pop', 'indie poptimism', 'pop'],
    },
  };

  const output = {
    added_at: '2021-02-10T19:28:05Z',
    track_album_album_type: 'album',
    'track_album_artists[0]_external_urls_spotify':
      'https://open.spotify.com/artist/2lmGTNC0PsE7j5KDO9POvW',
    'track_album_artists[0]_href':
      'https://api.spotify.com/v1/artists/2lmGTNC0PsE7j5KDO9POvW',
    'track_album_artists[0]_id': '2lmGTNC0PsE7j5KDO9POvW',
    'track_album_artists[0]_name': 'Moi Je',
    'track_album_artists[0]_type': 'artist',
    'track_album_artists[0]_uri': 'spotify:artist:2lmGTNC0PsE7j5KDO9POvW',
    track_album_available_markets: ['AD', 'AE'],
    track_album_external_urls_spotify:
      'https://open.spotify.com/album/6Hw68lfchRLr4nfRAnC45E',
    track_album_href: 'https://api.spotify.com/v1/albums/6Hw68lfchRLr4nfRAnC45E',
    track_album_id: '6Hw68lfchRLr4nfRAnC45E',
    'track_album_images[0]_height': 640,
    'track_album_images[0]_url':
      'https://i.scdn.co/image/ab67616d0000b273d8477803c9d9373bf815118a',
    'track_album_images[0]_width': 640,
    'track_album_images[1]_height': 300,
    'track_album_images[1]_url':
      'https://i.scdn.co/image/ab67616d00001e02d8477803c9d9373bf815118a',
    'track_album_images[1]_width': 300,
    'track_album_images[2]_height': 64,
    'track_album_images[2]_url':
      'https://i.scdn.co/image/ab67616d00004851d8477803c9d9373bf815118a',
    'track_album_images[2]_width': 64,
    track_album_name: 'Fabrique Club',
    track_album_release_date: '2015-03-30',
    track_album_release_date_precision: 'day',
    track_album_total_tracks: 7,
    track_album_type: 'album',
    track_album_uri: 'spotify:album:6Hw68lfchRLr4nfRAnC45E',
    'track_artists[0]_external_urls_spotify':
      'https://open.spotify.com/artist/2lmGTNC0PsE7j5KDO9POvW',
    'track_artists[0]_href': 'https://api.spotify.com/v1/artists/2lmGTNC0PsE7j5KDO9POvW',
    'track_artists[0]_id': '2lmGTNC0PsE7j5KDO9POvW',
    'track_artists[0]_name': 'Moi Je',
    'track_artists[0]_type': 'artist',
    'track_artists[0]_uri': 'spotify:artist:2lmGTNC0PsE7j5KDO9POvW',
    'track_artists[1]_external_urls_spotify':
      'https://open.spotify.com/artist/7dwoKc64TML5mj1uPvPL6A',
    'track_artists[1]_href': 'https://api.spotify.com/v1/artists/7dwoKc64TML5mj1uPvPL6A',
    'track_artists[1]_id': '7dwoKc64TML5mj1uPvPL6A',
    'track_artists[1]_name': 'Plage 84',
    'track_artists[1]_type': 'artist',
    'track_artists[1]_uri': 'spotify:artist:7dwoKc64TML5mj1uPvPL6A',
    track_available_markets: ['AD', 'AE'],
    track_disc_number: 1,
    track_duration_ms: 273232,
    track_explicit: false,
    track_external_ids_isrc: 'FR9W11503184',
    track_external_urls_spotify: 'https://open.spotify.com/track/1fFF9kHEpY5mmjhAiUrVJv',
    track_href: 'https://api.spotify.com/v1/tracks/1fFF9kHEpY5mmjhAiUrVJv',
    track_id: '1fFF9kHEpY5mmjhAiUrVJv',
    track_is_local: false,
    track_name: 'Fais rien (Plage 84 Remix)',
    track_popularity: 5,
    track_preview_url:
      'https://p.scdn.co/mp3-preview/7aceaab5b317cff36bc38734181267ea7e383333?cid=9e9437096cb8456e8ed599501e0c9bfb',
    track_track_number: 6,
    track_type: 'track',
    track_uri: 'spotify:track:1fFF9kHEpY5mmjhAiUrVJv',
    track_genres: ['electropop', 'indie pop', 'indie poptimism', 'pop'],
  };

  it('flattens track object except for available_markets', () => {
    expect(flatten(input)).toEqual(output);
  });
});
