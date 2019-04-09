import * as got from 'got'

export type gotClient = got.GotFn &
  Record<'get' | 'post' | 'put' | 'patch' | 'head' | 'delete', got.GotFn> & {
    stream: got.GotStreamFn &
      Record<
        'get' | 'post' | 'put' | 'patch' | 'head' | 'delete',
        got.GotStreamFn
      >
    RequestError: typeof got.RequestError
    ReadError: typeof got.ReadError
    ParseError: typeof got.ParseError
    HTTPError: typeof got.HTTPError
    MaxRedirectsError: typeof got.MaxRedirectsError
    UnsupportedProtocolError: typeof got.UnsupportedProtocolError
    CancelError: typeof got.CancelError
    TimeoutError: typeof got.TimeoutError
  }
