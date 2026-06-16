import { useState, useEffect, useRef, useCallback } from "react";

const NEWS = [
  { id:1, title:"AI Breakthrough Transforms Healthcare Worldwide", desc:"New AI algorithm detects diseases earlier than ever before, promising revolutionary impact on medical diagnosis and treatment outcomes across 40+ countries.", image:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&h=400&fit=crop", source:"TechNews Daily", time:"2h ago", cat:"technology", trending:true, reads:"124K" },
  { id:2, title:"Global Economy Shows Strongest Recovery in a Decade", desc:"International markets surge with optimism as major economies report better-than-expected growth figures and job creation at record highs.", image:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&h=400&fit=crop", source:"Business Times", time:"4h ago", cat:"business", trending:true, reads:"89K" },
  { id:3, title:"World Leaders Reach Landmark Climate Agreement", desc:"Nations commit to cutting carbon emissions by 50% by 2030 in a groundbreaking international climate accord after weeks of intense negotiations.", image:"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&h=400&fit=crop", source:"World Report", time:"5h ago", cat:"general", reads:"201K" },
  { id:4, title:"Underdog Team Claims Dramatic Championship Win", desc:"In a stunning upset, the team defeats defending champions in overtime to claim the title against all odds, sending fans into wild celebrations.", image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&h=400&fit=crop", source:"Sports Today", time:"3h ago", cat:"sports", trending:true, reads:"310K" },
  { id:5, title:"Blockbuster Film Shatters All-Time Box Office Records", desc:"Highly anticipated superhero film becomes fastest movie to surpass $1 billion, breaking opening weekend records in 52 countries simultaneously.", image:"https://images.unsplash.com/photo-1489599849228-bed96d3a4c4e?w=700&h=400&fit=crop", source:"Entertainment Weekly", time:"1d ago", cat:"entertainment", reads:"455K" },
  { id:6, title:"New Cancer Immunotherapy Shows 90% Success Rate", desc:"Clinical trials reveal remarkable 90% success rate for new immunotherapy treatment targeting the most aggressive forms of cancer in patients.", image:"https://images.unsplash.com/photo-1576091160550-112173e7f9db?w=700&h=400&fit=crop", source:"Health News", time:"6h ago", cat:"health", reads:"78K" },
  { id:7, title:"Astronomers Detect Mysterious Signal from Deep Space", desc:"Scientists detect an unusual repeating radio signal from a nearby galaxy, sparking intense debate about its possible extraterrestrial origins.", image:"https://images.unsplash.com/photo-1462331940975-31f4ec4b04e7?w=700&h=400&fit=crop", source:"Science Focus", time:"8h ago", cat:"science", reads:"142K" },
  { id:8, title:"Revolutionary Foldable Device Unveiled at Tech Summit", desc:"Tech giant unveils next-generation foldable device with week-long battery life, set to completely redefine mobile computing as we know it.", image:"https://images.unsplash.com/photo-1556656793-08538906a9f8?w=700&h=400&fit=crop", source:"TechNews Daily", time:"12h ago", cat:"technology", reads:"196K" },
  { id:9, title:"Scientists Grow Human Organ in Lab for First Time", desc:"Researchers successfully grow a functional human kidney in a lab setting, marking a watershed moment for transplant medicine and organ shortages.", image:"https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=700&h=400&fit=crop", source:"Health News", time:"7h ago", cat:"health", reads:"88K" },
  { id:10, title:"Electric Vehicles Overtake Gas Cars Across Europe", desc:"For the first time in history, EV sales surpass traditional combustion engine sales across all major European markets in a landmark shift.", image:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=700&h=400&fit=crop", source:"Business Times", time:"9h ago", cat:"business", reads:"167K" },
];

const CATS = [
  { id:"all", label:"All", icon:"🌐" },
  { id:"general", label:"World", icon:"🌍" },
  { id:"business", label:"Business", icon:"💼" },
  { id:"technology", label:"Tech", icon:"💻" },
  { id:"sports", label:"Sports", icon:"⚽" },
  { id:"entertainment", label:"Film", icon:"🎬" },
  { id:"health", label:"Health", icon:"❤️" },
  { id:"science", label:"Science", icon:"🔬" },
];

const COUNTRIES = [
  { flag:"🇺🇸", name:"United States", code:"US" },
  { flag:"🇬🇧", name:"United Kingdom", code:"GB" },
  { flag:"🇮🇳", name:"India", code:"IN" },
  { flag:"🇨🇦", name:"Canada", code:"CA" },
  { flag:"🇦🇺", name:"Australia", code:"AU" },
  { flag:"🇩🇪", name:"Germany", code:"DE" },
];

const SHARE_PLATFORMS = [
  { icon:"💬", name:"WhatsApp", color:"#25D366" },
  { icon:"𝕏", name:"Twitter", color:"#000000" },
  { icon:"📘", name:"Facebook", color:"#1877F2" },
  { icon:"✉️", name:"Email", color:"#EA4335" },
];

function useTheme(dark) {
  return {
    bg: dark ? "#060d1a" : "#f0f4f8",
    surface: dark ? "#0f1f35" : "#ffffff",
    card: dark ? "#101e30" : "#ffffff",
    header: dark ? "rgba(6,13,26,0.93)" : "rgba(255,255,255,0.93)",
    text: dark ? "#e8f0fe" : "#0d1b2a",
    sub: dark ? "#6b82a0" : "#64748b",
    border: dark ? "#1e3048" : "#e2e8f0",
    accent: "#f97316",
    pill: dark ? "#1a2d44" : "#f1f5f9",
    pillText: dark ? "#94a3b8" : "#475569",
  };
}

function IconBtn({ children, onClick, T, active, title, style={} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ width:36, height:36, borderRadius:9, border:`1px solid ${active||hov?T.accent:T.border}`, background:active?`${T.accent}18`:hov?T.pill:"transparent", color:active?T.accent:T.text, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, cursor:"pointer", transition:"all 0.18s", fontFamily:"inherit", ...style }}>
      {children}
    </button>
  );
}

function Highlight({ text, query, color }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return <>{parts.map((p,i) => p.toLowerCase()===query.toLowerCase() ? <mark key={i} style={{ background:`${color}33`, color, borderRadius:2, padding:"0 1px" }}>{p}</mark> : p)}</>;
}

function NewsCard({ article, T, dark, view, expanded, onExpand, isBookmarked, onBookmark, isLiked, onLike, shareOpen, onShareToggle, onShare, search, idx }) {
  const [hov, setHov] = useState(false);
  const [imgOk, setImgOk] = useState(false);
  const isList = view === "list";
  return (
    <article onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:T.card, borderRadius:14, overflow:"hidden", border:`1px solid ${hov?T.accent+"66":T.border}`, boxShadow:hov?(dark?"0 20px 48px rgba(0,0,0,0.55)":"0 12px 36px rgba(0,0,0,0.13)"):(dark?"0 2px 8px rgba(0,0,0,0.35)":"0 1px 4px rgba(0,0,0,0.07)"), transform:hov?"translateY(-4px)":"translateY(0)", transition:"all 0.25s ease", display:isList?"flex":"block", animation:`fadeUp 0.4s ease ${Math.min(idx*50,300)}ms both` }}>
      <div style={{ position:"relative", flexShrink:0, width:isList?200:"100%", paddingTop:isList?0:"56%", minHeight:isList?148:0, overflow:"hidden", background:T.border }}>
        {!imgOk && <div style={{ position:"absolute", inset:0, background:dark?"#1e3048":"#e2e8f0", animation:"pulse 1.2s infinite" }} />}
        <img src={article.image} alt={article.title} onLoad={()=>setImgOk(true)}
          style={{ position:isList?"relative":"absolute", top:0, left:0, width:"100%", height:isList?148:"100%", objectFit:"cover", display:"block", transform:hov?"scale(1.06)":"scale(1)", transition:"transform 0.4s ease", opacity:imgOk?1:0 }} />
        <span style={{ position:"absolute", top:8, left:8, background:`${T.accent}ee`, color:"#fff", padding:"3px 8px", borderRadius:5, fontSize:10, fontWeight:700, textTransform:"uppercase" }}>{article.cat}</span>
        {article.trending && <span style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.65)", color:"#fbbf24", padding:"3px 8px", borderRadius:5, fontSize:10, fontWeight:700 }}>🔥 HOT</span>}
      </div>
      <div style={{ padding:14, display:"flex", flexDirection:"column", flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
          <span style={{ fontSize:11, fontWeight:700, color:T.accent, background:`${T.accent}15`, padding:"2px 8px", borderRadius:4 }}>{article.source}</span>
          <span style={{ fontSize:11, color:T.sub }}>🕐 {article.time}</span>
        </div>
        <h3 onClick={onExpand} style={{ fontSize:14.5, fontWeight:700, lineHeight:1.35, color:T.text, marginBottom:7, display:"-webkit-box", WebkitLineClamp:expanded?99:2, WebkitBoxOrient:"vertical", overflow:"hidden", cursor:"pointer" }}>
          <Highlight text={article.title} query={search} color={T.accent} />
        </h3>
        <div style={{ maxHeight:expanded?160:0, overflow:"hidden", transition:"max-height 0.35s ease" }}>
          <p style={{ fontSize:12.5, color:T.sub, lineHeight:1.55, marginBottom:10 }}>
            <Highlight text={article.desc} query={search} color={T.accent} />
          </p>
        </div>
        <button onClick={onExpand} style={{ alignSelf:"flex-start", background:"none", border:"none", color:T.accent, fontSize:11, fontWeight:700, padding:0, marginBottom:8, cursor:"pointer" }}>
          {expanded ? "▲ Less" : "▼ More"}
        </button>
        <div style={{ display:"flex", gap:10, fontSize:11, color:T.sub, marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${T.border}` }}>
          <span>👁 {article.reads}</span>
          {isBookmarked && <span style={{ color:T.accent, fontWeight:700, marginLeft:"auto" }}>Saved ⭐</span>}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <button style={{ flex:1, padding:"9px 10px", background:"linear-gradient(135deg,#f97316,#ef4444)", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:12, cursor:"pointer", boxShadow:"0 4px 12px rgba(249,115,22,0.35)" }}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            Read Full →
          </button>
          <button onClick={onLike} style={{ width:34, height:34, border:`1px solid ${isLiked?"#ef4444":"rgba(239,68,68,0.3)"}`, background:isLiked?"rgba(239,68,68,0.12)":"transparent", borderRadius:8, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s" }}>
            {isLiked?"❤️":"🤍"}
          </button>
          <div style={{ position:"relative" }} onClick={e=>e.stopPropagation()}>
            <IconBtn onClick={onShareToggle} T={T} active={shareOpen} title="Share">📤</IconBtn>
            {shareOpen && (
              <div style={{ position:"absolute", bottom:"calc(100% + 8px)", right:0, background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:8, display:"flex", gap:6, zIndex:200, boxShadow:"0 12px 36px rgba(0,0,0,0.22)", animation:"scaleIn 0.2s ease" }}>
                {SHARE_PLATFORMS.map(p=>(
                  <button key={p.name} onClick={()=>onShare(p.name)} title={p.name}
                    style={{ width:34, height:34, borderRadius:8, background:dark?"#0f172a":"#f8fafc", border:`1px solid ${T.border}`, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontWeight:700, color:T.text, transition:"all 0.18s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.background=p.color; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="scale(1.15)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background=dark?"#0f172a":"#f8fafc"; e.currentTarget.style.color=T.text; e.currentTarget.style.transform="scale(1)"; }}>
                    {p.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={onBookmark} style={{ width:34, height:34, border:`1px solid ${isBookmarked?T.accent:T.border}`, background:isBookmarked?`${T.accent}15`:"transparent", borderRadius:8, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.22s", color:isBookmarked?T.accent:T.sub }}>
            {isBookmarked?"⭐":"☆"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [cat, setCat] = useState("all");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [shareId, setShareId] = useState(null);
  const [showCountry, setShowCountry] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [view, setView] = useState("grid");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const T = useTheme(dark);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFeaturedIdx(i => (i + 1) % 3), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  const showToast = useCallback((msg, emoji="✅") => {
    setToast({ msg, emoji });
    setTimeout(() => setToast(null), 2200);
  }, []);

  const simulateLoad = (fn) => { setLoading(true); setTimeout(() => { fn(); setLoading(false); }, 550); };
  const handleCat = (id) => simulateLoad(() => setCat(id));
  const handleCountry = (c) => { setCountry(c); setShowCountry(false); showToast(`Showing news from ${c.name}`, c.flag); };
  const handleShare = (pl) => { setShareId(null); showToast(`Opening ${pl}…`, "🚀"); };

  const toggleBookmark = (id) => {
    const has = bookmarks.includes(id);
    setBookmarks(p => has ? p.filter(b => b !== id) : [...p, id]);
    showToast(has ? "Bookmark removed" : "Article saved!", has ? "🗑️" : "⭐");
  };

  const toggleLike = (id) => {
    const has = likedIds.includes(id);
    setLikedIds(p => has ? p.filter(l => l !== id) : [...p, id]);
    if (!has) showToast("Liked!", "❤️");
  };

  const filtered = NEWS.filter(a => {
    const matchCat = cat === "all" || a.cat === cat;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = NEWS[featuredIdx];
  const trending = NEWS.filter(n => n.trending);

  return (
    <div onClick={() => { setShowCountry(false); setShareId(null); }}
      style={{ background:T.bg, color:T.text, minHeight:"100vh", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", transition:"background 0.4s,color 0.4s", overflowX:"hidden", position:"relative" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes ticker { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:#f97316;border-radius:4px;}
        input{outline:none;font-family:inherit;}
        button{cursor:pointer;outline:none;font-family:inherit;}
      `}</style>

      {toast && (
        <div style={{ position:"fixed", top:74, left:"50%", transform:"translateX(-50%)", zIndex:9999, background:dark?"#1e3048":"#0f172a", color:"#fff", padding:"10px 20px", borderRadius:999, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", animation:"scaleIn 0.2s ease", whiteSpace:"nowrap" }}>
          <span style={{fontSize:16}}>{toast.emoji}</span>{toast.msg}
        </div>
      )}

      <header style={{ position:"sticky", top:0, zIndex:500, background:T.header, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}`, boxShadow:dark?"0 4px 24px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, height:60 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
              <span style={{ fontSize:28, lineHeight:1, filter:dark?"drop-shadow(0 0 8px rgba(249,115,22,0.55))":"none" }}>🌍</span>
              <div>
                <div style={{ fontWeight:800, fontSize:17, background:"linear-gradient(90deg,#f97316,#ef4444)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.1 }}>WorldWire</div>
                <div style={{ fontSize:9, color:T.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Real-Time World News</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {bookmarks.length > 0 && (
                <div style={{ background:"linear-gradient(135deg,#f97316,#ef4444)", color:"#fff", borderRadius:999, padding:"4px 10px", fontSize:11, fontWeight:700 }}>⭐ {bookmarks.length}</div>
              )}
              <IconBtn onClick={e=>{ e.stopPropagation(); setShowSearch(s=>!s); }} T={T} active={showSearch} title="Search">{showSearch?"✕":"🔍"}</IconBtn>
              <IconBtn onClick={()=>setView(v=>v==="grid"?"list":"grid")} T={T} title="Toggle layout">{view==="grid"?"▤":"⊟"}</IconBtn>
              <div style={{ position:"relative" }} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>setShowCountry(s=>!s)}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"0 10px", height:36, border:`1px solid ${showCountry?T.accent:T.border}`, borderRadius:9, background:showCountry?`${T.accent}15`:"transparent", color:T.text, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.18s" }}>
                  {country.flag} <span style={{ fontSize:11, color:T.sub }}>{country.code} ▾</span>
                </button>
                {showCountry && (
                  <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden", zIndex:600, minWidth:180, boxShadow:"0 16px 48px rgba(0,0,0,0.22)", animation:"scaleIn 0.2s ease" }}>
                    {COUNTRIES.map(c=>(
                      <button key={c.code} onClick={()=>handleCountry(c)}
                        style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", background:country.code===c.code?`${T.accent}18`:"transparent", color:country.code===c.code?T.accent:T.text, border:"none", textAlign:"left", fontSize:13, fontWeight:country.code===c.code?700:400, cursor:"pointer" }}>
                        <span style={{fontSize:18}}>{c.flag}</span>{c.name}
                        {country.code===c.code && <span style={{marginLeft:"auto",fontSize:12}}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <IconBtn onClick={()=>setDark(d=>!d)} T={T} title="Toggle theme" style={{fontSize:18}}>{dark?"☀️":"🌙"}</IconBtn>
            </div>
          </div>

          {showSearch && (
            <div style={{ paddingBottom:12, animation:"fadeUp 0.2s ease" }} onClick={e=>e.stopPropagation()}>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:T.sub, pointerEvents:"none" }}>🔍</span>
                <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search headlines, topics, sources…"
                  style={{ width:"100%", padding:"10px 36px 10px 36px", border:`1.5px solid ${T.border}`, borderRadius:10, background:dark?"rgba(255,255,255,0.05)":"#f8fafc", color:T.text, fontSize:14 }}
                  onFocus={e=>{ e.target.style.borderColor="#f97316"; e.target.style.boxShadow="0 0 0 3px rgba(249,115,22,0.15)"; }}
                  onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.boxShadow="none"; }} />
                {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:T.sub, fontSize:14, padding:4, cursor:"pointer" }}>✕</button>}
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:12, paddingTop:4 }}>
            {CATS.map(c => {
              const count = c.id==="all" ? NEWS.length : NEWS.filter(n=>n.cat===c.id).length;
              const active = cat===c.id;
              return (
                <button key={c.id} onClick={()=>handleCat(c.id)}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:999, border:`1.5px solid ${active?T.accent:T.border}`, background:active?"linear-gradient(135deg,#f97316,#ef4444)":T.pill, color:active?"#fff":T.pillText, whiteSpace:"nowrap", fontSize:12
