import { Actor, log } from 'apify';
import c from 'chalk';
import * as cheerio from 'cheerio';

interface Input {
    maxItems?: number;
    language?: string;
    spokenLanguage?: string;
    since?: 'daily' | 'weekly' | 'monthly';
    enrichWithApi?: boolean;
}

const STARTUP = ['🌟 Pulling GitHub trending repos…', '📈 Crawling GitHub momentum…', '🐙 Reading the latest hot repos…'];
const DONE = ['🎉 Trending repos delivered.', '✅ GitHub trends ready.', '🚀 Star velocity captured.'];
const pick = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)] ?? arr[0]!;

await Actor.init();
const input = (await Actor.getInput<Input>()) ?? {};
const userIsPaying = Boolean(Actor.getEnv()?.userIsPaying);
const isPayPerEvent = Actor.getChargingManager().getPricingInfo().isPayPerEvent;

let effectiveMaxItems = input.maxItems ?? 25;
if (!userIsPaying) {
    if (!effectiveMaxItems || effectiveMaxItems > 10) {
        effectiveMaxItems = 10;
        log.warning([
            '',
            `${c.dim('        *  .  ✦        .    *       .')}`,
            `${c.dim('  .        *')}    🛰️  ${c.dim('.        *   .    ✦')}`,
            `${c.dim('     ✦  .        .       *        .')}`,
            '',
            `${c.yellow("  You're on a free plan — limited to 10 items.")}`,
            `${c.cyan('  Upgrade to a paid plan for up to 1,000,000 items.')}`,
            '',
            `  ✦ ${c.green.underline('https://console.apify.com/sign-up?fpr=vmoqkp')}`,
            '',
        ].join('\n'));
    }
}

const language = (input.language ?? '').trim().toLowerCase();
const spokenLanguage = (input.spokenLanguage ?? '').trim().toLowerCase();
const since = input.since ?? 'daily';
const enrich = input.enrichWithApi !== false;

console.log(c.cyan('\n🛰️  Arguments:'));
if (language) console.log(c.green(`   🟩 language : ${language}`));
if (spokenLanguage) console.log(c.green(`   🟩 spokenLanguage : ${spokenLanguage}`));
console.log(c.green(`   🟩 since : ${since}`));
console.log(c.green(`   🟩 enrichWithApi : ${enrich}`));
console.log(c.green(`   🟩 maxItems : ${effectiveMaxItems}`));
console.log('');
console.log(c.magenta(`📬 ${pick(STARTUP)}\n`));

function buildUrl(lang: string, periodVal: string): string {
    const base = `https://github.com/trending${lang ? '/' + encodeURIComponent(lang) : ''}`;
    const params = new URLSearchParams();
    params.set('since', periodVal);
    if (spokenLanguage) params.set('spoken_language_code', spokenLanguage);
    return `${base}?${params.toString()}`;
}

const TOP_LANGUAGES = ['', 'typescript', 'python', 'javascript', 'rust', 'go', 'java', 'c++', 'c', 'ruby', 'swift', 'kotlin', 'php', 'scala', 'r'];
const PERIODS = since === 'daily' ? ['daily', 'weekly', 'monthly'] : [since];

const repos: any[] = [];
const seen = new Set<string>();
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
};

async function harvestPage(lang: string, periodVal: string): Promise<void> {
    if (repos.length >= effectiveMaxItems) return;
    const url = buildUrl(lang, periodVal);
    try {
        const r = await fetch(url, { headers: HEADERS });
        if (!r.ok) return;
        const html = await r.text();
        parseHtmlInto(html, periodVal);
    } catch (err: any) {
        log.warning(`   ${url}: ${err.message}`);
    }
}

