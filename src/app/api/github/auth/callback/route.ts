import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const code = req.nextUrl.searchParams.get("code")
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;

    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        },
        body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        }),
    });

    const data = await response.json();

    if (data.error) {
        return NextResponse.json({ error: data.error_description }, { status: 400 })
    }
    const accessToken = data.access_token;
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/success?token=${encodeURIComponent(accessToken)}`);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error processing Github Callback' }, { status: 500 });
  }
};