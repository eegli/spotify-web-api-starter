import { render } from '@testing-library/react';
import Data from '../../components/data.component';

describe('data renders correctly', () => {
  const mockData = {
    album_type: 'COMPILATION',
    href: 'https://api.spotify.com/v1/albums/3wIq5okaszSGMxYv4zlzyR',
    artists: [],
    disc_number: 1,
    duration_ms: 340965,
    explicit: false,
    external_ids: { isrc: 'GBKPL1817555' },
    external_urls: {
      spotify: 'https://open.spotify.com/track/2Vrg4Ar4v8KECMdwck1DRl',
    },
    id: '2Vrg4Ar4v8KECMdwck1DRl',
    is_local: false,
    name: 'Low - Kaskade Remix',
    popularity: 46,
    track_number: 2,
    type: 'track',
    uri: 'spotify:track:2Vrg4Ar4v8KECMdwck1DRl',
  };
  it('renders empty div on empty object prop', () => {
    const { getByTestId } = render(<Data color="alert-danger" data={{}} />);
    expect(getByTestId('div-empty')).toBeTruthy();
  });

  it('renders empty div on empty array prop', () => {
    const { getByTestId } = render(<Data color="alert-danger" data={[]} />);
    expect(getByTestId('div-empty')).toBeTruthy();
  });

  it('renders formatted json 1', () => {
    const { container, getByTestId } = render(
      <Data color="alert-danger" data={mockData} />
    );
    expect(getByTestId('json-data')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders formatted json 2', () => {
    const { container, getByTestId } = render(
      <Data color="alert-danger" data={[mockData]} />
    );
    expect(getByTestId('json-data')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });
});
