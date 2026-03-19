import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "introducing-v1";
async function loadFromStorage() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
async function saveToStorage(entries) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch {}
}

const SEED = [
  { id: 1, date: "2025-03-01T10:00:00Z", project_name: "Okara AI CMO", one_liner: "An AI that acts as your Chief Marketing Officer and deploys agents to get you traffic.", what_it_does: "You enter your website URL and Okara deploys a team of AI agents to analyze your product and drive traffic and user acquisition. It positions itself as a fully autonomous CMO replacement.", who_built_it: "askOkara", category: "agent", tech_stack: ["AI agents", "web analysis"], novelty_score: 6, novelty_verdict: "Solid Execution", novelty_reasoning: "The CMO-as-agent angle is well-framed but marketing automation agents are a crowded space. The deployment-from-URL simplicity is the real differentiator.", hook: "Enter your website and it deploys a team of agents to help you get traffic and users.", missing: "What does get traffic actually mean here? SEO? Ads? Outreach? No specifics on mechanisms.", editorial_note: "Smart positioning, thin on substance — the real test is whether any of those agents actually move the needle." },
  { id: 2, date: "2025-03-01T10:01:00Z", project_name: "Moonshot Leverage", one_liner: "Crypto leverage trading up to 250x, accessible via Apple Pay.", what_it_does: "Moonshot Leverage lets users go long or short on BTC, ETH, and SOL with up to 250x leverage using Apple Pay and other payment methods. Currently live in select regions.", who_built_it: "moonshot", category: "app", tech_stack: ["crypto", "Apple Pay"], novelty_score: 4, novelty_verdict: "Repackaged", novelty_reasoning: "Leverage trading is ancient in crypto. The Apple Pay on-ramp is genuinely more accessible, but 250x leverage being sold as innovation is concerning, not impressive.", hook: "Long or short BTC, ETH, SOL with up to 250x your cash.", missing: "Who is this actually for? Retail traders with Apple Pay and 250x leverage is a recipe for liquidations, not a product.", editorial_note: "Making financial self-destruction frictionless is not the same as innovation." },
  { id: 3, date: "2025-03-01T10:02:00Z", project_name: "Tempo Machine Payments Protocol", one_liner: "An open standard for machines to pay each other, launching alongside the Tempo mainnet.", what_it_does: "Tempo launched its mainnet with public RPC endpoints for builders. Alongside it they introduced the Machine Payments Protocol, an open standard designed for autonomous machine-to-machine payments.", who_built_it: "tempo", category: "infra", tech_stack: ["blockchain", "RPC", "payments protocol"], novelty_score: 8, novelty_verdict: "Genuinely New", novelty_reasoning: "Machine-to-machine payments as an open standard is ahead of the current market. Most agent payment infrastructure is proprietary — an open protocol layer here is architecturally significant.", hook: "An open standard for machine payments, built for agents paying agents.", missing: "Who is adopting this? An open standard with no listed integrations is just a spec.", editorial_note: "The right bet at the right time — whether it becomes infrastructure or vaporware depends entirely on developer adoption." },
  { id: 4, date: "2025-03-01T10:03:00Z", project_name: "Attention Residuals (Kimi)", one_liner: "A new neural network component that lets models selectively remember earlier layers instead of accumulating everything uniformly.", what_it_does: "Kimi introduces Attention Residuals as a replacement for standard depth-wise residual connections in neural networks. Instead of fixed uniform accumulation, the model learns input-dependent attention over preceding layers. Validated on a 48B parameter model with a 1.25x compute advantage.", who_built_it: "Kimi / Moonshot AI", category: "framework", tech_stack: ["transformer architecture", "residual networks", "48B MoE"], novelty_score: 9, novelty_verdict: "Genuinely New", novelty_reasoning: "This is a fundamental architectural contribution, not a product announcement. Replacing fixed residuals with learned cross-layer attention addresses a real dilution problem in deep networks.", hook: "Replacing fixed residual connections with learned attention over preceding layers — 1.25x compute advantage, under 2% latency overhead.", missing: "Open weights? Open source implementation? The report link exists but no code drop mentioned.", editorial_note: "One of the few posts this week that is actually research — everything else is a product wrapper." },
  { id: 5, date: "2025-03-01T10:04:00Z", project_name: "Cloudflare /crawl", one_liner: "One API call to crawl an entire website and get back clean HTML, Markdown, or JSON.", what_it_does: "Cloudflare added a /crawl endpoint that crawls an entire site with a single API call, no browser management or scripting required. Returns content in HTML, Markdown, or JSON format.", who_built_it: "CloudflareDev", category: "tool", tech_stack: ["Cloudflare", "web crawling", "API"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "Firecrawl and Jina already do this, but Cloudflare distributing it as a native endpoint changes the economics and reliability entirely — this is infrastructure at scale.", hook: "One API call. Entire site crawled. No scripts, no browser management.", missing: "Pricing model? Rate limits? This lands very differently if it is pay-per-crawl versus flat.", editorial_note: "Cloudflare keeps eating the middleware layer — smart and slightly ominous for every scraping startup out there." },
  { id: 6, date: "2025-03-01T10:05:00Z", project_name: "CashClaw", one_liner: "An open-source autonomous agent that finds work, does it, gets paid, and learns to earn more over time.", what_it_does: "CashClaw is an agent framework built on Moltlaunch infrastructure that autonomously finds paid work, delivers it, collects payment, reads feedback, and improves. Discovery, reputation, identity, and payments are handled natively by the platform.", who_built_it: "moltlaunch", category: "agent", tech_stack: ["Moltlaunch", "OpenClaw", "open source"], novelty_score: 8, novelty_verdict: "Genuinely New", novelty_reasoning: "A fully autonomous earn-and-learn loop for agents as an open-source framework is a concrete step toward economically independent agents. The platform handling identity and payments removes the hardest parts.", hook: "The agent finds work, gets paid, reads feedback, finds better tools, finds more work — autonomously.", missing: "What kinds of work does it actually find? Who is paying agents on Moltlaunch?", editorial_note: "If this ships as described, CashClaw is one of the more genuinely radical things in this list — autonomous economic agents with memory are not trivial." },
  { id: 7, date: "2025-03-01T10:06:00Z", project_name: "FlashCompact", one_liner: "A specialized model that compresses 200k token contexts down to 50k in about 1.5 seconds.", what_it_does: "FlashCompact is the first model purpose-built for context compaction. It processes 33,000 tokens per second and compresses a 200k token context to 50k in roughly 1.5 seconds.", who_built_it: "morphllm", category: "framework", tech_stack: ["context compaction", "LLM", "inference"], novelty_score: 9, novelty_verdict: "Genuinely New", novelty_reasoning: "A specialized model trained specifically for context compression rather than general summarization is architecturally novel. 33k tokens per second at this compression ratio is a meaningful technical achievement.", hook: "33,000 tokens per second — 200k context to 50k in 1.5 seconds. The first model built only for compaction.", missing: "What is the quality loss at that compression ratio? Is this lossy in a way that matters for downstream reasoning?", editorial_note: "Specialized models for infrastructure tasks is an underexplored direction — FlashCompact is doing something genuinely new in a space everyone needs." },
  { id: 8, date: "2025-03-01T10:07:00Z", project_name: "Unsloth Studio", one_liner: "An open-source web UI for training and running over 500 LLMs locally at 2x speed with 70% less VRAM.", what_it_does: "Unsloth Studio is an open-source interface for training and running language models locally on Mac, Windows, or Linux. It achieves 2x training speed with 70% less VRAM, supports GGUF, vision, audio, and embedding models, and auto-generates datasets from PDFs and CSVs.", who_built_it: "UnslothAI", category: "tool", tech_stack: ["open source", "LLM training", "GGUF", "local inference"], novelty_score: 8, novelty_verdict: "Genuinely New", novelty_reasoning: "Unsloth's efficiency gains are real and documented. A full web UI wrapping those gains with dataset generation and model comparison makes fine-tuning accessible to a completely new tier of users.", hook: "Train 500+ models at 2x speed with 70% less VRAM — open source, runs locally.", missing: "How does dataset quality from auto-generation from PDFs actually hold up? That is the hidden risk in the pipeline.", editorial_note: "Unsloth keeps shipping things that should have existed years ago — one of the more genuinely useful open source releases in recent months." },
  { id: 9, date: "2025-03-01T10:08:00Z", project_name: "Simile", one_liner: "A $100M-funded startup building the most accurate simulations of human behavior.", what_it_does: "Simile raised $100M from Index, Hanabi, and others including Karpathy, Fei-Fei Li, and Adam D'Angelo to tackle simulating human behavior — described as one of the most consequential and technically difficult problems of our time.", who_built_it: "joon_s_pk", category: "infra", tech_stack: ["human simulation", "AI"], novelty_score: 9, novelty_verdict: "Genuinely New", novelty_reasoning: "Accurate human behavior simulation at scale would fundamentally change product development, policy modeling, and social science. The backer caliber suggests this is real.", hook: "Simulating human behavior — one of the most consequential and technically difficult problems of our time.", missing: "What is the actual product or output? A simulator you query? An API? Nothing in the announcement describes what Simile ships.", editorial_note: "The backers list alone makes this worth watching — Karpathy and Fei-Fei betting together on something is not accidental." },
  { id: 10, date: "2025-03-01T10:09:00Z", project_name: "Claude Code Review", one_liner: "When a pull request opens, Claude automatically dispatches agents to review it for bugs.", what_it_does: "Anthropic added a Code Review feature to Claude Code that triggers automatically when a PR is opened. A team of agents scans the diff and hunts for bugs, posting findings as part of the review workflow.", who_built_it: "Anthropic", category: "agent", tech_stack: ["Claude", "GitHub", "agents"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "CodeRabbit and others have done automated PR review, but Claude doing it natively inside Claude Code with multi-agent dispatch is a meaningfully tighter integration.", hook: "When a PR opens, Claude dispatches a team of agents to hunt for bugs.", missing: "Does this require Claude Code on both sides? What is the pricing model per review?", editorial_note: "The right feature at the right moment — this is Claude Code becoming the default development environment, not just a coding assistant." },
  { id: 11, date: "2025-03-01T10:10:00Z", project_name: "Manus Desktop", one_liner: "Manus AI agent moved from the cloud to your local machine with direct access to your computer.", what_it_does: "Manus introduced My Computer, a desktop app feature that lets the Manus AI agent run locally on your machine rather than in the cloud. The agent gets direct access to local files and applications.", who_built_it: "ManusAI", category: "agent", tech_stack: ["desktop", "local AI", "agent"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "Local execution of a general-purpose agent is a meaningful privacy and latency improvement over cloud-only. The framing of putting AI inside your computer is a useful mental model shift.", hook: "Taking Manus out of the cloud and putting it on your desktop — your AI agent, now on your local machine.", missing: "What can it actually access locally? Full filesystem? Browser? The scope of local access defines usefulness.", editorial_note: "The privacy angle writes itself — Manus should be leading with that harder instead of the tech spec." },
  { id: 12, date: "2025-03-01T10:11:00Z", project_name: "Replit Agent 4", one_liner: "An AI built for creative collaboration between humans and agents with infinite canvas and parallel agent execution.", what_it_does: "Replit launched Agent 4, described as the first AI built for creative human-agent collaboration. Features include an infinite canvas for design, team collaboration, parallel agent execution, and shipping of full apps, sites, and slides.", who_built_it: "amasad / Replit", category: "agent", tech_stack: ["Replit", "agents", "canvas"], novelty_score: 7, novelty_verdict: "Solid Execution", novelty_reasoning: "The infinite canvas approach to software creation is genuinely new framing for Replit and feels distinct from the text-based vibe coding paradigm. Parallel agents within one project is a meaningful workflow change.", hook: "Software is not merely technical anymore — it is creative. The first AI built for creative collaboration between humans and agents.", missing: "What does parallel agents actually mean in practice? Can they conflict? How does the user manage diverging agent threads?", editorial_note: "Replit keeps repositioning itself right when the market moves — Agent 4 is their best framing yet." },
];

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

const VERDICT_CFG = {
  "Genuinely New":  { color: "#e63030", bg: "rgba(230,48,48,0.07)",  border: "rgba(230,48,48,0.2)"  },
  "Solid Execution":{ color: "#4a7fe8", bg: "rgba(74,127,232,0.07)", border: "rgba(74,127,232,0.2)" },
  "Repackaged":     { color: "#6b7a8d", bg: "rgba(107,122,141,0.07)",border: "rgba(107,122,141,0.2)"},
  "Vaporware":      { color: "#3a4455", bg: "rgba(58,68,85,0.1)",    border: "rgba(58,68,85,0.3)"  },
};
const CAT_CFG = {
  agent:"#e63030", tool:"#4a7fe8", app:"#8ab4f8",
  infra:"#6b7a8d", framework:"#9ab0c8", other:"#3a4455",
};
const VERDICTS = ["all","Genuinely New","Solid Execution","Repackaged","Vaporware"];

function Grain() {
  return (
    <svg style={{ position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:0.04 }}>
      <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#g)"/>
    </svg>
  );
}

function Beam() {
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0 }}>
      <div style={{ position:"absolute",top:"-30%",right:"-5%",width:2,height:"160%",background:"linear-gradient(180deg,transparent,rgba(230,48,48,0.5) 35%,rgba(230,48,48,0.5) 65%,transparent)",transform:"rotate(-32deg)",filter:"blur(0.5px)" }}/>
      <div style={{ position:"absolute",top:"-30%",right:"-2%",width:120,height:"160%",background:"linear-gradient(180deg,transparent,rgba(230,48,48,0.025) 35%,rgba(230,48,48,0.025) 65%,transparent)",transform:"rotate(-32deg)" }}/>
    </div>
  );
}

