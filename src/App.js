import { useState, useEffect, useRef, useCallback } from "react";

const CATS = [
  { id:"general",       label:"World",         icon:"🌍" },
  { id:"business",      label:"Business",      icon:"💼" },
  { id:"technology",    label:"Tech",          icon:"💻" },
  { id:"sports",        label:"Sports",        icon:"⚽" },
  { id:"entertainment", label:"Film",          icon:"🎬" },
  { id:"health",        label:"Health",        icon:"❤️" },
  { id:"science",       label:"Science",       icon:"🔬" },
];

const COUNTRIES = [
  { flag:"🇺🇸", name:"United States", code:"us" },
  { flag:"🇬", name:"United Kingdom", code:"gb" },
  { flag:"🇮🇳", name:"India",          code:"in" },
  { flag:"🇨🇦", name:"Canada",         code:"ca" },
  { flag:"🇦🇺", name:"Australia",      code:"au" },
  { flag:"🇩", name:"Germany",        code:"de" },
];

const SHARES = [
  { icon:"💬", name:"WhatsApp",  color:"#25D366" },
  { icon:"𝕏",  name:"Twitter",   color:"#000000" },
  { icon:"📘", name:"Facebook",  color:"#1877F2" },
  { icon:"✉️", name:"Email",     color:"#EA4335" },
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

function timeAgo(dateStr) {
  var diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600)  return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

function NewsCard({ article, T, dark, view, expanded, onExpand, bookmarked, onBookmark, liked, onLike, shareOpen, onShareToggle, onShare, idx }) {
  var [hov, setHov] = useState(false);
  var [imgOk, setImgOk] = useState(false);
  var isList = view === "list";
  var fallback = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&h=400&fit=crop";

  return (
    <article
      onMouseEnter={function() { setHov(true); }}
      onMouseLeave={function() { setHov(false); }}
      style={{ background: T.card, borderRadius: 14, overflow: "hidden", border: "1px solid " + (hov ? T.accent + "66" : T.border), boxShadow: hov ? "0 12px 36px rgba(0,0,0,0.13)" : "0 1px 4px rgba(0,0,0,0.07)", transform: hov ? "translateY(-4px)" : "translateY(0)", transition: "all 0.25s ease", display: isList ? "flex" : "block", animation: "fadeUp 0.4s ease " + Math.min(idx * 50, 300) + "ms both" }}
    >
      <div style={{ position: "relative", flexShrink: 0, width: isList ? 200 : "100%", paddingTop: isList ? 0 : "56%", minHeight: isList ? 148 : 0, overflow: "hidden", background: T.border }}>
        {!imgOk && <div style={{ position: "absolute", inset: 0, background: dark ? "#1e3048" : "#e2e8f0", animation: "pulse 1.2s infinite" }} />}
        <img src={article.image || fallback} alt={article.title} onLoad={function() { setImgOk(true); }} onError={function(e) { e.target.src = fallback; setImgOk(true); }} style={{ position: isList ? "relative" : "absolute", top: 0, left: 0, width: "100%", height: isList ? 148 : "100%", objectFit: "cover", display: "block", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease", opacity: imgOk ? 1 : 0 }} />
        <span style={{ position: "absolute", top: 8, left: 8, background: T.accent + "ee", color: "#fff", padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
          {article.source && article.source.name ? article.source.name.substring(0, 12) : "News"}
        </span>
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, background: T.accent + "15", padding: "2px 8px", borderRadius: 4 }}>
            {article.source && article.source.name ? article.source.name.substring(0, 18) : "Unknown"}
          </span>
          <span style={{ fontSize: 11, color: T.sub }}>🕐 {timeAgo(article.publishedAt)}</span>
        </div>
        <h3 onClick={onExpand} style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.35, color: T.text, marginBottom: 7, display: "-webkit-box", WebkitLineClamp: expanded ? 99 : 2, WebkitBoxOrient: "vertical", overflow: "hidden", cursor: "pointer" }}>
          {article.title}
        </h3>
        <div style={{ maxHeight: expanded ? 160 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
          <p style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.55, marginBottom: 10 }}>{article.description || "No description available."}</p>
        </div>
        <button onClick={onExpand} style={{ alignSelf: "flex-start", background: "none", border: "none", color: T.accent, fontSize: 11, fontWeight: 700, padding: 0, marginBottom: 8, cursor: "pointer" }}>
          {expanded ? "▲ Less" : "▼ More"}
        </button>
        <div style={{ display: "flex", gap: 10, fontSize: 11, color: T.sub, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
          <span>📰 {article.source && article.source.name ? article.source.name : "Unknown"}</span>
          {bookmarked && <span style={{ color: T.accent, fontWeight: 700, marginLeft: "auto" }}>Saved ⭐</span>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "9px 10px", background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer", boxShadow: "0 4px 12px rgba(249,115,22,0.35)", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>Read Full →</a>
          <button onClick={onLike} style={{ width: 34, height: 34, border: "1px solid " + (liked ? "#ef4444" : "rgba(239,68,68,0.3)"), background: liked ? "rgba(239,68,68,0.12)" : "transparent", borderRadius: 8, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{liked ? "❤️" : "🤍"}</button>
          <div style={{ position: "relative" }} onClick={function(e) { e.stopPropagation(); }}>
            <button onClick={onShareToggle} style={{ width: 34, height: 34, border: "1px solid " + (shareOpen ? T.accent : T.border), background: shareOpen ? T.accent + "18" : "transparent", borderRadius: 8, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}>📤</button>
            {shareOpen && (
              <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, background: T.surface, border: "1px solid " + T.border, borderRadius: 10, padding: 8, display: "flex", gap: 6, zIndex: 200, boxShadow: "0 12px 36px rgba(0,0,0,0.22)", animation: "scaleIn 0.2s ease" }}>
                {SHARES.map(function(p) {
                  return (
                    <button key={p.name} onClick={function() { onShare(p.name, article); }} title={p.name} style={{ width: 34, height: 34, borderRadius: 8, background: dark ? "#0f172a" : "#f8fafc", border: "1px solid " + T.border, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700, color: T.text, transition: "all 0.18s" }} onMouseEnter={function(e) { e.currentTarget.style.background = p.color; e.currentTarget.style.color = "#fff"; }} onMouseLeave={function(e) { e.currentTarget.style.background = dark ? "#0f172a" : "#f8fafc"; e.currentTarget.style.color = T.text; }}>
                      {p.icon}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button onClick={onBookmark} style={{ width: 34, height: 34, border: "1px solid " + (bookmarked ? T.accent : T.border), background: bookmarked ? T.accent + "15" : "transparent", borderRadius: 8, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: bookmarked ? T.accent : T.sub }}>{bookmarked ? "⭐" : "☆"}</button>
        </div>
      </div>
    </article>
  );
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
  var API_KEY = process.env.REACT_APP_GNEWS_API_KEY;

  var fetchNews = useCallback(function() {
    setLoading(true);
    setError(null);
    var url = "";
    if (search) {
      url = "https://gnews.io/api/v4/search?q=" + encodeURIComponent(search) + "&lang=en&max=10&apikey=" + API_KEY;
    } else {
      url = "https://gnews.io/api/v4/top-headlines?category=" + cat + "&lang=en&country=" + country.code + "&max=10&apikey=" + API_KEY;
    }
    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.articles) {
          setArticles(data.articles);
        } else {
          setError("Failed to load news. Please try again.");
        }
        setLoading(false);
      })
      .catch(function() {
        setError("Network error. Please check your connection.");
        setLoading(false);
      });
  }, [cat, country, search, API_KEY]);

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
    if (!emoji) emoji = "✅";
    setToast({ msg: msg, emoji: emoji });
    setTimeout(function() { setToast(null); }, 2200);
  }, []);

  function handleShare(platform, article) {
    var url = encodeURIComponent(article.url);
    var text = encodeURIComponent(article.title);
    var shareUrl = "";
    if (platform === "WhatsApp") shareUrl = "https://wa.me/?text=" + text + "%20" + url;
    else if (platform === "Twitter") shareUrl = "https://twitter.com/intent/tweet?text=" + text + "&url=" + url;
    else if (platform === "Facebook") shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + url;
    else if (platform === "Email") shareUrl = "mailto:?subject=" + text + "&body=" + url;
    if (shareUrl) window.open(shareUrl, "_blank");
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
    <div onClick={function() { setShowCountry(false); setShareId(null); }} style={{ background: T.bg, color: T.text, minHeight: "100vh", fontFamily: "'Inter',-apple-system,sans-serif", transition: "background 0.4s,color 0.4s", overflowX: "hidden" }}>
      <style>{"\n@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}\n@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}\n@keyframes ticker{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}\n@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}\n@keyframes spin{to{transform:rotate(360deg)}}\n*{box-sizing:border-box;margin:0;padding:0;}\n::-webkit-scrollbar{width:3px;height:3px;}\n::-webkit-scrollbar-thumb{background:#f97316;border-radius:4px;}\ninput{outline:none;font-family:inherit;}\nbutton{cursor:pointer;outline:none;font-family:inherit;}\n"}</style>

      {toast && (
        <div style={{ position: "fixed", top: 74, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: dark ? "#1e3048" : "#0f172a", color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", animation: "scaleIn 0.2s ease", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 16 }}>{toast.emoji}</span>{toast.msg}
        </div>
      )}

      <header style={{ position: "sticky", top: 0, zIndex: 500, background: T.header, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid " + T.border, boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <span style={{ fontSize: 28 }}>🌍</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, background: "linear-gradient(90deg,#f97316,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>WorldWire</div>
                <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1.5, textTransform: "uppercase" }}>Real-Time World News</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {bookmarks.length > 0 && <div style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{"⭐ " + bookmarks.length}</div>}
              <button onClick={function(e) { e.stopPropagation(); setShowSearch(function(s) { return !s; }); }} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid " + T.border, background: showSearch ? T.accent + "18" : "transparent", color: T.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer" }}>{showSearch ? "✕" : "🔍"}</button>
              <button onClick={function() { setView(function(v) { return v === "grid" ? "list" : "grid"; }); }} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid " + T.border, background: "transparent", color: T.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer" }}>{view === "grid" ? "▤" : "⊟"}</button>
              <button onClick={fetchNews} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid " + T.border, background: "transparent", color: T.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer" }}>🔄</button>
              <div style={{ position: "relative" }} onClick={function(e) { e.stopPropagation(); }}>
                <button onClick={function() { setShowCountry(function(s) { return !s; }); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 10px", height: 36, border: "1px solid " + (showCountry ? T.accent : T.border), borderRadius: 9, background: showCountry ? T.accent + "15" : "transparent", color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {country.flag + " "}<span style={{ fontSize: 11, color: T.sub }}>{country.code.toUpperCase() + " ▾"}</span>
                </button>
                {showCountry && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: T.surface, border: "1px solid " + T.border, borderRadius: 12, overflow: "hidden", zIndex: 600, minWidth: 180, boxShadow: "0 16px 48px rgba(0,0,0,0.22)", animation: "scaleIn 0.2s ease" }}>
                    {COUNTRIES.map(function(c) {
                      return (
                        <button key={c.code} onClick={function() { setCountry(c); setShowCountry(false); showToast("Switched to " + c.name, c.flag); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", background: country.code === c.code ? T.accent + "18" : "transparent", color: country.code === c.code ? T.accent : T.text, border: "none", textAlign: "left", fontSize: 13, fontWeight: country.code === c.code ? 700 : 400, cursor: "pointer" }}>
                          <span style={{ fontSize: 18 }}>{c.flag}</span>{c.name}
                          {country.code === c.code && <span style={{ marginLeft: "auto" }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button onClick={function() { setDark(function(d) { return !d; }); }} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid " + T.border, background: "transparent", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{dark ? "☀️" : "🌙"}</button>
            </div>
          </div>

          {showSearch && (
            <form onSubmit={handleSearchSubmit} style={{ paddingBottom: 12, animation: "fadeUp 0.2s ease" }} onClick={function(e) { e.stopPropagation(); }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: T.sub, pointerEvents: "none" }}>🔍</span>
                <input ref={searchRef} value={searchInput} onChange={function(e) { setSearchInput(e.target.value); }} placeholder="Search real news headlines…" style={{ width: "100%", padding: "10px 70px 10px 36px", border: "1.5px solid " + T.border, borderRadius: 10, background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc", color: T.text, fontSize: 14 }} onFocus={function(e) { e.target.style.borderColor = "#f97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.15)"; }} onBlur={function(e) { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }} />
                <button type="submit" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: T.accent, border: "none", color: "#fff", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Go</button>
                {(searchInput || search) && <button type="button" onClick={function() { setSearchInput(""); setSearch(""); }} style={{ position: "absolute", right: 52, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.sub, fontSize: 14, cursor: "pointer" }}>✕</button>}
              </div>
            </form>
          )}

          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, paddingTop: 4 }}>
            {CATS.map(function(c) {
              var active = cat === c.id;
              return (
                <button key={c.id} onClick={function() { setCat(c.id); setSearch(""); setSearchInput(""); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 999, border: "1.5px solid " + (active ? T.accent : T.border), background: active ? "linear-gradient(135deg,#f97316,#ef4444)" : T.pill, color: active ? "#fff" : T.pillText, whiteSpace: "nowrap", fontSize: 12, fontWeight: active ? 700 : 500, transition: "all 0.2s", boxShadow: active ? "0 4px 12px rgba(249,115,22,0.3)" : "none", cursor: "pointer" }}>
                  <span>{c.icon}</span><span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {articles.length > 0 && (
        <div style={{ background: "linear-gradient(90deg,#7f1d1d,#b91c1c,#dc2626)", color: "#fff", display: "flex", alignItems: "center", gap: 12, padding: "0 16px", height: 36, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, background: "rgba(0,0,0,0.3)", padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 800, letterSpacing: 1.2 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "pulse 1s infinite" }} />
            BREAKING
          </div>
          <div key={tickerIdx} style={{ flex: 1, fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "ticker 0.4s ease" }}>
            {articles[tickerIdx] ? articles[tickerIdx].title : ""}
          </div>
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {[0,1,2].map(function(i) { return <button key={i} onClick={function() { setTickerIdx(i); }} style={{ width: 6, height: 6, borderRadius: "50%", background: i === tickerIdx ? "#fff" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", padding: 0 }} />; })}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: 48, height: 48, border: "4px solid " + T.border, borderTop: "4px solid " + T.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: T.sub, fontSize: 14 }}>Fetching latest news…</p>
          </div>
        )}
        {error && !loading && (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(239,68,68,0.08)", borderRadius: 16, border: "1px solid rgba(239,68,68,0.2)", margin: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ color: "#ef4444", marginBottom: 8, fontSize: 18 }}>Failed to load news</h3>
            <p style={{ color: T.sub, marginBottom: 20, fontSize: 13 }}>{error}</p>
            <button onClick={fetchNews} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff", border: "none", borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Try Again</button>
          </div>
        )}
        {!loading && !error && articles.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>No articles found</h3>
            <p style={{ color: T.sub, marginBottom: 20 }}>Try a different search or category</p>
            <button onClick={function() { setSearch(""); setSearchInput(""); setCat("general"); }} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff", border: "none", borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Clear Filters</button>
          </div>
        )}
        {!loading && !error && articles.length > 0 && (
          <div>
            {!search && featured && (
              <a href={featured.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", position: "relative", borderRadius: 20, overflow: "hidden", marginBottom: 24, height: 280, textDecoration: "none", boxShadow: dark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)" }}>
                <img src={featured.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&h=400&fit=crop"} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.15) 60%,transparent 100%)" }} />
                <div style={{ position: "absolute", top: 14, left: 14 }}>
                  <span style={{ background: "#f97316", color: "#fff", padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>⚡ Top Story</span>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20 }}>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 6, display: "flex", gap: 8 }}>
                    <span style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{featured.source ? featured.source.name : ""}</span>
                    <span>{timeAgo(featured.publishedAt)}</span>
                  </div>
                  <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>{featured.title}</h2>
                </div>
              </a>
            )}
            <div style={{ display: view === "grid" ? "grid" : "flex", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", flexDirection: "column", gap: 16 }}>
              {rest.map(function(article, idx) {
                return (
                  <NewsCard key={article.url + "-" + idx} article={article} T={T} dark={dark} view={view} idx={idx}
                    expanded={expandedId === idx} onExpand={function() { setExpandedId(expandedId === idx ? null : idx); }}
                    bookmarked={bookmarks.includes(idx)} onBookmark={function() { toggleBookmark(idx); }}
                    liked={likes.includes(idx)} onLike={function() { toggleLike(idx); }}
                    shareOpen={shareId === idx} onShareToggle={function(e) { e.stopPropagation(); setShareId(shareId === idx ? null : idx); }}
                    onShare={handleShare}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: dark ? "#060d1a" : "#0f172a", color: "#64748b", padding: "32px 16px", marginTop: 32, textAlign: "center" }}>
        <div style={{ fontSize: 26, marginBottom: 8 }}>🌍</div>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9", marginBottom: 4 }}>WorldWire</div>
        <div style={{ fontSize: 12, marginBottom: 8 }}>{"Powered by "}<span style={{ color: "#f97316", fontWeight: 700 }}>GNews.io</span>{" · Built with ❤️ and React"}</div>
        <div style={{ fontSize: 11, color: "#334155" }}>© 2024 WorldWire · All rights reserved</div>
      </footer>
    </div>
  );
}
