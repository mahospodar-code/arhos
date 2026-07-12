// Vercel serverless function — prijme upravený zoznam projektov z /admin
// a zapíše ho priamo do src/data/projects.json na GitHube (main branch).
// Push do main spustí bežný Vercel build (vrátane prerenderu) → do ~60 s je to živé.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, projects } = req.body || {};
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD nie je nastavené vo Vercel env premenných' });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Nesprávne heslo' });
  }
  if (!Array.isArray(projects)) {
    return res.status(400).json({ error: 'Chýbajú dáta projektov' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'mahospodar-code';
  const REPO_NAME = process.env.GITHUB_REPO_NAME || 'arhos';
  const FILE_PATH = 'src/data/projects.json';
  const BRANCH = 'main';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN nie je nastavený vo Vercel env premenných' });
  }

  try {
    const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    const getRes = await fetch(`${apiBase}/contents/${FILE_PATH}?ref=${BRANCH}`, { headers });
    if (!getRes.ok) {
      return res.status(500).json({ error: 'Nepodarilo sa načítať aktuálny súbor z GitHubu' });
    }
    const { sha, content: currentB64 } = await getRes.json();
    const current = JSON.parse(Buffer.from(currentB64, 'base64').toString('utf8'));

    const updated = { ...current, sk: projects };
    const contentB64 = Buffer.from(JSON.stringify(updated, null, 2) + '\n').toString('base64');

    const commitRes = await fetch(`${apiBase}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `chore: aktualizácia projektov cez Admin [${new Date().toISOString()}]`,
        content: contentB64,
        sha,
        branch: BRANCH,
      }),
    });

    if (!commitRes.ok) {
      const err = await commitRes.json();
      return res.status(500).json({ error: 'GitHub commit zlyhal', details: err.message });
    }

    const commitData = await commitRes.json();
    return res.status(200).json({
      success: true,
      message: 'Publikované. Vercel automaticky nasadí zmeny za ~60 sekúnd.',
      commitUrl: commitData.commit?.html_url,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Chyba servera', details: err.message });
  }
}
