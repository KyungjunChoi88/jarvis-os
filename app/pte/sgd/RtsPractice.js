"use client";

import {useRef, useState} from "react";

const lines = [
  "I understand that the situation is about 00.",
  "I completely understand why this is important.",
  "First, I am going to discuss about 00",
  "so I can deal with 00.",
  "Next, I am going to talk about 00",
  "to make sure 00 is handled correctly.",
  "I’m confident this is going to complete the issue quickly."
];

export default function RtsPractice() {
  const audio = useRef(null);
  const [repeat, setRepeat] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState("");

  return <section id="rts-template" aria-labelledby="rts-title" style={{border:"1px solid #2b3645", borderRadius:14, background:"#171d26", padding:24, marginBottom:16}}>
    <h2 id="rts-title" style={{marginTop:0}}>RTS · 상황 응답 템플릿 암기</h2>
    <p style={{color:"#9aa7b8"}}>음성을 듣고 따라 말한 뒤, 대본을 숨기고 연습해 보세요.</p>
    <audio ref={audio} controls loop={repeat} preload="metadata" src="/pte/rts.mp3" aria-label="RTS 템플릿 음성"
      onLoadedMetadata={e=>{e.currentTarget.playbackRate=speed; setError("");}}
      onError={()=>setError("RTS 음성을 불러오지 못했습니다. 페이지를 새로고침해 주세요.")}
      style={{width:"100%", marginBottom:16}} />
    <div style={{display:"flex", flexWrap:"wrap", alignItems:"center", gap:16}}>
      <label>재생 속도 <select aria-label="RTS 재생 속도" value={speed} onChange={e=>{
        const value=Number(e.target.value); setSpeed(value);
        if(audio.current) audio.current.playbackRate=value;
      }}>{[.7,.8,.9,1,1.1,1.2,1.5].map(value=><option key={value} value={value}>{value.toFixed(1)}×</option>)}</select></label>
      <label><input type="checkbox" checked={repeat} onChange={e=>setRepeat(e.target.checked)}/> RTS 음성 반복</label>
      <button type="button" aria-expanded={!hidden} aria-controls="rts-script" onClick={()=>setHidden(value=>!value)} style={{border:"1px solid #354355",borderRadius:9,background:"#1d2530",color:"#eef3f8",padding:"10px 14px",minHeight:44,cursor:"pointer"}}>{hidden?"RTS 대본 보기":"RTS 대본 숨기기"}</button>
    </div>
    {error&&<p role="alert" style={{color:"#ff7e8c"}}>{error}</p>}
    <div id="rts-script" style={{marginTop:18}}>{hidden?<p style={{color:"#9aa7b8"}}>음성을 듣고 상황 응답 템플릿을 떠올려 말해보세요.</p>:lines.map((line,index)=><p key={line} style={{fontSize:"clamp(17px,2vw,22px)",lineHeight:1.7,padding:"12px 14px",background:"#10161f",border:"1px solid #2b3645",borderRadius:10}}><span style={{color:"#62d394",fontSize:13,marginRight:12}}>{String(index+1).padStart(2,"0")}</span>{line}</p>)}</div>
  </section>;
}
