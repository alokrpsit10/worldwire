import { useState, useEffect, useRef, useCallback } from "react";
import NewsCard, { timeAgo } from "./NewsCard";

const CATS = [
  { id:"general",       label:"World",     icon:"🌍" },
  { id:"business",      label:"Business",  icon:"💼" },
  { id:"technology",    label:"Tech",      icon:"💻" },
  { id:"sports",        label:"Sports",    icon:"⚽" },
  { id:"entertainment", label:"Film",      icon:"🎬" },
  { id:"health",        label:"Health",    icon:"❤️" },
  { id:"science",       label:"Science",   icon:"🔬" },
];

const COUNTRIES = [
  { flag:"🇺🇸", name:"United States", code:"us" },
  { flag:"🇬🇧", name:"United Kingdom", code:"gb" },
  { flag:"🇮🇳", name:"India",          code:"in" },
  { flag:"🇨🇦", name:"Canada",         code:"ca" },
  { flag:"🇦🇺", name:"Australia",      code:"au" },
  { flag:"🇩🇪", name:"Germany",        code:"de" },
];

function getTheme(dark) {
  return {
    bg:       dark ? "#060d1a"            : "#f0f4f8",
    surface:  dark ? "#0f1f35"            : "#ffffff",
    card:     dark ? "#101e30"            : "#ffffff",
    header:   dark ? "rgba(6,13,26,0.93)" : "rgba(255,255,255,0.93)",
    text:     dark ? "#e8f0fe"            : "#0d1b2a",
    sub:      dark ? "#6b82a0"            : "#64748b",
    border:   dark ? "#1e3048"            : "#e2e8f0",
    accent:   "#f97316",
    pill:     dark ? "#1a2d44"            : "#f1f5f9",
    pillText: dark ? "#94a3b8"            : "#475569",
  };
}

