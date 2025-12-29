import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GITHUB_TOKEN) {
  console.warn('Warning: GITHUB_TOKEN is not set in .env');
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function fetchRepoMetadata(owner, repo) {
  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return {
      name: data.name,
      description: data.description,
      topics: data.topics,
      language: data.language,
      stargazers_count: data.stargazers_count,
    };
  } catch (error) {
    console.error(`Error fetching metadata for ${owner}/${repo}:`, error.message);
    throw error;
  }
}

export async function fetchFileTree(owner, repo, branch = 'main') {
  try {
    const { data } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true'
    });
    return data.tree.filter(item => item.type === 'blob');
  } catch (error) {
    if (branch === 'main') {
      return fetchFileTree(owner, repo, 'master');
    }
    console.error(`Error fetching file tree for ${owner}/${repo}:`, error.message);
    throw error;
  }
}

export async function fetchFileContent(owner, repo, path) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    if (data.encoding === 'base64') {
      return Buffer.from(data.content, 'base64').toString('utf8');
    }
    return data.content;
  } catch (error) {
    console.error(`Error fetching content for ${path}:`, error.message);
    return null;
  }
}
