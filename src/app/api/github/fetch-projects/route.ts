import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const userResponse = await fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'AI Job Applier',
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user repositories: ${userResponse.status} ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();

    // Fetch organizations the user belongs to
    const orgResponse = await fetch('https://api.github.com/user/orgs', {
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'AI Job Applier'
      },
    });

    if (!orgResponse.ok) {
      throw new Error(`Failed to fetch user organizations: ${orgResponse.status} ${orgResponse.statusText}`);
    }

    const orgData = await orgResponse.json();

    const orgRepositories = [];

    for (const org of orgData) {
      const orgReposResponse = await fetch(`https://api.github.com/orgs/${org.login}/repos`, {
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'AI Job Applier',
        },
      });

      if (!orgReposResponse.ok) {
        console.error(`Failed to fetch repositories for ${org.login}: ${orgReposResponse.status} ${orgReposResponse.statusText}`);
        continue;
      }

      const orgReposData = await orgReposResponse.json();
      orgRepositories.push(...orgReposData);
    }

    const allRepositories = [...userData, ...orgRepositories];

    const sortedRepositories = allRepositories.sort((a, b) => { 
      const recentUpdateA = new Date(a.updated_at).getTime();
      const recentUpdateB = new Date(b.updated_at).getTime();
      const issuesA = a.open_issues_count || 0;
      const issuesB = b.open_issues_count || 0;
      const sizeA = a.size || 0;
      const sizeB = b.size || 0;
      const starsA = a.stargazers_count || 0;
      const starsB = b.stargazers_count || 0;
      const forksA = a.forks_count || 0;
      const forksB = b.forks_count || 0;

      return (
        recentUpdateB - recentUpdateA || // Most recently updated first
        starsB - starsA || // Most stars first
        forksB - forksA || // Most forks first
        issuesB - issuesA || // Most issues first
        sizeB - sizeA // Largest size first
      );
    });


    return NextResponse.json({ repos: sortedRepositories });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching user projects' }, { status: 500 });
  }
};