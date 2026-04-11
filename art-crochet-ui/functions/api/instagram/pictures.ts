const UPSTREAM_URL = 'https://art-crochet-api.a-aizat-ismail.workers.dev/api/instagram/pictures';

export async function onRequestGet() {
  try {
    const upstreamResponse = await fetch(UPSTREAM_URL, {
      headers: {
        accept: 'application/json',
      },
    });

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: upstreamResponse.headers,
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: 'Unable to reach Instagram API upstream service.',
      }),
      {
        status: 502,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
}
