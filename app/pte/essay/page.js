"use client";
import { useEffect, useMemo, useState } from "react";

export default function EssayPage() {
  const [source, setSource] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/essay-keywords.txt").then(r => r.text()).then(setSource).finally(() => setLoading(false));
  }, []);
  const lines = useMemo(() => source.split(/\r?\n/).map((text, index) => ({text, index}))
    .filter(x => !query || x.text.toLowerCase().includes(query.toLowerCase())), [source, query]);
  return <main style={{minHeight:"100vh",padding:"28px clamp(16px,4vw,48px)",background:"#0b0e13",color:"#eef3f8",fontFamily:"Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif"}}>
    <div style={{maxWidth:1050,margin:"0 auto"}}>
      <a href="/" style={{color:"#62d394",textDecoration:"none"}}>← JARVIS 홈</a>
      <header style={{margin:"24px 0"}}>
        <div style={{color:"#62d394",fontSize:13,fontWeight:800,letterSpacing:1}}>PTE STUDY BANK</div>
        <h1 style={{fontSize:"clamp(28px,4vw,40px)",margin:"8px 0"}}>Essay 지문 & 키워드</h1>
        <p style={{color:"#9aa7b8",lineHeight:1.7}}>내가 정리한 주제별 지문과 키워드를 검색하세요. 영어 키워드는 원문 그대로 보존했고, 한국어 논점 메모도 원본에 적힌 내용을 표시합니다.</p>
      </header>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="주제, 지문, 키워드 검색" aria-label="에세이 지문과 키워드 검색"
        style={{width:"100%",minHeight:48,padding:"0 14px",borderRadius:10,border:"1px solid #2b3645",background:"#111720",color:"#eef3f8",fontSize:16,outline:"none"}} />
      <div style={{color:"#9aa7b8",fontSize:13,margin:"12px 2px 16px"}}>{loading ? "불러오는 중..." : `${lines.length.toLocaleString()}개 줄 표시`}</div>
      <article style={{border:"1px solid #2b3645",borderRadius:12,overflow:"hidden",background:"#111720"}}>
        {loading ? <p style={{padding:22}}>지문과 키워드를 불러오고 있어요.</p> : <div>
          {lines.map(({text,index}) => {
            const trimmed=text.trim();
            if (!trimmed) return <div key={index} style={{height:7}} />;
            const isCategory=/^\d{2}\s*[·.\-]/.test(trimmed) || /주제|Topic/i.test(trimmed);
            const isQuestion=/^Q\d{2}-\d{2}$/.test(trimmed);
            const isKorean=/^(논점|예시 논지):/.test(trimmed);
            return <div key={index} style={{
              padding:isCategory?"13px 18px":"5px 18px",
              marginTop:isCategory?12:0,
              borderTop:isCategory?"1px solid #2b3645":"none",
              background:isCategory?"#1d2530":"transparent",
              color:isCategory?"#62d394":isQuestion?"#f3c969":isKorean?"#9ec9ff":"#e2e9f0",
              fontWeight:isCategory||isQuestion||isKorean?700:400,
              fontSize:isCategory?17:15,
              lineHeight:1.65,
              overflowWrap:"anywhere"
            }}>{trimmed}</div>;
          })}
        </div>}
      </article>
      <footer style={{color:"#718096",fontSize:12,margin:"16px 2px"}}>내 에세이 키워드 원문 보존판 · JARVIS 홈에서 언제든 열 수 있습니다.</footer>
    </div>
  </main>;
}
