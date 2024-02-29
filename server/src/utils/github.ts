export interface GithubUser {
  name: string,
  avatar_url: string,
  repos_url: string,
  public_repos: number,
  followers: number,
}

export interface GithubRepository {
  name: string,
  fullname: `${string}/${string}`
  stargazers_count: number,
}

export type GithubUserRepositories = GithubRepository[];

export async function getGithubUser(username: string) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  
  const data = await response.json();
  if (!data.name) return;

  return data as GithubUser;
}

export async function getGithubUserRepositories(username: string) {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  const data = await response.json();
  
  if (!Array.isArray(data)) return;

  return data as GithubUserRepositories;
}

export async function getGithubUserTotalStars(username: string) {
  const data = await getGithubUserRepositories(username);
  if (!data) return;

  const stars = data.reduce((acc, curr) => acc + curr.stargazers_count, 0);
  return stars;
}