export default function App() {
  var [dark, setDark] = useState(false);
  var [cat, setCat] = useState("general");
  var [country, setCountry] = useState(COUNTRIES[0]);
  var [searchInput, setSearchInput] = useState("");
  var [search, setSearch] = useState("");
  var [articles, setArticles] = useState([]);
  var [bookmarks, setBookmarks] = useState([]);
  var [likes, setLikes] = useState([]);
  var [shareId, setShareId] = useState(null);
  var [showCountry, setShowCountry] = useState(false);
  var [tickerIdx, setTickerIdx] = useState(0);
  var [toast, setToast] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [expandedId, setExpandedId] = useState(null);
  var [view, setView] = useState("grid");
  var [showSearch, setShowSearch] = useState(false);
  var searchRef = useRef(null);
  var T = getTheme(dark);

  var fetchNews = useCallback(function() {
    setLoading(true);
    setError(null);
    var url = search
      ? "/api/news?search=" + encodeURIComponent(search)
      : "/api/news?category=" + cat + "&country=" + country.code;
    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.status === "ok") {
          setArticles(data.articles.filter(function(a) { return a.title && a.title !== "[Removed]"; }));
        } else {
          setError(data.message || "Failed to load news.");
        }
        setLoading(false);
      })
      .catch(function() {
        setError("Network error. Please check your connection.");
        setLoading(false);
      });
  }, [cat, country, search]);

  useEffect(function() { fetchNews(); }, [fetchNews]);

  useEffect(function() {
    if (articles.length === 0) return;
    var t = setInterval(function() {
      setTickerIdx(function(i) { return (i + 1) % Math.min(3, articles.length); });
    }, 4000);
    return function() { clearInterval(t); };
  }, [articles]);

  useEffect(function() {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  var showToast = useCallback(function(msg, emoji) {
    setToast({ msg: msg, emoji: emoji || "✅" });
    setTimeout(function() { setToast(null); }, 2200);
  }, []);

  function handleShare(platform, article) {
    var u = encodeURIComponent(article.url);
    var t = encodeURIComponent(article.title);
    var urls = { WhatsApp:"https://wa.me/?text="+t+"%20"+u, Twitter:"https://twitter.com/intent/tweet?text="+t+"&url="+u, Facebook:"https://www.facebook.com/sharer/sharer.php?u="+u, Email:"mailto:?subject="+t+"&body="+u };
    if (urls[platform]) window.open(urls[platform], "_blank");
    setShareId(null);
    showToast("Sharing on " + platform, "🚀");
  }

  function toggleBookmark(id) {
    var has = bookmarks.includes(id);
    setBookmarks(function(p) { return has ? p.filter(function(b) { return b !== id; }) : p.concat([id]); });
    showToast(has ? "Bookmark removed" : "Article saved!", has ? "🗑️" : "⭐");
  }

  function toggleLike(id) {
    var has = likes.includes(id);
    setLikes(function(p) { return has ? p.filter(function(l) { return l !== id; }) : p.concat([id]); });
    if (!has) showToast("Liked!", "❤️");
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
  }

  var featured = articles[0];
  var rest = search ? articles : articles.slice(1);

  return (
    <div onClick={function() { setShowCountry(false); setShareId(null); }}
      style={{ background:T.bg, color:T.text, minHeight:"100vh", fontFamily:"'Inter',-apple-system,sans-serif", transition:"background 0.4s,color 0.4s", overflowX:"hidden" }}
    >
      <style>{"\n@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}\n@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}\n@keyframes ticker{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}\n@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}\n@keyframes spin{to{transform:rotate(360deg)}}\n*{box-sizing:border-box;margin:0;padding:0;}\n::-webkit-scrollbar{width:3px;height:3px;}\n::-webkit-scrollbar-thumb{background:#f97316;border-radius:4px;}\ninput,button{font-family:inherit;}\n"}</style>

      {toast && (
        <div style={{ position:"fixed",top:74,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:dark?"#1e3048":"#0f172a",color:"#fff",padding:"10px 20px",borderRadius:999,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 32px rgba(0,0,0,0.3)",animation:"scaleIn 0.2s ease",whiteSpace:"nowrap" }}>
          <span style={{fontSize:16}}>{toast.emoji}</span>{toast.msg}
        </div>
      )}

      <header style={{ position:"sticky",top:0,zIndex:500,background:T.header,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid "+T.border,boxShadow:dark?"0 4px 24px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 12px" }}>

          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:56 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{fontSize:24}}>🌍</span>
              <div>
                <div style={{ fontWeight:800,fontSize:15,background:"linear-gradient(90deg,#f97316,#ef4444)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>WorldWire</div>
                <div style={{ fontSize:8,color:T.sub,letterSpacing:1.5,textTransform:"uppercase" }}>Real-Time World News</div>
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:4 }}>
              {bookmarks.length > 0 && <div style={{ background:"linear-gradient(135deg,#f97316,#ef4444)",color:"#fff",borderRadius:999,padding:"3px 7px",fontSize:10,fontWeight:700 }}>{"⭐"+bookmarks.length}</div>}
              <button onClick={function(e){e.stopPropagation();setShowSearch(function(s){return !s;});}} style={{ width:30,height:30,borderRadius:8,border:"1px solid "+T.border,background:showSearch?T.accent+"18":"transparent",color:T.text,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer" }}>{showSearch?"✕":"🔍"}</button>
              <button onClick={function(){setView(function(v){return v==="grid"?"list":"grid";});}} style={{ width:30,height:30,borderRadius:8,border:"1px solid "+T.border,background:"transparent",color:T.text,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer" }}>{view==="grid"?"▤":"⊟"}</button>
              <button onClick={fetchNews} style={{ width:30,height:30,borderRadius:8,border:"1px solid "+T.border,background:"transparent",color:T.text,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer" }}>🔄</button>
              <div style={{ position:"relative" }} onClick={function(e){e.stopPropagation();}}>
                <button onClick={function(){setShowCountry(function(s){return !s;});}} style={{ display:"flex",alignItems:"center",gap:3,padding:"0 7px",height:30,border:"1px solid "+(showCountry?T.accent:T.border),borderRadius:8,background:showCountry?T.accent+"15":"transparent",color:T.text,fontSize:11,fontWeight:600,cursor:"pointer" }}>
                  {country.flag}<span style={{ fontSize:10,color:T.sub }}>{" "+country.code.toUpperCase()+" ▾"}</span>
                </button>
                {showCountry && (
                  <div style={{ position:"absolute",top:"calc(100% + 6px)",right:0,background:T.surface,border:"1px solid "+T.border,borderRadius:12,overflow:"hidden",zIndex:600,minWidth:180,boxShadow:"0 16px 48px rgba(0,0,0,0.22)",animation:"scaleIn 0.2s ease" }}>
                    {COUNTRIES.map(function(c){
                      return (
                        <button key={c.code} onClick={function(){setCountry(c);setShowCountry(false);showToast("Switched to "+c.name,c.flag);}} style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",background:country.code===c.code?T.accent+"18":"transparent",color:country.code===c.code?T.accent:T.text,border:"none",textAlign:"left",fontSize:13,fontWeight:country.code===c.code?700:400,cursor:"pointer" }}>
                          <span style={{fontSize:18}}>{c.flag}</span>{c.name}
                          {country.code===c.code && <span style={{marginLeft:"auto"}}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button onClick={function(){setDark(function(d){return !d;});}} style={{ width:30,height:30,borderRadius:8,border:"1px solid "+T.border,background:"transparent",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>{dark?"☀️":"🌙"}</button>
            </div>
          </div>

          {showSearch && (
            <form onSubmit={handleSearchSubmit} style={{ paddingBottom:10,animation:"fadeUp 0.2s ease" }} onClick={function(e){e.stopPropagation();}}>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,color:T.sub,pointerEvents:"none" }}>🔍</span>
                <input ref={searchRef} value={searchInput} onChange={function(e){setSearchInput(e.target.value);}} placeholder="Search real news headlines…" style={{ width:"100%",padding:"9px 64px 9px 34px",border:"1.5px solid "+T.border,borderRadius:10,background:dark?"rgba(255,255,255,0.05)":"#f8fafc",color:T.text,fontSize:14,outline:"none" }} onFocus={function(e){e.target.style.borderColor="#f97316";e.target.style.boxShadow="0 0 0 3px rgba(249,115,22,0.15)";}} onBlur={function(e){e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}} />
                <button type="submit" style={{ position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:T.accent,border:"none",color:"#fff",borderRadius:7,padding:"4px 10px",fontSize:12,fontWeight:700,cursor:"pointer" }}>Go</button>
                {(searchInput||search) && <button type="button" onClick={function(){setSearchInput("");setSearch("");}} style={{ position:"absolute",right:48,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.sub,fontSize:14,cursor:"pointer" }}>✕</button>}
              </div>
            </form>
          )}

          <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:10,paddingTop:4 }}>
            {CATS.map(function(c){
              var active=cat===c.id;
              return (
                <button key={c.id} onClick={function(){setCat(c.id);setSearch("");setSearchInput("");}} style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:999,border:"1.5px solid "+(active?T.accent:T.border),background:active?"linear-gradient(135deg,#f97316,#ef4444)":T.pill,color:active?"#fff":T.pillText,whiteSpace:"nowrap",fontSize:11,fontWeight:active?700:500,transition:"all 0.2s",boxShadow:active?"0 4px 12px rgba(249,115,22,0.3)":"none",cursor:"pointer" }}>
                  <span>{c.icon}</span><span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {articles.length > 0 && (
        <div style={{ background:"linear-gradient(90deg,#7f1d1d,#b91c1c,#dc2626)",color:"#fff",display:"flex",alignItems:"center",gap:12,padding:"0 16px",height:36,overflow:"hidden" }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0,background:"rgba(0,0,0,0.3)",padding:"3px 10px",borderRadius:4,fontSize:10,fontWeight:800,letterSpacing:1.2 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block",animation:"pulse 1s infinite" }} />
            BREAKING
          </div>
          <div key={tickerIdx} style={{ flex:1,fontSize:12.5,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",animation:"ticker 0.4s ease" }}>
            {articles[tickerIdx]?articles[tickerIdx].title:""}
          </div>
          <div style={{ display:"flex",gap:4,flexShrink:0 }}>
            {[0,1,2].map(function(i){ return <button key={i} onClick={function(){setTickerIdx(i);}} style={{ width:6,height:6,borderRadius:"50%",background:i===tickerIdx?"#fff":"rgba(255,255,255,0.35)",border:"none",cursor:"pointer",padding:0 }} />; })}
          </div>
        </div>
      )}

      <div style={{ maxWidth:1200,margin:"0 auto",padding:"20px 16px" }}>
        {loading && (
          <div style={{ textAlign:"center",padding:"60px 20px" }}>
            <div style={{ width:48,height:48,border:"4px solid "+T.border,borderTop:"4px solid "+T.accent,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px" }} />
            <p style={{ color:T.sub,fontSize:14 }}>Fetching latest news…</p>
          </div>
        )}
        {error && !loading && (
          <div style={{ textAlign:"center",padding:"40px 20px",background:"rgba(239,68,68,0.08)",borderRadius:16,border:"1px solid rgba(239,68,68,0.2)",margin:"20px 0" }}>
            <div style={{ fontSize:40,marginBottom:12 }}>⚠️</div>
            <h3 style={{ color:"#ef4444",marginBottom:8,fontSize:18 }}>Failed to load news</h3>
            <p style={{ color:T.sub,marginBottom:20,fontSize:13 }}>{error}</p>
            <button onClick={fetchNews} style={{ padding:"10px 24px",background:"linear-gradient(135deg,#f97316,#ef4444)",color:"#fff",border:"none",borderRadius:999,fontWeight:700,fontSize:14,cursor:"pointer" }}>Try Again</button>
          </div>
        )}
        {!loading && !error && articles.length === 0 && (
          <div style={{ textAlign:"center",padding:"60px 20px" }}>
            <div style={{ fontSize:52,marginBottom:16 }}>🔍</div>
            <h3 style={{ fontSize:18,marginBottom:8 }}>No articles found</h3>
            <p style={{ color:T.sub,marginBottom:20 }}>Try a different search or category</p>
            <button onClick={function(){setSearch("");setSearchInput("");setCat("general");}} style={{ padding:"10px 24px",background:"linear-gradient(135deg,#f97316,#ef4444)",color:"#fff",border:"none",borderRadius:999,fontWeight:700,fontSize:14,cursor:"pointer" }}>Clear Filters</button>
          </div>
        )}
        {!loading && !error && articles.length > 0 && (
          <div>
            {!search && featured && (
              <a href={featured.url} target="_blank" rel="noopener noreferrer" style={{ display:"block",position:"relative",borderRadius:20,overflow:"hidden",marginBottom:24,height:280,textDecoration:"none",boxShadow:dark?"0 20px 60px rgba(0,0,0,0.5)":"0 8px 32px rgba(0,0,0,0.12)" }}>
                <img src={featured.urlToImage||"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&h=400&fit=crop"} alt={featured.title} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.15) 60%,transparent 100%)" }} />
                <div style={{ position:"absolute",top:14,left:14 }}>
                  <span style={{ background:"#f97316",color:"#fff",padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:800,textTransform:"uppercase" }}>⚡ Top Story</span>
                </div>
                <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:20 }}>
                  <div style={{ color:"rgba(255,255,255,0.7)",fontSize:11,marginBottom:6,display:"flex",gap:8 }}>
                    <span style={{ background:"rgba(255,255,255,0.15)",padding:"2px 8px",borderRadius:4,fontWeight:600 }}>{featured.source?featured.source.name:""}</span>
                    <span>{timeAgo(featured.publishedAt)}</span>
                  </div>
                  <h2 style={{ color:"#fff",fontSize:18,fontWeight:800,lineHeight:1.3 }}>{featured.title}</h2>
                </div>
              </a>
            )}
            <div style={{ display:view==="grid"?"grid":"flex",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",flexDirection:"column",gap:16 }}>
              {rest.map(function(article,idx){
                return (
                  <NewsCard key={article.url+"-"+idx} article={article} T={T} dark={dark} view={view} idx={idx}
                    expanded={expandedId===idx} onExpand={function(){setExpandedId(expandedId===idx?null:idx);}}
                    bookmarked={bookmarks.includes(idx)} onBookmark={function(){toggleBookmark(idx);}}
                    liked={likes.includes(idx)} onLike={function(){toggleLike(idx);}}
                    shareOpen={shareId===idx} onShareToggle={function(e){e.stopPropagation();setShareId(shareId===idx?null:idx);}}
                    onShare={handleShare}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <footer style={{ background:dark?"#060d1a":"#0f172a",color:"#64748b",padding:"32px 16px",marginTop:32,textAlign:"center" }}>
        <div style={{ fontSize:26,marginBottom:8 }}>🌍</div>
        <div style={{ fontWeight:800,fontSize:16,color:"#f1f5f9",marginBottom:4 }}>WorldWire</div>
        <div style={{ fontSize:12,marginBottom:8 }}>{"Powered by "}<span style={{ color:"#f97316",fontWeight:700 }}>NewsAPI.org</span>{" · Built with ❤️ and React"}</div>
        <div style={{ fontSize:11,color:"#334155" }}>© 2024 WorldWire · All rights reserved</div>
      </footer>
    </div>
  );
}
