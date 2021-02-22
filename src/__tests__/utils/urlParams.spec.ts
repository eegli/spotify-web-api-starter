import { getParamsFromUrl } from '../../utils/urlParams';

describe('gets params from the url', () => {
  it('returns error obj when login is cancelled', () => {
    const failWindowObj = {
      hash: '',
      search: '?error=access_denied&state=cY1nvNQRzpskzTzA',
    };
    expect(getParamsFromUrl(failWindowObj)).toEqual({
      error: 'access_denied',
      token: '',
      state: '',
      isProcessed: true,
    });
  });

  it('returns url params when login is successful', () => {
    const successWindowObj = {
      hash:
        '#access_token=BQA53m9w&token_type=Bearer&expires_in=3600&state=w8kZY_vHJ1rZs-ta',
      search: '',
    };
    expect(getParamsFromUrl(successWindowObj)).toEqual({
      token: 'BQA53m9w',
      state: 'w8kZY_vHJ1rZs-ta',
      error: null,
      isProcessed: true,
    });
  });

  it('returns "not processed" obj if there are no params', () => {
    const windowObj = {
      hash: '',
      search: '',
    };

    expect(getParamsFromUrl(windowObj)).toEqual({
      token: '',
      state: '',
      error: null,
      isProcessed: false,
    });
  });
});
