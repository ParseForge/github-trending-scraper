![ParseForge Banner](https://github.com/ParseForge/apify-assets/blob/ad35ccc13ddd068b9d6cba33f323962e39aed5b2/banner.jpg?raw=true)

# 🐙 GitHub Trending Repos Scraper

> 🚀 **Pull GitHub's daily, weekly, and monthly trending repositories with full repo metadata.** Multi-period and multi-language fanout reaches 100+ unique repos per run. No GitHub token required.

> 🕒 **Last updated:** 2026-05-01 · **📊 24 fields** per repo · **🐙 220M+ public repos on GitHub** · **📈 multi-period fanout** · **🔗 GitHub API enrichment**

The **GitHub Trending Repos Scraper** extracts trending repositories from the public GitHub trending page and enriches each with full repo metadata via the GitHub API: stars, forks, language, topics, license, watchers, open issues, default branch, repo size, archived flag, fork flag, template flag, and full ISO timestamps for created, updated, and pushed dates.

GitHub trending is the canonical signal for what developers are building right now. VC firms screen for emerging projects, dev relations teams track adoption, and tech writers cover what is rising. The official trending page caps at 25 entries per query, so this Actor combines daily, weekly, and monthly windows across the top 14 programming languages to reach 100+ unique repos per run.

| 🎯 Target Audience | 💡 Primary Use Cases |
|---|---|
| VC analysts, developer relations, tech writers, recruiters, dev tool teams | Emerging project discovery, language trend tracking, competitive intel, content research |

---

## 📋 What the GitHub Trending Repos Scraper does

Five filtering workflows in a single run:

- 📈 **Multi-period fanout.** Combines daily, weekly, and monthly trending lists when `since` is set to the default.
- 🌐 **Multi-language fanout.** Walks the top 14 programming languages (TypeScript, Python, Rust, Go, Java, C++, etc.) when no language is specified.
- 🗣️ **Spoken-language filter.** Optional `spoken_language_code` filter for repos with READMEs in a specific language.
- 🔍 **Language filter.** Restrict results to a single programming language (e.g. only `rust`).
- 🔗 **API enrichment.** Each parsed repo is enriched via `api.github.com/repos/{owner}/{name}` for full metadata.

Each row reports rank, full name, owner, name, URL, description, language, language color, star and fork totals, stars gained in the period, period label, contributors shown on the trending card, plus enriched fields: GitHub repo ID, homepage, license, default branch, open issues, watchers, repo size in KB, archived, fork, is-template, topics, and timestamps for created, updated, and pushed.

> 💡 **Why it matters:** GitHub trending is one of the few free signals that reflects developer attention in real time. VCs use it for early scouting. DevRel teams use it to gauge competitor traction. Tech writers use it to find stories. The 25-row cap on the official page is a hard ceiling, so multi-period and multi-language fanout is the practical way to reach 100+ unique repos.

---

## 🎬 Full Demo

_🚧 Coming soon: a 3-minute walkthrough showing how to go from sign-up to a downloaded dataset._

---

## ⚙️ Input

<table>
<thead>
<tr><th>Input</th><th>Type</th><th>Default</th><th>Behavior</th></tr>
</thead>
<tbody>
<tr><td><code>maxItems</code></td><td>integer</td><td><code>10</code></td><td>Repos to return. Free plan caps at 10, paid plan at 1,000,000.</td></tr>
<tr><td><code>language</code></td><td>string</td><td>empty</td><td>Programming language filter (e.g. <code>rust</code>, <code>python</code>). Empty triggers fanout across top 14 languages.</td></tr>
<tr><td><code>spokenLanguage</code></td><td>string</td><td>empty</td><td>Spoken language code (e.g. <code>en</code>, <code>zh</code>). Filters repos by README language.</td></tr>
<tr><td><code>since</code></td><td>string</td><td><code>"daily"</code></td><td><code>daily</code>, <code>weekly</code>, or <code>monthly</code>. Daily triggers period fanout.</td></tr>
<tr><td><code>enrichWithApi</code></td><td>boolean</td><td><code>true</code></td><td>Adds full GitHub API enrichment per repo (license, topics, issues, etc.).</td></tr>
</tbody>
</table>

**Example: top 100 trending repos this week, all languages.**

```json
{
    "maxItems": 100,
    "since": "weekly",
    "enrichWithApi": true
}
```

**Example: trending Rust repos with full enrichment.**

```json
{
    "maxItems": 50,
    "language": "rust",
    "since": "monthly",
    "enrichWithApi": true
}
```

> ⚠️ **Good to Know:** GitHub's anonymous API rate limit is 60 requests per hour per IP. With `enrichWithApi=true` on a 100-repo run, you stay well under that. For very large runs, disable enrichment or rotate proxies.

---

## 📊 Output

Each repo record contains **24 fields** when enrichment is enabled, **13 fields** without. Download as CSV, Excel, JSON, or XML.

### 🧾 Schema

| Field | Type | Example |
|---|---|---|
| 🏆 `rank` | integer | `1` |
| 🏷️ `fullName` | string | `"warpdotdev/warp"` |
| 👤 `owner` | string | `"warpdotdev"` |
| 📦 `name` | string | `"warp"` |
| 🔗 `url` | string | `"https://github.com/warpdotdev/warp"` |
| 📝 `description` | string \| null | `"Warp is an agentic development environment..."` |
| 🧮 `language` | string \| null | `"Rust"` |
| 🎨 `languageColor` | string \| null | `"#dea584"` |
| ⭐ `totalStars` | integer | `49284` |
| 🍴 `totalForks` | integer | `3208` |
| 📈 `starsThisPeriod` | integer | `8399` |
| 📅 `period` | string | `"daily"` |
| 👥 `contributorsShown` | array | `[]` |
| 🆔 `githubId` | integer | `384219990` |
| 🏠 `homepage` | string \| null | `"https://warp.dev"` |
| 📄 `license` | string \| null | `"AGPL-3.0"` |
| 🌿 `defaultBranch` | string | `"master"` |
| 🐛 `openIssues` | integer | `3265` |
| 👁️ `watchers` | integer | `312` |
| 💾 `size` | integer | `154580` |
| 🗄️ `archived` | boolean | `false` |
| 🍴 `fork` | boolean | `false` |
| 📋 `isTemplate` | boolean | `false` |
| 🏷️ `topics` | array | `["rust", "terminal", "shell"]` |
| 📅 `createdAt` | ISO 8601 | `"2021-07-08T18:48:08Z"` |
| 📅 `updatedAt` | ISO 8601 | `"2026-04-30T22:13:28Z"` |
| 📅 `pushedAt` | ISO 8601 | `"2026-04-30T22:13:30Z"` |

### 📦 Sample records

<details>
<summary><strong>🚀 Top trending Rust repo: warpdotdev/warp</strong></summary>

```json
{
    "rank": 1,
    "fullName": "warpdotdev/warp",
    "owner": "warpdotdev",
    "name": "warp",
    "url": "https://github.com/warpdotdev/warp",
    "description": "Warp is an agentic development environment, born out of the terminal.",
    "language": "Rust",
    "languageColor": "#dea584",
    "totalStars": 49284,
    "totalForks": 3208,
    "starsThisPeriod": 8399,
    "period": "daily",
    "license": "AGPL-3.0",
    "openIssues": 3265,
    "watchers": 312,
    "topics": ["bash", "linux", "macos", "rust", "shell", "terminal", "wasm", "zsh"],
    "createdAt": "2021-07-08T18:48:08Z"
}
```

</details>

<details>
<summary><strong>📈 Mid-rank Python repo with topics</strong></summary>

```json
{
    "rank": 7,
    "fullName": "openai-engineering/example-tooling",
    "owner": "openai-engineering",
    "name": "example-tooling",
    "url": "https://github.com/openai-engineering/example-tooling",
    "language": "Python",
    "totalStars": 12450,
    "starsThisPeriod": 1830,
    "period": "weekly",
    "license": "MIT",
    "topics": ["ai", "agents", "llm", "tooling"],
    "openIssues": 84,
    "watchers": 220
}
```

</details>

<details>
<summary><strong>🍴 Fork without enrichment fields</strong></summary>

```json
{
    "rank": 14,
    "fullName": "researcher123/trending-fork",
    "owner": "researcher123",
    "name": "trending-fork",
    "url": "https://github.com/researcher123/trending-fork",
    "language": "JavaScript",
    "totalStars": 410,
    "starsThisPeriod": 78,
    "period": "monthly",
    "fork": true,
    "topics": []
}
```

</details>

---

## ✨ Why choose this Actor

| | Capability |
|---|---|
| 🆓 | **No GitHub token.** Reads the public trending page plus anonymous API access. |
| 📈 | **Period fanout.** Combines daily, weekly, and monthly to break the 25-row ceiling. |
| 🌐 | **Language fanout.** Walks the top 14 programming languages for breadth. |
| 🔗 | **API enrichment.** Adds license, topics, issues, watchers, and timestamps per repo. |
| 🆔 | **Stable repo IDs.** Each row carries the GitHub repo ID for cross-referencing. |
| 🚀 | **Fast.** Typical 100-row pull completes in 25 to 35 seconds. |
| 🛠️ | **Configurable.** Disable enrichment for faster, lighter pulls when you only need names and stars. |

> 📊 In a single 29-second run the Actor returned 100 unique trending repos across 3 periods and 14 languages.

---

## 📈 How it compares to alternatives

| Approach | Cost | Coverage | Refresh | Filters | Setup |
|---|---|---|---|---|---|
| Direct trending page scrape | Free | 25 rows max | Live | Single period | Engineer hours |
| GitHub Search API | Free with token | Star-sorted | Live | Star range only | Token required |
| Paid dev intel platforms | $$$ subscription | Aggregated | Daily | Built-in | Account setup |
| **⭐ GitHub Trending Repos Scraper** *(this Actor)* | Pay-per-event | 100+ via fanout | Live | Period, language | None |

Same trending page GitHub publishes, with multi-period and multi-language fanout to reach more rows.

---

## 🚀 How to use

1. 🆓 **Create a free Apify account.** [Sign up here](https://console.apify.com/sign-up?fpr=vmoqkp) and get $5 in free credit.
2. 🔍 **Open the Actor.** Search for "GitHub Trending" in the Apify Store.
3. ⚙️ **Pick filters.** Optional language and spoken-language filters.
4. ▶️ **Click Start.** A 100-row run typically finishes in 25 to 35 seconds.
5. 📥 **Download.** Export as CSV, Excel, JSON, or XML.

> ⏱️ Total time from sign-up to first dataset: under five minutes.

---

## 💼 Business use cases

<table>
<tr>
<td width="50%">

### 💰 VC & scouting
- Surface early-stage projects before mainstream coverage
- Track velocity of stars-per-day for emerging repos
- Identify under-the-radar founders by repo activity
- Build alert feeds on specific languages or topics

</td>
<td width="50%">

### 📰 Tech writing & content
- Find story angles in real developer momentum
- Reference specific repos with stable URLs and stats
- Track which tools rise into trending
- Build weekly trend digests programmatically

</td>
</tr>
<tr>
<td width="50%">

### 🤝 Developer relations
- Monitor competitor and adjacent projects
- Track adoption of your own dependencies
- Identify rising contributors to engage with
- Benchmark your repo's trending position

</td>
<td width="50%">

### 👥 Recruiting
- Spot active maintainers in your stack
- Source candidates by language and recency
- Identify trending project teams hiring soon
- Build talent feeds tied to GitHub activity

</td>
</tr>
</table>

---

## 🌟 Beyond business use cases

Data like this powers more than commercial workflows. The same structured records support research, education, civic projects, and personal initiatives.

<table>
<tr>
<td width="50%">

### 🎓 Research and academia
- Empirical datasets for papers, thesis work, and coursework
- Longitudinal studies tracking changes across snapshots
- Reproducible research with cited, versioned data pulls
- Classroom exercises on data analysis and ethical scraping

</td>
<td width="50%">

### 🎨 Personal and creative
- Side projects, portfolio demos, and indie app launches
- Data visualizations, dashboards, and infographics
- Content research for bloggers, YouTubers, and podcasters
- Hobbyist collections and personal trackers

</td>
</tr>
<tr>
<td width="50%">

### 🤝 Non-profit and civic
- Transparency reporting and accountability projects
- Advocacy campaigns backed by public-interest data
- Community-run databases for local issues
- Investigative journalism on public records

</td>
<td width="50%">

### 🧪 Experimentation
- Prototype AI and machine-learning pipelines with real data
- Validate product-market hypotheses before engineering spend
- Train small domain-specific models on niche corpora
- Test dashboard concepts with live input

</td>
</tr>
</table>

---

## 🔌 Automating GitHub Trending Repos Scraper

Run this Actor on a schedule, from your codebase, or inside another tool:

- **Node.js** SDK: see [Apify JavaScript client](https://docs.apify.com/api/client/js/) for programmatic runs.
- **Python** SDK: see [Apify Python client](https://docs.apify.com/api/client/python/) for the same flow in Python.
- **HTTP API**: see [Apify API docs](https://docs.apify.com/api/v2) for raw REST integration.

Schedule daily or weekly runs from the Apify Console. Pipe results into Google Sheets, S3, BigQuery, or your own webhook with the built-in [integrations](https://docs.apify.com/platform/integrations).

---

## ❓ Frequently Asked Questions

<details>
<summary><strong>📈 What does period fanout do?</strong></summary>

When `since` is set to `daily`, the Actor combines daily, weekly, and monthly trending lists to break past the 25-row cap on a single page. Set `since` explicitly to skip fanout.

</details>

<details>
<summary><strong>🌐 What does language fanout do?</strong></summary>

When no `language` is specified, the Actor walks the top 14 programming languages to broaden coverage. Each language has its own trending list of up to 25 rows.

</details>

<details>
<summary><strong>🔗 Why use API enrichment?</strong></summary>

The trending page returns rank, name, description, language, and star totals. The GitHub API adds license, topics, watchers, open issues, default branch, repo size, archived flag, and full timestamps.

</details>

<details>
<summary><strong>🛡️ What about GitHub API rate limits?</strong></summary>

Anonymous access is 60 requests per hour per IP. A 100-row enriched run uses 100 requests. For higher volumes, disable enrichment or rotate proxies.

</details>

<details>
<summary><strong>📦 How many repos can I pull?</strong></summary>

Up to roughly 350 unique repos per run via full fanout (14 languages × 3 periods × 25 rows minus overlaps). Free plan caps at 10, paid plan at 1,000,000.

</details>

<details>
<summary><strong>🗣️ What is the spoken-language filter?</strong></summary>

GitHub trending supports filtering by README language code (e.g. `en` for English, `zh` for Chinese). Pass any valid two-letter code.

</details>

<details>
<summary><strong>📅 How often does GitHub trending refresh?</strong></summary>

The trending page recomputes throughout the day. Each run hits the live page so you always get current results.

</details>

<details>
<summary><strong>💼 Can I use this for commercial work?</strong></summary>

Yes. The Actor reads only what GitHub publicly serves to any browser. Always honor GitHub's terms of service when republishing repo data.

</details>

<details>
<summary><strong>💳 Do I need a paid Apify plan?</strong></summary>

The free plan returns up to 10 rows per run. Paid plans return up to 1,000,000.

</details>

<details>
<summary><strong>⚠️ What if a run fails?</strong></summary>

Most failures are transient. Retry once. If the issue persists, [open a contact form](https://tally.so/r/BzdKgA) and include the run URL.

</details>

<details>
<summary><strong>🔁 How fresh is the data?</strong></summary>

Live. Each run hits GitHub trending and the GitHub API at run time.

</details>

<details>
<summary><strong>⚖️ Is this legal?</strong></summary>

Yes. The Actor reads public HTML and the public GitHub API. It does not authenticate, does not bypass rate limits, and does not scrape private repos.

</details>

---

## 🔌 Integrate with any app

- [**Make**](https://apify.com/integrations/make) - drop run results into 1,800+ apps.
- [**Zapier**](https://apify.com/integrations/zapier) - trigger automations off completed runs.
- [**Slack**](https://apify.com/integrations/slack) - post run summaries to a channel.
- [**Google Sheets**](https://apify.com/integrations/google-sheets) - sync each run into a spreadsheet.
- [**Webhooks**](https://docs.apify.com/platform/integrations/webhooks) - notify your own services on run finish.
- [**Airbyte**](https://apify.com/integrations/airbyte) - load runs into Snowflake, BigQuery, or Postgres.

---

## 🔗 Recommended Actors

- [**💬 Stack Exchange Q&A Scraper**](https://apify.com/parseforge/stack-exchange-qa-scraper) - pair trending repos with developer Q&A.
- [**📚 Wikipedia Pageviews Scraper**](https://apify.com/parseforge/wikipedia-pageviews-scraper) - cross-reference repo trends with public-interest spikes.
- [**🅱️ Bing Search Scraper**](https://apify.com/parseforge/bing-search-scraper) - track which repos rank for which keywords.
- [**🦆 DuckDuckGo Search Scraper**](https://apify.com/parseforge/duckduckgo-search-scraper) - alternative SERP signal alongside GitHub data.
- [**📰 Substack Publication Scraper**](https://apify.com/parseforge/substack-publication-scraper) - capture how technical newsletters cover trending repos.

> 💡 **Pro Tip:** browse the complete [ParseForge collection](https://apify.com/parseforge) for more pre-built scrapers and data tools.

---

**🆘 Need Help?** [**Open our contact form**](https://tally.so/r/BzdKgA) and we'll route the question to the right person.

---

> GitHub is a registered trademark of GitHub, Inc., a subsidiary of Microsoft. This Actor is not affiliated with or endorsed by GitHub. It uses only publicly accessible HTML and API endpoints.
