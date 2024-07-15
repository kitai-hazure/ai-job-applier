import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const code = req.nextUrl.searchParams.get("code")
    const state = req.nextUrl.searchParams.get("state")

    if (!code || !state) {
        return NextResponse.json({ error: 'Invalid Requests' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;

    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // @ts-ignore
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          }),
    });

    const data = await res.json();

    if (data.error) {
        return NextResponse.json({ error: data.error_description }, { status: 400 });
    }

    const accessToken = data.access_token;

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/success-linkedin?token=${encodeURIComponent(accessToken)}`);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error processing Linkedin Callback' }, { status: 500 });
  }
};