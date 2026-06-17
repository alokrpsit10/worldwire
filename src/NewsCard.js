import { useState } from "react";

const SHARES = [
  { icon:"💬", name:"WhatsApp",  color:"#25D366" },
  { icon:"𝕏",  name:"Twitter",   color:"#000000" },
  { icon:"📘", name:"Facebook",  color:"#1877F2" },
  { icon:"✉️", name:"Email",     color:"#EA4335" },
];

export function timeAgo(dateStr) {
  var diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600)  return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

export default function NewsCard({ article, T, dark, view, expanded, onExpand, bookmarked, onBookmark, liked, onLike, shareOpen, onShareToggle, onShare, idx }) {
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
        <img
          src={article.urlToImage || fallback}
          alt={article.title}
          onLoad={function() { setImgOk(true); }}
          onError={function(e) { e.target.src = fallback; setImgOk(true); }}
          style={{ position: isList ? "relative" : "absolute", top: 0, left: 0, width: "100%", height: isList ? 148 : "100%", objectFit: "cover", display: "block", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease", opacity: imgOk ? 1 : 0 }}
        />
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
