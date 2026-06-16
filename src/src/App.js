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
  { flag:"🇨", name:"Canada", code:"CA" },
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
    <button onClick={onClick} title={title} onMouseEnter={()=>setHov(true)} on