function parseHtmlInto(html: string, periodVal: string): void {
    const $ = cheerio.load(html);
    $('article.Box-row').each((rank, el) => {
    const $el = $(el);
    const fullName = $el.find('h2 > a').first().attr('href') ?? '';
    if (!fullName) return;
    const cleanFullName = fullName.replace(/^\//, '').trim();
    const [owner, name] = cleanFullName.split('/');
    if (!owner || !name) return;
    const description = $el.find('p').first().text().trim() || null;
    const lang = $el.find('[itemprop="programmingLanguage"]').first().text().trim() || null;
    const langColor = $el.find('.repo-language-color').first().attr('style')?.match(/background-color:\s*([^;]+)/)?.[1] ?? null;
    const totalStarsText = $el.find('a[href$="/stargazers"]').first().text().trim().replace(/,/g, '') || null;
    const totalStars = totalStarsText ? parseInt(totalStarsText, 10) : null;
    const totalForksText = $el.find('a[href$="/forks"]').first().text().trim().replace(/,/g, '') || null;
    const totalForks = totalForksText ? parseInt(totalForksText, 10) : null;
    const periodStarsText = $el.find('span.d-inline-block.float-sm-right').first().text().trim().match(/[\d,]+/)?.[0]?.replace(/,/g, '') ?? null;
    const periodStars = periodStarsText ? parseInt(periodStarsText, 10) : null;
    const builtBy = $el.find('span:contains("Built by")').next().find('img').map((_, img) => $(img).attr('alt')?.replace('@', '')).get();

    if (seen.has(cleanFullName)) return;
    seen.add(cleanFullName);
    repos.push({
        rank: rank + 1,
        fullName: cleanFullName,
        owner,
        name,
        url: `https://github.com${fullName}`,
        description,
        language: lang,
        languageColor: langColor,
        totalStars: totalStars && !isNaN(totalStars) ? totalStars : null,
        totalForks: totalForks && !isNaN(totalForks) ? totalForks : null,
        starsThisPeriod: periodStars && !isNaN(periodStars) ? periodStars : null,
        period: periodVal,
        contributorsShown: builtBy.filter(Boolean),
    });
});
}

// Round-robin: try the user's filter first, then fan out across periods + top languages until enough
const candidatePages: Array<[string, string]> = [];
for (const p of PERIODS) candidatePages.push([language, p]);
if (!language) {
    for (const lang of TOP_LANGUAGES.slice(1)) for (const p of PERIODS) candidatePages.push([lang, p]);
}

for (const [lang, p] of candidatePages) {
    if (repos.length >= effectiveMaxItems) break;
    log.info(`📡 ${lang || 'all'} / ${p}`);
    await harvestPage(lang, p);
}

log.info(`📊 ${repos.length} trending repos parsed`);

let pushed = 0;
for (const repo of repos) {
    if (pushed >= effectiveMaxItems) break;
    let item: any = { ...repo, scrapedAt: new Date().toISOString() };

    if (enrich) {
        try {
            const apiUrl = `https://api.github.com/repos/${repo.owner}/${repo.name}`;
            const apiResp = await fetch(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 ApifyGitHubTrending/1.0',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });
            if (apiResp.ok) {
                const a = await apiResp.json();
                item = {
                    ...item,
                    githubId: a.id ?? null,
                    homepage: a.homepage ?? null,
                    license: a.license?.spdx_id ?? null,
                    defaultBranch: a.default_branch ?? null,
                    openIssues: a.open_issues_count ?? null,
                    watchers: a.subscribers_count ?? a.watchers_count ?? null,
                    size: a.size ?? null,
                    archived: a.archived ?? null,
                    disabled: a.disabled ?? null,
                    fork: a.fork ?? null,
                    isTemplate: a.is_template ?? null,
                    topics: a.topics ?? [],
                    createdAt: a.created_at ?? null,
                    updatedAt: a.updated_at ?? null,
                    pushedAt: a.pushed_at ?? null,
                    networkCount: a.network_count ?? null,
                };
            } else {
                log.warning(`   API ${repo.fullName}: HTTP ${apiResp.status}`);
            }
            await new Promise((r) => setTimeout(r, 600));
        } catch (err: any) {
            log.warning(`   API ${repo.fullName}: ${err.message}`);
        }
    }

    if (isPayPerEvent) await Actor.pushData([item], 'result-item');
    else await Actor.pushData([item]);
    pushed += 1;
}

if (pushed === 0) await Actor.pushData([{ error: 'No trending repos parsed.' }]);
log.info(c.green(`✅ Pushed ${pushed} repos`));
console.log(c.magenta(`\n${pick(DONE)}`));
await Actor.exit();