function NoveltyBar({ score }) {
  const c = score>=7?"#e63030":score>=4?"#4a7fe8":"#3a4455";
  return (
    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
      <div style={{ flex:1,height:2,background:"rgba(255,255,255,0.05)" }}>
        <div style={{ height:"100%",width:`${score*10}%`,background:c,transition:"width 0.8s ease" }}/>
      </div>
      <span style={{ fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.2)",minWidth:32,textAlign:"right" }}>{score}/10</span>
    </div>
  );
}

function Chip({ label, color, bg, border }) {
  return (
    <span style={{ padding:"2px 7px",fontSize:9,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.12em",color,background:bg,border:`1px solid ${border}` }}>
      {label}
    </span>
  );
}

function FeaturedCard({ entry }) {
  const vc = VERDICT_CFG[entry.novelty_verdict] || VERDICT_CFG["Solid Execution"];
  const cc = CAT_CFG[entry.category] || CAT_CFG.other;
  return (
    <div style={{ position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#0c1525 0%,#070b14 55%,#0a0508 100%)",border:"1px solid rgba(230,48,48,0.18)",padding:"32px 32px 28px" }}>
      <Beam/>
      <div style={{ position:"relative",zIndex:1 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:8 }}>
          <div style={{ display:"flex",gap:6 }}>
            <Chip label={entry.category} color={cc} bg={`${cc}12`} border={`${cc}30`}/>
            <Chip label={entry.novelty_verdict} color={vc.color} bg={vc.bg} border={vc.border}/>
          </div>
          <span style={{ fontFamily:"monospace",fontSize:9,color:"rgba(255,255,255,0.15)",letterSpacing:"0.15em" }}>
            {new Date(entry.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}).toUpperCase()}
          </span>
        </div>

        <h2 style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:"clamp(30px,5vw,52px)",fontWeight:400,color:"#fff",margin:"0 0 4px",letterSpacing:"0.04em",lineHeight:0.93,textTransform:"uppercase" }}>
          {entry.project_name}
        </h2>
        {entry.who_built_it && entry.who_built_it!=="Unknown" && (
          <div style={{ fontFamily:"monospace",fontSize:9,color:"rgba(255,255,255,0.2)",marginBottom:14,letterSpacing:"0.1em" }}>BY {entry.who_built_it.toUpperCase()}</div>
        )}
        <p style={{ color:"rgba(255,255,255,0.5)",fontSize:14,lineHeight:1.7,margin:"0 0 22px",fontFamily:"'Crimson Pro',Georgia,serif",maxWidth:560 }}>
          {entry.what_it_does}
        </p>

        <div style={{ margin:"20px 0",paddingLeft:18,borderLeft:"2px solid #e63030",position:"relative" }}>
          <p style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:"clamp(15px,2.2vw,20px)",color:"#fff",margin:0,letterSpacing:"0.05em",lineHeight:1.25,textTransform:"uppercase" }}>
            {entry.hook}
          </p>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:22,marginTop:22 }}>
          <div>
            <div style={{ fontFamily:"monospace",fontSize:8,color:"#e63030",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8 }}>Novelty</div>
            <NoveltyBar score={entry.novelty_score}/>
            <p style={{ color:"rgba(255,255,255,0.25)",fontSize:11,margin:"8px 0 0",lineHeight:1.5,fontFamily:"monospace" }}>{entry.novelty_reasoning}</p>
          </div>
          <div>
            <div style={{ fontFamily:"monospace",fontSize:8,color:"#4a7fe8",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8 }}>Stack</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
              {(entry.tech_stack||[]).map(t=>(
                <span key={t} style={{ fontFamily:"monospace",fontSize:9,color:"rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.03)",padding:"2px 6px",border:"1px solid rgba(255,255,255,0.06)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:18,marginTop:18,display:"grid",gridTemplateColumns:"1fr 1fr",gap:22 }}>
          <div>
            <div style={{ fontFamily:"monospace",fontSize:8,color:"rgba(255,255,255,0.15)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:5 }}>What is missing</div>
            <p style={{ color:"rgba(255,255,255,0.25)",fontSize:11,margin:0,lineHeight:1.6,fontFamily:"monospace" }}>{entry.missing}</p>
          </div>
          <div>
            <div style={{ fontFamily:"monospace",fontSize:8,color:"rgba(255,255,255,0.15)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:5 }}>Editorial</div>
            <p style={{ color:"rgba(255,255,255,0.3)",fontSize:12,margin:0,lineHeight:1.6,fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic" }}>{entry.editorial_note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListCard({ entry, onClick }) {
  const vc = VERDICT_CFG[entry.novelty_verdict] || VERDICT_CFG["Solid Execution"];
  const cc = CAT_CFG[entry.category] || CAT_CFG.other;
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.04)",cursor:"pointer",background:hov?"rgba(230,48,48,0.03)":"transparent",transition:"background 0.12s",display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"start" }}>
      <div>
        <div style={{ display:"flex",gap:5,marginBottom:5 }}>
          <Chip label={entry.category} color={cc} bg={`${cc}12`} border={`${cc}25`}/>
          <Chip label={entry.novelty_verdict} color={vc.color} bg={vc.bg} border={vc.border}/>
        </div>
        <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:19,color:hov?"#fff":"rgba(255,255,255,0.8)",letterSpacing:"0.04em",textTransform:"uppercase",lineHeight:1,marginBottom:3,transition:"color 0.12s" }}>
          {entry.project_name}
        </div>
        <div style={{ fontFamily:"monospace",fontSize:9,color:"rgba(255,255,255,0.2)",lineHeight:1.5 }}>{entry.one_liner}</div>
      </div>
      <div style={{ textAlign:"right",paddingTop:2 }}>
        <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:20,color:entry.novelty_score>=7?"#e63030":"rgba(255,255,255,0.15)" }}>{entry.novelty_score}</div>
        <div style={{ fontFamily:"monospace",fontSize:7,color:"rgba(255,255,255,0.1)",letterSpacing:"0.1em" }}>/10</div>
      </div>
    </div>
  );
}

function Stats({ entries }) {
  const avg = entries.length?(entries.reduce((s,e)=>s+(e.novelty_score||0),0)/entries.length).toFixed(1):0;
  const gn = entries.filter(e=>e.novelty_verdict==="Genuinely New").length;
  const vp = entries.filter(e=>e.novelty_verdict==="Vaporware").length;
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"1px solid rgba(255,255,255,0.05)",marginBottom:36 }}>
      {[["PROFILED",entries.length,"#e63030"],["AVG NOVELTY",avg,"rgba(255,255,255,0.35)"],["GENUINE",gn,"#4a7fe8"],["VAPOR",vp,"rgba(255,255,255,0.12)"]].map(([l,v,c])=>(
        <div key={l} style={{ padding:"18px 0",textAlign:"center",borderRight:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:34,color:c,letterSpacing:"0.04em",lineHeight:1 }}>{v}</div>
          <div style={{ fontFamily:"monospace",fontSize:8,color:"rgba(255,255,255,0.15)",letterSpacing:"0.2em",marginTop:4 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState("digest");
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [featured, setFeatured] = useState(null);
  const [apiKey, setApiKey] = useState(()=>localStorage.getItem("intro-key")||"");
  const [showKey, setShowKey] = useState(false);
  const keyRef = useRef();

  useEffect(()=>{ boot(); },[]);

  async function boot() {
    const s = await loadFromStorage();
    if(s&&s.length>0){setEntries(s);setFeatured(s[0]);}
    else{setEntries(SEED);setFeatured(SEED[0]);await saveToStorage(SEED);}
  }

  async function addEntry(entry) {
    const updated=[entry,...entries];
    setEntries(updated);setFeatured(entry);
    await saveToStorage(updated);
  }

  function saveKey(){
    const k=keyRef.current?.value?.trim()||"";
    setApiKey(k);localStorage.setItem("intro-key",k);setShowKey(false);
  }

  async function analyze() {
    if(!input.trim()||loading)return;
    if(!apiKey){setShowKey(true);return;}
    setLoading(true);setError(null);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM_PROMPT,messages:[{role:"user",content:`Analyze this launch post:\n\n${input}`}]}),
      });
      const data=await res.json();
      const block=(data.content||[]).find(b=>b.type==="text");
      if(!block)throw new Error("no response");
      const parsed=JSON.parse(block.text.replace(/```json|```/g,"").trim());
      await addEntry({...parsed,id:Date.now(),date:new Date().toISOString()});
      setInput("");setView("digest");
    } catch{setError("Could not parse that post. Try pasting more of the original text.");}
    setLoading(false);
  }

  const filtered=filter==="all"?entries:entries.filter(e=>e.novelty_verdict===filter);

  return (
    <div style={{ minHeight:"100vh",background:"#050810",color:"#fff",fontFamily:"system-ui,sans-serif",position:"relative" }}>
      <Grain/>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,400;1,400&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}@keyframes pulse{0%,100%{opacity:.15}50%{opacity:.8}}.pulse{animation:pulse 2s ease-in-out infinite}textarea:focus{outline:none}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(230,48,48,0.25)}`}</style>

      {/* HEADER */}
      <header style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,8,16,0.96)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"0 24px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:20,letterSpacing:"0.1em",color:"#fff",display:"flex",alignItems:"center",gap:8 }}>
            INTRODUCING
            <svg width="20" height="2" viewBox="0 0 20 2"><line x1="0" y1="1" x2="20" y2="1" stroke="url(#lr)" strokeWidth="2"/><defs><linearGradient id="lr"><stop offset="0%" stopColor="#e63030"/><stop offset="100%" stopColor="transparent"/></linearGradient></defs></svg>
          </div>
          <span style={{ fontFamily:"monospace",fontSize:8,color:"rgba(255,255,255,0.12)",letterSpacing:"0.2em" }}>{entries.length} PROFILED</span>
        </div>
        <div style={{ display:"flex",gap:1,alignItems:"center" }}>
          {["digest","archive","analyze"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{ background:"none",border:"none",color:view===v?"#fff":"rgba(255,255,255,0.2)",padding:"4px 12px",cursor:"pointer",fontFamily:"monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.15em",borderBottom:view===v?"1px solid #e63030":"1px solid transparent",transition:"color 0.15s" }}>{v}</button>
          ))}
          <button onClick={()=>setShowKey(!showKey)} style={{ background:"none",border:"none",cursor:"pointer",color:apiKey?"#e63030":"rgba(255,255,255,0.12)",fontFamily:"monospace",fontSize:9,letterSpacing:"0.15em",padding:"4px 8px",marginLeft:8 }}>
            {apiKey?"● KEY":"○ KEY"}
          </button>
        </div>
      </header>

      {/* KEY MODAL */}
      {showKey&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200 }}>
          <div style={{ background:"#0c1420",border:"1px solid rgba(230,48,48,0.2)",padding:28,width:420,maxWidth:"90vw" }}>
            <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:18,letterSpacing:"0.1em",marginBottom:8 }}>ANTHROPIC API KEY</div>
            <p style={{ fontFamily:"monospace",fontSize:10,color:"rgba(255,255,255,0.25)",lineHeight:1.6,marginBottom:16 }}>Stored in your browser only. Used to call Claude directly.<br/>Get a key at console.anthropic.com</p>
            <input ref={keyRef} type="password" defaultValue={apiKey} placeholder="sk-ant-..." style={{ width:"100%",background:"#050810",border:"1px solid rgba(255,255,255,0.08)",color:"#fff",padding:"10px 12px",fontFamily:"monospace",fontSize:12,marginBottom:12 }}/>
            <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
              <button onClick={()=>setShowKey(false)} style={{ background:"none",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.3)",padding:"7px 16px",cursor:"pointer",fontFamily:"monospace",fontSize:9,letterSpacing:"0.1em" }}>CANCEL</button>
              <button onClick={saveKey} style={{ background:"#e63030",border:"none",color:"#fff",padding:"7px 20px",cursor:"pointer",fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:14,letterSpacing:"0.1em" }}>SAVE</button>
            </div>
          </div>
        </div>
      )}

      <main style={{ maxWidth:860,margin:"0 auto",padding:"36px 20px",position:"relative",zIndex:1 }}>

        {/* DIGEST */}
        {view==="digest"&&(
          <div>
            <div style={{ marginBottom:36,paddingBottom:28,borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily:"monospace",fontSize:8,color:"rgba(230,48,48,0.5)",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:10 }}>introducing.life</div>
              <h1 style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:"clamp(52px,9vw,96px)",fontWeight:400,lineHeight:0.88,letterSpacing:"0.02em",color:"#fff",textTransform:"uppercase" }}>
                The Agentic<br/>
                <span style={{ color:"#e63030" }}>Internet</span><br/>
                Profiled.
              </h1>
            </div>
            <Stats entries={entries}/>
            {featured&&(
              <>
                <div style={{ fontFamily:"monospace",fontSize:8,color:"rgba(255,255,255,0.15)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12 }}>— Featured Entry</div>
                <FeaturedCard entry={featured}/>
              </>
            )}
          </div>
        )}

        {/* ARCHIVE */}
        {view==="archive"&&(
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:40,letterSpacing:"0.06em",marginBottom:20,color:"#fff" }}>ARCHIVE</h2>
            <div style={{ display:"flex",gap:4,marginBottom:20,flexWrap:"wrap" }}>
              {VERDICTS.map(v=>{
                const count=v==="all"?entries.length:entries.filter(e=>e.novelty_verdict===v).length;
                const active=filter===v;
                const cfg=v==="all"?{color:"#fff",border:"rgba(255,255,255,0.15)"}:VERDICT_CFG[v];
                return(
                  <button key={v} onClick={()=>setFilter(v)} style={{ background:active?"rgba(230,48,48,0.07)":"transparent",border:`1px solid ${active?"#e63030":"rgba(255,255,255,0.08)"}`,color:active?(cfg.color||"#fff"):"rgba(255,255,255,0.2)",padding:"4px 12px",cursor:"pointer",fontFamily:"monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.12em",transition:"all 0.12s" }}>
                    {v} <span style={{ opacity:0.4 }}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ border:"1px solid rgba(255,255,255,0.05)" }}>
              {filtered.map(e=><ListCard key={e.id} entry={e} onClick={()=>{setFeatured(e);setView("digest");}}/>)}
            </div>
          </div>
        )}

        {/* ANALYZE */}
        {view==="analyze"&&(
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:40,letterSpacing:"0.06em",marginBottom:6,color:"#fff" }}>PROFILE A LAUNCH</h2>
            <p style={{ fontFamily:"monospace",fontSize:9,color:"rgba(255,255,255,0.18)",marginBottom:24,letterSpacing:"0.1em" }}>
              Paste any post from X, GitHub, or Product Hunt
            </p>
            {!apiKey&&(
              <div style={{ marginBottom:16,padding:14,background:"rgba(230,48,48,0.05)",border:"1px solid rgba(230,48,48,0.15)",fontFamily:"monospace",fontSize:10,color:"rgba(230,48,48,0.6)",letterSpacing:"0.08em" }}>
                Set your Anthropic API key first — click ○ KEY in the header.
              </div>
            )}
            <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Introducing something that will change everything..." style={{ width:"100%",minHeight:160,background:"#0a0f1a",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.75)",padding:16,fontSize:14,lineHeight:1.7,fontFamily:"'Crimson Pro',Georgia,serif",display:"block",marginBottom:12 }}/>
            {error&&<div style={{ marginBottom:14,padding:12,background:"rgba(230,48,48,0.05)",border:"1px solid rgba(230,48,48,0.15)",fontFamily:"monospace",fontSize:10,color:"rgba(230,48,48,0.6)" }}>{error}</div>}
            <div style={{ display:"flex",justifyContent:"flex-end" }}>
              {loading
                ? <div className="pulse" style={{ fontFamily:"monospace",fontSize:9,color:"rgba(255,255,255,0.2)",letterSpacing:"0.2em",padding:"10px 0" }}>READING THE LAUNCH...</div>
                : <button onClick={analyze} disabled={!input.trim()} style={{ background:input.trim()?"#e63030":"rgba(255,255,255,0.04)",border:"none",color:input.trim()?"#fff":"rgba(255,255,255,0.12)",padding:"10px 28px",cursor:input.trim()?"pointer":"not-allowed",fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:16,letterSpacing:"0.1em",transition:"background 0.15s" }}>PROFILE IT</button>
              }
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.03)",padding:"18px 24px",marginTop:60,display:"flex",justifyContent:"space-between" }}>
        <span style={{ fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:12,color:"rgba(255,255,255,0.06)",letterSpacing:"0.1em" }}>INTRODUCING.LIFE</span>
        <span style={{ fontFamily:"monospace",fontSize:8,color:"rgba(255,255,255,0.06)",letterSpacing:"0.15em" }}>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
