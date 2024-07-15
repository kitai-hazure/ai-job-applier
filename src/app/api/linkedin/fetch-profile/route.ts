import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching user profile' }, { status: 500 });
  }
};