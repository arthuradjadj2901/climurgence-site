#!/usr/bin/env node
/**
 * Soumission IndexNow des URL modifiees.
 *
 * Usage :
 *   node scripts/indexnow.mjs <url> [<url> ...]
 *   node scripts/indexnow.mjs --sitemap        (soumet tout le sitemap)
 *
 * Chaque URL est verifiee en HTTP avant soumission : on ne signale que
 * ce qui repond 200, pour ne pas envoyer a Bing une URL pas encore
 * deployee ou supprimee.
 */

const HOST = 'climurgence.com';
const KEY = 'climurgence2026a8f3c7d21b9';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITEMAP = `https://${HOST}/sitemap.xml`;

const log = (...a) => console.log('[indexnow]', ...a);

async function fromSitemap() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function reachable(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      if (res.status === 200) return true;
      log(`  ${res.status} ${url}${attempt < 3 ? ' — nouvel essai dans 20 s' : ''}`);
    } catch (err) {
      log(`  echec reseau ${url} : ${err.message}`);
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, 20000));
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  let urls = args.includes('--sitemap') ? await fromSitemap() : args;
  urls = [...new Set(urls.filter((u) => u.startsWith(`https://${HOST}/`)))];

  if (urls.length === 0) {
    log('aucune URL a soumettre');
    return;
  }

  log(`${urls.length} URL candidate(s), verification HTTP`);
  const checked = [];
  for (const url of urls) {
    if (await reachable(url)) checked.push(url);
    else log(`  ecartee (ne repond pas 200) : ${url}`);
  }

  if (checked.length === 0) {
    log('aucune URL joignable, rien n a ete soumis');
    process.exitCode = 1;
    return;
  }

  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: checked };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // 200 = accepte, 202 = accepte, cle en cours de validation.
  if (res.status === 200 || res.status === 202) {
    log(`${checked.length} URL soumises, reponse ${res.status}`);
    checked.forEach((u) => log(`  ${u}`));
  } else {
    log(`echec : ${res.status} ${await res.text()}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[indexnow]', err);
  process.exitCode = 1;
});
