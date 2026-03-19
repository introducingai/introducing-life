import { useState, useEffect } from "react";

// ─── STORAGE LAYER ────────────────────────────────────────────────────────────
// Right now this uses localStorage so the archive persists per browser.
// To upgrade to a shared Supabase database, replace the functions below
// with Supabase client calls — the rest of the app stays exactly the same.

const STORAGE_KEY = "introducing-v1";

async function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function saveToStorage(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage full or unavailable
  }
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED = [
  { id: 1, date: "2025-03-01T10:00:00Z", project_name: "Okara AI CMO", one_liner: "An AI that acts as your Chief Marketing Officer and deploys agents to get you traffic.", what_it_does: "You enter your website URL and Okara deploys a team of AI agents to analyze your product and drive traffic and user acquisition. It positions itself as a fully autonomous CMO replacement.", who_built_it: "askOkara", category: "agent", tech_stack: ["AI agents", "web analysis"], novelty_score: 6, novelty_verdict: "Solid Execution", novelty_reasoning: "The CMO-as-agent angle is well-framed but marketing automation agents are a crowded space. The deployment-from-URL simplicity is the real differentiator.", hook: "Enter your website and it deploys a team of agents to help you get traffic and users.", missing: "What does get traffic actually mean here? SEO? Ads? Outreach? No specifics on mechanisms.", editorial_note: "Smart positioning, thin on substance — the real test is whether any of those agents actually move the needle." },
  { id: 2, date: "2025-03-01T10:01:00Z", project_name: "Moonshot Leverage", one_liner: "Crypto leverage trading up to 250x, accessible via Apple Pay.", what_it_does: "Moonshot Leverage lets users go long or short on BTC, ETH, and SOL with up to 250x leverage using Apple Pay and other payment methods. Currently live in select regions.", who_built_it: "moonshot", category: "app", tech_stack: ["crypto", "Apple Pay"], novelty_score: 4, novelty_verdict: "Repackaged", novelty_reasoning: "Leverage trading is ancient in crypto. The Apple Pay on-ramp is genuinely more accessible, but 250x leverage being sold as innovation is concerning, not impressive.", hook: "Long or short BTC, ETH, SOL with up to 250x your cash.", missing: "Who is this actually for? Retail traders with Apple Pay and 250x leverage is a recipe for liquidations, not a product.", editorial_note: "Making financial self-destruction frictionless is not the same as innovation." },
  { id: 3, date: "2025-03-01T10:02:00Z", project_name: "Tempo Machine Payments Protocol", one_liner: "An open standard for machines to pay each other, launching alongside the Tempo mainnet.", what_it_does: "Tempo launched its mainnet with public RPC endpoints for builders. Alongside it they introduced the Machine Payments Protocol, an open standard designed for autonomous machine-to-machine payments.", who_built_it: "tempo", category: "infra", tech_stack: ["blockchain", "RPC", "payments protocol"], novelty_score: 8, novelty_verdict: "Genuinely New", novelty_reasoning: "Machine-to-machine payments as an open standard is ahead of the current market. Most agent payment infrastructure is proprietary — an open protocol layer here is architecturally significant.", hook: "An open standard for machine payments, built for agents paying agents.", missing: "Who is adopting this? An open standard with no listed integrations is just a spec.", editorial_note: "The right bet at the right time — whether it becomes infrastructure or vaporware depends entirely on developer adoption." },
  { id: 4, date: "2025-03-01T10:03:00Z", project_name: "Attention Residuals (Kimi)", one_liner: "A new neural network component that lets models selectively remember earlier layers instead of accumulating everything uniformly.", what_it_does: "Kimi introduces Attention Residuals as a replacement for standard depth-wise residual connections in neural networks. Instead of fixed uniform accumulation, the model learns input-dependent attention over preceding layers. Validated on a 48B parameter model with a 1.25x compute advantage.", who_built_it: "Kimi / Moonshot AI", category: "framework", tech_stack: ["transformer architecture", "residual networks", "48B MoE"], novelty_score: 9, novelty_verdict: "Genuinely New", novelty_reasoning: "This is a fundamental architectural contribution, not a product announcement. Replacing fixed residuals with learned cross-layer attention addresses a real dilution problem in deep networks.", hook: "Replacing fixed residual connections with learned attention over preceding layers — 1.25x compute advantage, under 2% latency overhead.", missing: "Open weights? Open source implementation? The report link exists but no code drop mentioned.", editorial_note: "One of the few posts this week that is actually research — everything else is a product wrapper." },
  { id: 5, date: "2025-03-01T10:04:00Z", project_name: "Zed for Students", one_liner: "Zed Pro plan free for a year for university students and teachers.", what_it_does: "Zed is offering its Pro plan free for 12 months to current university students and teachers, including ten dollars per month in token credits and unlimited edit predictions.", who_built_it: "zeddotdev", category: "tool", tech_stack: ["code editor", "AI"], novelty_score: 3, novelty_verdict: "Repackaged", novelty_reasoning: "Student discounts are a standard acquisition tactic. Zed is a solid product but this is marketing, not a product launch.", hook: "Free Zed Pro for a year if you are a current university student.", missing: "Why now? What is Zed trying to capture by going after students specifically at this moment?", editorial_note: "Good for students, standard playbook — Cursor and GitHub Copilot did this years ago." },
  { id: 6, date: "2025-03-01T10:05:00Z", project_name: "Cloudflare /crawl Endpoint", one_liner: "One API call to crawl an entire website and get back clean HTML, Markdown, or JSON.", what_it_does: "Cloudflare added a /crawl endpoint that crawls an entire site with a single API call, no browser management or scripting required. Returns content in HTML, Markdown, or JSON format.", who_built_it: "CloudflareDev", category: "tool", tech_stack: ["Cloudflare", "web crawling", "API"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "Firecrawl and Jina already do this, but Cloudflare distributing it as a native endpoint changes the economics and reliability entirely — this is infrastructure at scale.", hook: "One API call. Entire site crawled. No scripts, no browser management.", missing: "Pricing model? Rate limits? This lands very differently if it is pay-per-crawl versus flat.", editorial_note: "Cloudflare keeps eating the middleware layer — smart and slightly ominous for every scraping startup out there." },
  { id: 7, date: "2025-03-01T10:06:00Z", project_name: "Notion Dashboards", one_liner: "A unified view in Notion showing boards, tables, charts, and timelines from your databases in one screen.", what_it_does: "Notion is rolling out Dashboards, a bird's-eye view layer for database content that combines multiple view types into a single screen.", who_built_it: "NotionHQ", category: "app", tech_stack: ["Notion", "databases"], novelty_score: 3, novelty_verdict: "Repackaged", novelty_reasoning: "Notion users have been asking for this for years. Every competing tool has had dashboards. This is catch-up, not innovation.", hook: "The bird's-eye view your databases needed — finally.", missing: "Can dashboards pull from multiple databases or only one? That distinction changes everything.", editorial_note: "Four years late to their own users' most requested feature — but better late than never." },
  { id: 8, date: "2025-03-01T10:07:00Z", project_name: "Stitch by Google", one_liner: "Google's AI-native design platform that turns natural language into high-fidelity interactive prototypes.", what_it_does: "Stitch is Google's vibe design platform that takes natural language input and generates high-fidelity UI designs on an AI-native canvas. It supports voice collaboration, interactive prototyping, and brand design systems.", who_built_it: "Google Labs", category: "tool", tech_stack: ["Gemini", "design AI", "prototyping"], novelty_score: 6, novelty_verdict: "Solid Execution", novelty_reasoning: "Figma, Framer, and several startups are in this space. Google's advantage is Gemini integration and distribution — not the concept itself.", hook: "Natural language to high-fidelity interactive prototype in one seamless flow.", missing: "Does output actually export to usable code or is it locked to Stitch? That is the real question for adoption.", editorial_note: "Google is finally building for creators rather than enterprises — Stitch will live or die on whether designers actually trust it." },
  { id: 9, date: "2025-03-01T10:08:00Z", project_name: "gstack by Garry Tan", one_liner: "A shareable Claude Code skill setup you install by pasting a single block of text.", what_it_does: "Garry Tan packaged his personal Claude Code configuration and skills into a shareable format called gstack. Developers paste one block of text into Claude Code to replicate his exact setup.", who_built_it: "garrytan", category: "tool", tech_stack: ["Claude Code"], novelty_score: 5, novelty_verdict: "Solid Execution", novelty_reasoning: "Shareable Claude Code configs are genuinely useful and underexplored. The novelty is the format and founder distribution, not a technical breakthrough.", hook: "Install my exact Claude Code skill setup by pasting one short block of text.", missing: "What is actually in gstack? The announcement does not describe the skills — just the install method.", editorial_note: "The real product here is the pattern of shareable configs, not gstack itself — someone should build a marketplace for these." },
  { id: 10, date: "2025-03-01T10:09:00Z", project_name: "Claude Code Review", one_liner: "When a pull request opens, Claude automatically dispatches agents to review it for bugs.", what_it_does: "Anthropic added a Code Review feature to Claude Code that triggers automatically when a PR is opened. A team of agents scans the diff and hunts for bugs, posting findings as part of the review workflow.", who_built_it: "Anthropic", category: "agent", tech_stack: ["Claude", "GitHub", "agents"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "CodeRabbit and others have done automated PR review, but Claude doing it natively inside Claude Code with multi-agent dispatch is a meaningfully tighter integration.", hook: "When a PR opens, Claude dispatches a team of agents to hunt for bugs.", missing: "Does this require Claude Code on both sides? What is the pricing model per review?", editorial_note: "The right feature at the right moment — this is Claude Code becoming the default development environment, not just a coding assistant." },
  { id: 11, date: "2025-03-01T10:10:00Z", project_name: "Base44 Superagents", one_liner: "Managed agent infrastructure with no API keys, no config, and no maintenance — connects to all your tools in one click.", what_it_does: "Base44 Superagents is a managed platform for AI agents that handles infrastructure, security, and integrations out of the box. Agents run 24/7, remember context, act proactively, and are accessible from WhatsApp, Telegram, Slack, or browser.", who_built_it: "Base44", category: "infra", tech_stack: ["managed infra", "WhatsApp", "Telegram", "Slack"], novelty_score: 5, novelty_verdict: "Solid Execution", novelty_reasoning: "The fully managed agent infrastructure pitch is crowded. The multi-channel accessibility via WhatsApp and Telegram is a real differentiator for non-technical users.", hook: "No API keys to juggle, no config files, no security setup — just what your agent does.", missing: "What LLMs power this? What are the actual limitations of the one-click integrations?", editorial_note: "Every platform is converging on this pitch — the differentiation will come from which integrations actually work reliably." },
  { id: 12, date: "2025-03-01T10:11:00Z", project_name: "Pump.fun $3M Hackathon", one_liner: "A three million dollar Build in Public hackathon from Pump.fun's investment arm.", what_it_does: "Pump.fun launched a $3M Build in Public Hackathon through its new investment arm, Pump Fund. The pitch is reimagining early-stage project building and funding — details are sparse.", who_built_it: "Pumpfun", category: "other", tech_stack: ["crypto", "hackathon"], novelty_score: 3, novelty_verdict: "Vaporware", novelty_reasoning: "A hackathon announcement with no details on format, criteria, judges, or timeline is marketing noise until proven otherwise.", hook: "$3,000,000 to reimagine how early-stage projects are built and funded.", missing: "Almost everything — tracks, judges, timeline, what Build in Public actually means here.", editorial_note: "Pump.fun runs on attention and this is a very expensive attention grab — will believe it when projects get funded." },
  { id: 13, date: "2025-03-01T10:12:00Z", project_name: "Treasure DAO 402-AMM", one_liner: "A way to build web apps where users can swap tokens without needing gas or a Uniswap widget.", what_it_does: "Treasure DAO launched 402-AMM, an automated market maker that enables token swaps inside web applications without requiring users to pay gas or interact with Uniswap directly. Live on the Treasure network.", who_built_it: "Treasure_DAO", category: "infra", tech_stack: ["AMM", "Treasure", "DeFi", "x402"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "Gasless token swaps embedded in web apps remove a real friction point for mainstream DeFi adoption. The x402 standard integration ties this into a broader payment primitive stack.", hook: "Build web apps where users swap tokens with no gas and no Uniswap widget.", missing: "What tokens are supported? What are the liquidity constraints at launch?", editorial_note: "This is infrastructure that makes crypto products feel less like crypto — which is the right direction." },
  { id: 14, date: "2025-03-01T10:13:00Z", project_name: "Google Maps Ask Maps", one_liner: "Google Maps rebuilt around a Gemini-powered AI layer that lets you ask anything about any place.", what_it_does: "Google Maps introduced Ask Maps, a Gemini-powered conversational layer that lets users ask anything about any location. The update also includes immersive navigation and personalization features. Rolling out on Android and iOS in the US and India.", who_built_it: "Google", category: "app", tech_stack: ["Gemini", "Google Maps", "iOS", "Android"], novelty_score: 6, novelty_verdict: "Solid Execution", novelty_reasoning: "Conversational search in maps is not new but Gemini's reasoning quality plus the scale of Maps data makes this a potentially step-change experience.", hook: "The way you use Google Maps will never be the same.", missing: "How does Ask Maps handle ambiguous or subjective queries? That gap reveals the AI quality.", editorial_note: "Google is finally using its data advantage intelligently — this should have existed three years ago." },
  { id: 15, date: "2025-03-01T10:14:00Z", project_name: "Manus Desktop", one_liner: "Manus AI agent moved from the cloud to your local machine with direct access to your computer.", what_it_does: "Manus introduced My Computer, a desktop app feature that lets the Manus AI agent run locally on your machine rather than in the cloud. The agent gets direct access to local files and applications.", who_built_it: "ManusAI", category: "agent", tech_stack: ["desktop", "local AI", "agent"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "Local execution of a general-purpose agent is a meaningful privacy and latency improvement over cloud-only. The framing of putting AI inside your computer is a useful mental model shift.", hook: "Taking Manus out of the cloud and putting it on your desktop — your AI agent, now on your local machine.", missing: "What can it actually access locally? Full filesystem? Browser? The scope of local access defines usefulness.", editorial_note: "The privacy angle writes itself — Manus should be leading with that harder instead of the tech spec." },
  { id: 16, date: "2025-03-01T10:15:00Z", project_name: "MuleRun 2.0", one_liner: "A personal AI that learns your habits and works autonomously on your PC around the clock.", what_it_does: "MuleRun 2.0 is a personal AI that runs 24/7 on a dedicated PC assigned to the user. It learns habits, anticipates needs, and acts proactively without requiring explicit commands.", who_built_it: "mulerun_ai", category: "agent", tech_stack: ["local AI", "personal agent", "PC"], novelty_score: 5, novelty_verdict: "Solid Execution", novelty_reasoning: "The always-on personal AI running locally is a real category but well-crowded right now. The habit-learning angle is the differentiator — execution quality will determine if it holds.", hook: "Your personal AI that acts before you ask — learns your habits, works while you sleep.", missing: "What does it actually do autonomously? The post describes behavior but gives no concrete examples.", editorial_note: "Everyone is promising the same always-on AI PC this week — MuleRun needs a concrete killer use case to stand out." },
  { id: 17, date: "2025-03-01T10:16:00Z", project_name: "CashClaw", one_liner: "An open-source autonomous agent that finds work, does it, gets paid, and learns to earn more over time.", what_it_does: "CashClaw is an agent framework built on Moltlaunch infrastructure that autonomously finds paid work, delivers it, collects payment, reads feedback, and improves. Discovery, reputation, identity, and payments are handled natively by the platform.", who_built_it: "moltlaunch", category: "agent", tech_stack: ["Moltlaunch", "OpenClaw", "open source"], novelty_score: 8, novelty_verdict: "Genuinely New", novelty_reasoning: "A fully autonomous earn-and-learn loop for agents as an open-source framework is a concrete step toward economically independent agents. The platform handling identity and payments removes the hardest parts.", hook: "The agent finds work, gets paid, reads feedback, finds better tools, finds more work — autonomously.", missing: "What kinds of work does it actually find? Who is paying agents on Moltlaunch?", editorial_note: "If this ships as described, CashClaw is one of the more genuinely radical things in this list — autonomous economic agents with memory are not trivial." },
  { id: 18, date: "2025-03-01T10:17:00Z", project_name: "The Anthropic Institute", one_liner: "Anthropic's new effort to advance the public conversation about powerful AI.", what_it_does: "Anthropic launched The Anthropic Institute, a new effort focused on public discourse around powerful AI systems. No additional technical details in the announcement.", who_built_it: "Anthropic", category: "other", tech_stack: [], novelty_score: 4, novelty_verdict: "Solid Execution", novelty_reasoning: "Think tanks around AI are not new, but Anthropic doing it directly is a meaningful signal about where they see public policy risk.", hook: "A new effort to advance the public conversation about powerful AI.", missing: "What does the institute actually do? Publish research? Host convenings? Lobby? Zero specifics.", editorial_note: "Could be important infrastructure for AI governance or a PR move — nothing in the post distinguishes between the two." },
  { id: 19, date: "2025-03-01T10:18:00Z", project_name: "Simile", one_liner: "A $100M-funded startup building the most accurate simulations of human behavior.", what_it_does: "Simile raised $100M from Index, Hanabi, and others including Karpathy, Fei-Fei Li, and Adam D'Angelo to tackle simulating human behavior — described as one of the most consequential and technically difficult problems of our time.", who_built_it: "joon_s_pk", category: "infra", tech_stack: ["human simulation", "AI"], novelty_score: 9, novelty_verdict: "Genuinely New", novelty_reasoning: "Accurate human behavior simulation at scale would fundamentally change product development, policy modeling, and social science. The backer caliber suggests this is real.", hook: "Simulating human behavior — one of the most consequential and technically difficult problems of our time.", missing: "What is the actual product or output? A simulator you query? An API? Nothing in the announcement describes what Simile ships.", editorial_note: "The backers list alone makes this worth watching — Karpathy and Fei-Fei betting together on something is not accidental." },
  { id: 20, date: "2025-03-01T10:19:00Z", project_name: "Adaptive Computer", one_liner: "An always-on AI personal computer where the AI lives inside the machine and handles real work autonomously.", what_it_does: "Adaptive puts AI inside a dedicated always-on personal computer it provides to users. The agent can schedule tasks, create software, and automate anything on that machine. Offering one free month at launch.", who_built_it: "adaptiveai", category: "agent", tech_stack: ["desktop AI", "agent", "cloud PC"], novelty_score: 6, novelty_verdict: "Solid Execution", novelty_reasoning: "Same category as MuleRun and Manus launching this week. Adaptive's differentiation is providing the computer itself rather than running on yours.", hook: "AI inside an always-on personal computer — schedule agents, create software, automate anything.", missing: "Is this a cloud VM or physical hardware? The economics of providing hardware matter enormously here.", editorial_note: "The AI PC wave is real but three nearly identical products launching the same week suggests a trend moment, not a winner yet." },
  { id: 21, date: "2025-03-01T10:20:00Z", project_name: "Replit Agent 4", one_liner: "An AI built for creative collaboration between humans and agents with infinite canvas, parallel agents, and full app shipping.", what_it_does: "Replit launched Agent 4, described as the first AI built for creative human-agent collaboration. Features include an infinite canvas for design, team collaboration, parallel agent execution, and shipping of full apps, sites, and slides.", who_built_it: "amasad / Replit", category: "agent", tech_stack: ["Replit", "agents", "canvas"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "The infinite canvas approach to software creation is genuinely new framing for Replit and feels distinct from the text-based vibe coding paradigm. Parallel agents within one project is a meaningful workflow change.", hook: "Software is not merely technical anymore — it is creative. The first AI built for creative collaboration between humans and agents.", missing: "What does parallel agents actually mean in practice? Can they conflict? How does the user manage diverging agent threads?", editorial_note: "Replit keeps repositioning itself right when the market moves — Agent 4 is their best framing yet." },
  { id: 22, date: "2025-03-01T10:21:00Z", project_name: "Unsloth Studio", one_liner: "An open-source web UI for training and running over 500 LLMs locally at 2x speed with 70% less VRAM.", what_it_does: "Unsloth Studio is an open-source interface for training and running language models locally on Mac, Windows, or Linux. It achieves 2x training speed with 70% less VRAM, supports GGUF, vision, audio, and embedding models, and auto-generates datasets from PDFs and CSVs.", who_built_it: "UnslothAI", category: "tool", tech_stack: ["open source", "LLM training", "GGUF", "local inference", "Hugging Face"], novelty_score: 8, novelty_verdict: "Genuinely New", novelty_reasoning: "Unsloth's efficiency gains are real and documented. A full web UI wrapping those gains with dataset generation and model comparison makes fine-tuning accessible to a completely new tier of users.", hook: "Train 500+ models at 2x speed with 70% less VRAM — open source, runs locally.", missing: "How does dataset quality from auto-generation from PDFs actually hold up? That is the hidden risk in the pipeline.", editorial_note: "Unsloth keeps shipping things that should have existed years ago — one of the more genuinely useful open source releases in recent months." },
  { id: 23, date: "2025-03-01T10:22:00Z", project_name: "OpenVenice", one_liner: "An open-source browser-native frontend for Venice AI where your API key never touches a server.", what_it_does: "OpenVenice is a self-hostable frontend for Venice AI that runs entirely in the browser. Supports chat, image gen, audio, music, video, embeddings, and visual model-chaining workflows. API key never leaves the browser. MIT licensed.", who_built_it: "nikshepsvn", category: "tool", tech_stack: ["Venice AI", "open source", "browser-native", "MIT"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "Privacy-first browser-native AI frontends are rare. The visual model-chaining across modalities is genuinely useful and not widely implemented as a UI primitive.", hook: "Your API key stays in your browser, talks directly to Venice — no server, no backend.", missing: "How does this handle rate limiting and errors when the chain breaks mid-workflow?", editorial_note: "Built because it did not exist and shared openly — the right reason to build, the right way to ship." },
  { id: 24, date: "2025-03-01T10:23:00Z", project_name: "Helios", one_liner: "An open-source harness for running autonomous machine learning experiments without the problems of existing tools.", what_it_does: "Helios is an autonomous ML research harness built because existing auto-experiment tools had problems the author could not work around. Designed for researchers who want to run and iterate on experiments without constant supervision.", who_built_it: "snwy_me", category: "tool", tech_stack: ["ML research", "autonomous experiments", "open source"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "A framework-agnostic harness for autonomous ML research scratches a real itch for independent researchers. Auto-ML experiment runners exist but are largely tied to specific frameworks.", hook: "I looked at every existing tool and each one had problems — so I built Helios for autonomous ML research.", missing: "What specific problems does it solve? The post is frustratingly vague on technical differentiation.", editorial_note: "Scratching your own itch is the right reason to build — but this needs clearer articulation of what makes it different." },
  { id: 25, date: "2025-03-01T10:24:00Z", project_name: "MiniMax M2.7", one_liner: "MiniMax's new model that helped design its own training process and matches Sonnet on agentic benchmarks.", what_it_does: "MiniMax-M2.7 is a production-ready model with strong software engineering benchmarks, 97% skill adherence across 40+ agentic tasks, and high-fidelity Office file editing. The model participated in designing its own evolution from M2.5.", who_built_it: "MiniMax_AI", category: "framework", tech_stack: ["LLM", "agentic AI", "MoE"], novelty_score: 8, novelty_verdict: "Genuinely New", novelty_reasoning: "A model that participated in designing its own training is a meaningful claim if verified — self-improving training pipelines are at the frontier of AI research.", hook: "The first model which deeply participated in its own evolution — 88% win-rate versus its predecessor.", missing: "What does participated in its own evolution actually mean technically? This claim needs unpacking.", editorial_note: "If the self-directed training claim holds under scrutiny, this is one of the most significant model releases this week." },
  { id: 26, date: "2025-03-01T10:25:00Z", project_name: "Bustem", one_liner: "An AI that scans the internet to find and eliminate counterfeits targeting your brand, backed by $64M.", what_it_does: "Bustem raised $64M and built a platform that scans the internet to identify and remove counterfeit products and scammers targeting brands.", who_built_it: "oliverbrocato", category: "agent", tech_stack: ["web scanning", "brand protection", "AI"], novelty_score: 6, novelty_verdict: "Solid Execution", novelty_reasoning: "Brand protection and counterfeit detection is a real and large market. The AI-native approach to eliminating rather than just detecting is a meaningful step up.", hook: "Bustem scans the internet to find and eliminate 100% of counterfeits.", missing: "100% elimination is a bold claim — what is the actual success rate and what does elimination mean legally?", editorial_note: "The reply-bait mechanic undercuts what could be a serious brand protection product — mismatched with a $64M raise." },
  { id: 27, date: "2025-03-01T10:26:00Z", project_name: "Gemini-Powered Google Workspace", one_liner: "Google Docs, Sheets, Slides, and Drive rebuilt with Gemini including AI Overviews and fully editable AI-generated slides.", what_it_does: "Google overhauled Docs, Sheets, Slides, and Drive with Gemini integration. Features include AI Overviews, grounded writing context, and fully editable AI-generated slide content.", who_built_it: "Google", category: "tool", tech_stack: ["Gemini", "Google Workspace", "Docs", "Slides"], novelty_score: 5, novelty_verdict: "Solid Execution", novelty_reasoning: "Microsoft has had Copilot in Office for over a year. Google is catching up with real quality but this is competitive execution, not category creation.", hook: "Fully editable AI-made slides and AI Overviews inside every Google Workspace app.", missing: "How does grounding actually work in Docs — does it cite sources or just inform without attribution?", editorial_note: "Google needed this and it is good — but Copilot had a year head start and the enterprise switching cost is real." },
  { id: 28, date: "2025-03-01T10:27:00Z", project_name: "Durable AI Business Builder", one_liner: "Claims to be an AI that replaces your 9-to-5 income by building your business for you.", what_it_does: "Durable positions itself as an AI business builder that autonomously constructs and runs a business for the user. The announcement relies almost entirely on an RT-and-comment engagement mechanic.", who_built_it: "jamesclift", category: "agent", tech_stack: ["AI", "business automation"], novelty_score: 2, novelty_verdict: "Vaporware", novelty_reasoning: "Replacing a 9-to-5 income via AI is a viral hook, not a product claim. The RT-for-free mechanic is classic engagement farming with no specifics on what Durable actually does.", hook: "The first AI business builder that replaces your 9-5 income.", missing: "What does it build? What is the business? What has it actually produced for existing users?", editorial_note: "The engagement farming mechanic and the vague promise together are a reliable vaporware signature — skip." },
  { id: 29, date: "2025-03-01T10:28:00Z", project_name: "FlashCompact", one_liner: "A specialized model that compresses 200k token contexts down to 50k in about 1.5 seconds.", what_it_does: "FlashCompact is the first model purpose-built for context compaction. It processes 33,000 tokens per second and compresses a 200k token context to 50k in roughly 1.5 seconds.", who_built_it: "morphllm", category: "framework", tech_stack: ["context compaction", "LLM", "inference"], novelty_score: 9, novelty_verdict: "Genuinely New", novelty_reasoning: "A specialized model trained specifically for context compression rather than general summarization is architecturally novel. 33k tokens per second at this compression ratio is a meaningful technical achievement.", hook: "33,000 tokens per second — 200k context to 50k in 1.5 seconds. The first model built only for compaction.", missing: "What is the quality loss at that compression ratio? Is this lossy in a way that matters for downstream reasoning?", editorial_note: "Specialized models for infrastructure tasks is an underexplored direction — FlashCompact is doing something genuinely new in a space everyone needs." },
  { id: 30, date: "2025-03-01T10:29:00Z", project_name: "Vibe-Coding for Designers School", one_liner: "An online school teaching designers to ship software using Claude Code, including Figma-to-Claude modules.", what_it_does: "An online school specifically for designers who want to learn to build and ship products using Claude Code. Includes Figma-to-Claude workflow modules and positions designer-builders as the most valuable hires in tech.", who_built_it: "felixleezd", category: "other", tech_stack: ["Claude Code", "Figma", "education"], novelty_score: 5, novelty_verdict: "Solid Execution", novelty_reasoning: "Designer-focused coding education is genuinely underserved and the timing with vibe coding momentum is smart. Claude Code as the vehicle makes sense.", hook: "Designers who ship are the most valuable hires in tech today.", missing: "What is the actual curriculum? How long does it take? What can a graduate actually build?", editorial_note: "The framing is excellent and the market gap is real — everything depends on whether the actual content delivers on the promise." }
];

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
// The API key is injected by the Anthropic proxy in claude.ai.
// For production on introducing.life, create a lightweight backend function
// (Vercel Edge Function or Supabase Edge Function) that holds your key server-side
// and proxies requests. Never expose an API key in client-side code.

const SYSTEM_PROMPT = `You are the editorial engine behind INTRODUCING — a daily digest and intelligence layer for the agentic internet. You receive raw launch posts from developers and return structured journalistic profiles.

Be sharp, honest, and opinionated. You are not a hype machine. You celebrate genuine innovation and call out repackaging.

Return ONLY a valid JSON object, no markdown, no backticks, no preamble:
{
  "project_name": "Name of the thing being introduced",
  "one_liner": "One sentence that explains what it does to a non-technical person",
  "what_it_does": "2-3 sentence clear explanation of the product or tool or agent",
  "who_built_it": "Author name or handle if detectable, otherwise Unknown",
  "category": "one of: agent, tool, app, infra, framework, other",
  "tech_stack": ["list", "of", "technologies"],
  "novelty_score": 7,
  "novelty_verdict": "one of: Genuinely New, Solid Execution, Repackaged, Vaporware",
  "novelty_reasoning": "1-2 sentences on why you gave that score",
  "hook": "The one sentence someone would screenshot from this launch",
  "missing": "What is not being said? What question does this raise?",
  "editorial_note": "A sharp journalistic 1-sentence take, honest but not cruel"
}`;

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const CAT_COLORS = {
  agent: "#00ff87",
  tool: "#60a5fa",
  app: "#f472b6",
  infra: "#fb923c",
  framework: "#a78bfa",
  other: "#94a3b8",
};

const VERDICT_COLORS = {
  "Genuinely New": "#00ff87",
  "Solid Execution": "#60a5fa",
  "Repackaged": "#fb923c",
  "Vaporware": "#f87171",
};

const VERDICTS = ["all", "Genuinely New", "Solid Execution", "Repackaged", "Vaporware"];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function NoveltyBar({ score }) {
  const color = score >= 7 ? "#00ff87" : score >= 4 ? "#fb923c" : "#f87171";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score * 10}%`, background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8", minWidth: 24 }}>{score}/10</span>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 2, fontSize: 10,
      fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1,
      background: `${color}20`, color, border: `1px solid ${color}40`,
    }}>
      {label}
    </span>
  );
}

function Card({ entry, featured, onClick }) {
  const cc = CAT_COLORS[entry.category] || "#94a3b8";
  const vc = VERDICT_COLORS[entry.novelty_verdict] || "#94a3b8";
  return (
    <div
      onClick={onClick}
      style={{
        border: featured ? "1px solid #00ff87" : "1px solid #1e293b",
        borderRadius: 2, padding: featured ? 28 : 18,
        background: featured ? "rgba(0,255,135,0.03)" : "#0a0a12",
        marginBottom: featured ? 0 : 10,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Tag label={entry.category} color={cc} />
          <Tag label={entry.novelty_verdict} color={vc} />
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#334155" }}>
          {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: featured ? 24 : 16, fontWeight: 700,
        color: "#f8fafc", margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.2,
      }}>
        {entry.project_name}
      </h2>

      {entry.who_built_it && entry.who_built_it !== "Unknown" && (
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#64748b", marginBottom: 8 }}>
          by {entry.who_built_it}
        </div>
      )}

      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, margin: "0 0 10px" }}>
        {entry.what_it_does}
      </p>

      {featured && (
        <>
          <div style={{
            borderLeft: "2px solid #00ff87", paddingLeft: 14, margin: "16px 0",
            color: "#e2e8f0", fontSize: 14, fontStyle: "italic",
            fontFamily: "'Playfair Display', serif", lineHeight: 1.6,
          }}>
            {entry.hook}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "14px 0" }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Novelty</div>
              <NoveltyBar score={entry.novelty_score} />
              <p style={{ color: "#64748b", fontSize: 11, margin: "6px 0 0", lineHeight: 1.5 }}>{entry.novelty_reasoning}</p>
            </div>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Stack</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {(entry.tech_stack || []).map((t) => (
                  <span key={t} style={{ fontFamily: "monospace", fontSize: 10, color: "#475569", background: "#0f172a", padding: "2px 6px", borderRadius: 2 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #0f172a", paddingTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>What is missing</div>
              <p style={{ color: "#64748b", fontSize: 11, margin: 0, lineHeight: 1.5 }}>{entry.missing}</p>
            </div>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Editorial</div>
              <p style={{ color: "#64748b", fontSize: 11, margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>{entry.editorial_note}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stats({ entries }) {
  const avg = entries.length
    ? (entries.reduce((s, e) => s + (e.novelty_score || 0), 0) / entries.length).toFixed(1)
    : 0;
  const gn = entries.filter((e) => e.novelty_verdict === "Genuinely New").length;
  const vp = entries.filter((e) => e.novelty_verdict === "Vaporware").length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28, padding: "14px 0", borderBottom: "1px solid #0f172a" }}>
      {[["Profiled", entries.length], ["Avg Novelty", `${avg}/10`], ["Genuinely New", gn], ["Vaporware", vp]].map(([label, value]) => (
        <div key={label} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#f8fafc" }}>{value}</div>
          <div style={{ fontFamily: "monospace", fontSize: 9, color: "#334155", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState("digest");
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [featured, setFeatured] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("introducing-apikey") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => { boot(); }, []);

  async function boot() {
    const stored = await loadFromStorage();
    if (stored && stored.length > 0) {
      setEntries(stored);
      setFeatured(stored[0]);
    } else {
      setEntries(SEED);
      setFeatured(SEED[0]);
      await saveToStorage(SEED);
    }
  }

  async function addEntry(entry) {
    const updated = [entry, ...entries];
    setEntries(updated);
    setFeatured(entry);
    await saveToStorage(updated);
  }

  function saveApiKey(key) {
    setApiKey(key);
    localStorage.setItem("introducing-apikey", key);
    setShowKeyInput(false);
  }

  async function analyze() {
    if (!input.trim() || loading) return;
    if (!apiKey) { setShowKeyInput(true); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Analyze this launch post:\n\n${input}` }],
        }),
      });
      const data = await res.json();
      const block = (data.content || []).find((b) => b.type === "text");
      if (!block) throw new Error("no response");
      const parsed = JSON.parse(block.text.replace(/```json|```/g, "").trim());
      const entry = { ...parsed, id: Date.now(), date: new Date().toISOString() };
      await addEntry(entry);
      setInput("");
      setView("digest");
    } catch (e) {
      setError("Could not parse that post. Try pasting more of the original text.");
    }
    setLoading(false);
  }

  const filtered = filter === "all" ? entries : entries.filter((e) => e.novelty_verdict === filter);
  const disabled = loading || !input.trim();

  return (
    <div style={{ minHeight: "100vh", background: "#06060f", color: "#f8fafc", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        .pulse { animation: pulse 1.8s ease-in-out infinite; }
        * { box-sizing: border-box; }
        textarea { font-family: 'DM Sans', sans-serif !important; }
        textarea:focus { outline: none; border-color: #334155 !important; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        borderBottom: "1px solid #0f172a", padding: "0 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: 50, position: "sticky", top: 0, background: "#06060f", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 900, letterSpacing: -1, color: "#f8fafc" }}>
            INTRODUCING
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#334155", letterSpacing: 2 }}>
            {entries.length} PROFILED
          </span>
        </div>
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {["digest", "archive", "analyze"].map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? "#0f172a" : "transparent",
              border: `1px solid ${view === v ? "#1e293b" : "transparent"}`,
              color: view === v ? "#f8fafc" : "#475569",
              padding: "3px 10px", borderRadius: 2, cursor: "pointer",
              fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 1,
            }}>
              {v}
            </button>
          ))}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            title={apiKey ? "API key set" : "Set API key"}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: apiKey ? "#00ff87" : "#334155", fontFamily: "monospace",
              fontSize: 10, marginLeft: 6, padding: "3px 6px",
            }}
          >
            {apiKey ? "◆" : "◇"} key
          </button>
        </div>
      </header>

      {/* ── API Key Modal ── */}
      {showKeyInput && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
        }}>
          <div style={{ background: "#0a0a12", border: "1px solid #1e293b", borderRadius: 4, padding: 28, width: 420, maxWidth: "90vw" }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Anthropic API Key
            </div>
            <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              Your key is stored only in this browser and used to call Claude directly.
              Get a key at console.anthropic.com
            </p>
            <input
              type="password"
              defaultValue={apiKey}
              placeholder="sk-ant-..."
              id="apikey-input"
              style={{
                width: "100%", background: "#06060f", border: "1px solid #1e293b",
                borderRadius: 2, color: "#cbd5e1", padding: "10px 12px",
                fontSize: 13, fontFamily: "monospace", marginBottom: 12,
              }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowKeyInput(false)} style={{ background: "transparent", border: "1px solid #1e293b", color: "#475569", padding: "7px 16px", borderRadius: 2, cursor: "pointer", fontFamily: "monospace", fontSize: 10 }}>
                Cancel
              </button>
              <button
                onClick={() => saveApiKey(document.getElementById("apikey-input").value.trim())}
                style={{ background: "#00ff87", border: "none", color: "#06060f", padding: "7px 16px", borderRadius: 2, cursor: "pointer", fontFamily: "monospace", fontSize: 10, fontWeight: 700 }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "24px 18px" }}>

        {/* DIGEST VIEW */}
        {view === "digest" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#334155", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
                introducing.life — the agentic internet, profiled daily
              </div>
              <div style={{ width: 28, height: 1, background: "#1e293b", margin: "0 auto" }} />
            </div>
            <Stats entries={entries} />
            {featured && (
              <>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#334155", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                  Featured entry
                </div>
                <Card entry={featured} featured={true} />
              </>
            )}
          </div>
        )}

        {/* ARCHIVE VIEW */}
        {view === "archive" && (
          <div>
            <div style={{ display: "flex", gap: 5, marginBottom: 18, flexWrap: "wrap" }}>
              {VERDICTS.map((v) => {
                const color = v === "all" ? "#64748b" : VERDICT_COLORS[v];
                const count = v === "all" ? entries.length : entries.filter((e) => e.novelty_verdict === v).length;
                return (
                  <button key={v} onClick={() => setFilter(v)} style={{
                    background: filter === v ? `${color}20` : "transparent",
                    border: `1px solid ${filter === v ? color : "#1e293b"}`,
                    color: filter === v ? color : "#475569",
                    padding: "3px 10px", borderRadius: 2, cursor: "pointer",
                    fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 1,
                  }}>
                    {v} {count}
                  </button>
                );
              })}
            </div>
            {filtered.map((e) => (
              <Card key={e.id} entry={e} featured={false} onClick={() => { setFeatured(e); setView("digest"); }} />
            ))}
          </div>
        )}

        {/* ANALYZE VIEW */}
        {view === "analyze" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#334155", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
                Profile a new launch
              </div>
              <div style={{ width: 28, height: 1, background: "#1e293b", margin: "0 auto" }} />
            </div>

            {!apiKey && (
              <div style={{ marginBottom: 16, padding: 14, background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 2 }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#fb923c" }}>
                  Set your Anthropic API key first — click the ◇ key button in the header.
                </span>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                Paste a launch post from X, GitHub, or Product Hunt
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Introducing something that will change everything..."
                style={{
                  width: "100%", minHeight: 130, background: "#0a0a12",
                  border: "1px solid #1e293b", borderRadius: 2, color: "#cbd5e1",
                  padding: 14, fontSize: 14, lineHeight: 1.6, resize: "vertical", display: "block",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  onClick={analyze}
                  disabled={disabled}
                  style={{
                    background: disabled ? "#0f172a" : "#00ff87",
                    color: disabled ? "#334155" : "#06060f",
                    border: "none", padding: "9px 24px", borderRadius: 2,
                    cursor: disabled ? "not-allowed" : "pointer",
                    fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                  }}
                >
                  {loading ? "Reading..." : "Profile it"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ color: "#f87171", fontFamily: "monospace", fontSize: 12, marginBottom: 14, padding: 12, background: "rgba(248,113,113,0.1)", borderRadius: 2, border: "1px solid rgba(248,113,113,0.3)" }}>
                {error}
              </div>
            )}
            {loading && (
              <div style={{ textAlign: "center", padding: 36 }}>
                <div className="pulse" style={{ fontFamily: "monospace", fontSize: 11, color: "#334155", letterSpacing: 3 }}>
                  READING THE LAUNCH
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "32px 0 20px", borderTop: "1px solid #0f172a", marginTop: 48 }}>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: "#1e293b", letterSpacing: 2 }}>
          introducing.life — {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}
