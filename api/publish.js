export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check - heslo je uložené ako ADMIN_PASSWORD env variable na Verceli
  const { password, type, data } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'arhos2026';
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!data || !type) {
    return res.status(400).json({ error: 'Missing type or data' });
  }

  // GitHub config from Vercel environment variables
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'mahospodar-code';
  const REPO_NAME = process.env.GITHUB_REPO_NAME || 'arhos';
  
  // Support both projects and blog
  let FILE_PATH = '';
  if (type === 'projects') FILE_PATH = 'public/data/projects.json';
  else if (type === 'blog') FILE_PATH = 'public/data/blog.json';
  else return res.status(400).json({ error: 'Invalid type' });

  const BRANCH = 'main';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN not configured in Vercel environment variables' });
  }

  try {
    const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
    const headers = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    // 1. Get the current file SHA (needed for update)
    let sha = null;
    try {
      const getRes = await fetch(`${apiBase}/contents/${FILE_PATH}?ref=${BRANCH}`, { headers });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }
    } catch {
      // File doesn't exist yet, that's OK - we'll create it
    }

    // 2. Format the JSON nicely
    const content = JSON.stringify(data, null, 2);
    const contentBase64 = Buffer.from(content).toString('base64');

    // 3. Commit the file to GitHub
    const commitBody = {
      message: `chore: Update ${type} via Admin Panel [${new Date().toISOString()}]`,
      content: contentBase64,
      branch: BRANCH,
    };

    if (sha) {
      commitBody.sha = sha; // Required for updating existing files
    }

    const commitRes = await fetch(`${apiBase}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(commitBody),
    });

    if (!commitRes.ok) {
      const errorData = await commitRes.json();
      console.error('GitHub API error:', errorData);
      return res.status(500).json({ error: 'GitHub commit failed', details: errorData.message });
    }

    const commitData = await commitRes.json();

    return res.status(200).json({
      success: true,
      message: 'Projekt publikovaný! Vercel automaticky nasadí zmeny za ~60 sekúnd.',
      commitUrl: commitData.commit?.html_url,
    });

  } catch (err) {
    console.error('Publish error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
