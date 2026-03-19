# introducing.life

The agentic internet, profiled daily.

## Deploy in 10 minutes

### 1. Put this on GitHub

Create a new repo at github.com/new called `introducing-life`, then:

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/introducing-life.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to vercel.com → New Project
2. Import your `introducing-life` GitHub repo
3. Vercel auto-detects Vite — just click Deploy
4. You get a live URL immediately (e.g. introducing-life.vercel.app)

### 3. Connect introducing.life

In your Vercel project → Settings → Domains → Add `introducing.life`

In your domain registrar DNS settings, add:
- Type `A` — Name `@` — Value `76.76.21.21`
- Type `CNAME` — Name `www` — Value `cname.vercel-dns.com`

DNS propagates within 1 hour usually.

### 4. Set up the API key (for the Analyze tab)

The app uses the Anthropic API to profile launch posts.
In the live app, click the `◇ key` button in the header and paste your Anthropic API key.
It is stored only in your browser's localStorage — never sent anywhere else.

**For production:** Replace the direct API call in `src/App.jsx` with a
Vercel Edge Function that holds the key server-side. Ask Claude to help
you set this up when you're ready.

---

## Upgrade path: Shared database

Right now each visitor has their own local archive. To make it shared
(everyone sees the same entries), upgrade the storage layer:

1. Create a free Supabase project at supabase.com
2. Create a table called `entries` with columns matching the entry schema
3. Replace the `loadFromStorage` and `saveToStorage` functions in `App.jsx`
   with Supabase client calls
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel env vars

The rest of the app stays identical.

---

## Entry schema

```json
{
  "id": 1234567890,
  "date": "2025-03-19T10:00:00Z",
  "project_name": "string",
  "one_liner": "string",
  "what_it_does": "string",
  "who_built_it": "string",
  "category": "agent | tool | app | infra | framework | other",
  "tech_stack": ["string"],
  "novelty_score": 7,
  "novelty_verdict": "Genuinely New | Solid Execution | Repackaged | Vaporware",
  "novelty_reasoning": "string",
  "hook": "string",
  "missing": "string",
  "editorial_note": "string"
}
```

---

## Roadmap

- [ ] Shared Supabase database (all visitors see same archive)
- [ ] Server-side API key via Vercel Edge Function
- [ ] Submit form so builders can submit their own launches
- [ ] Daily email digest
- [ ] X/Twitter monitoring via API or RSS
- [ ] GitHub Trending scraper
- [ ] Product Hunt feed integration
- [ ] One featured pick per day, auto-selected by novelty score
