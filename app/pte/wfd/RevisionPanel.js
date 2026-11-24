"use client";
import {useEffect,useMemo,useRef,useState} from "react";

function wordList(text){return (text.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*(?:-[A-Za-z0-9]+)*/g)||[]).map(x=>x.toLowerCase().replace(/’/g,"'"))}
function scoreSentence(expectedText,answer){
 const expected=wordList(expectedText),actual=wordList(answer),rows=Array.from({length:expected.length+1},()=>Array(actual.length+1).fill(0));
 for(let i=1;i<=expected.length;i++)for(let j=1;j<=actual.length;j++)rows[i][j]=expected[i-1]===actual[j-1]?rows[i-1][j-1]+1:Math.max(rows[i-1][j],rows[i][j-1]);
 const matches=Array(expected.length).fill(false);let i=expected.length,j=actual.length;
 while(i>0&&j>0){if(expected[i-1]===actual[j-1]){matches[i-1]=true;i--;j--}else if(rows[i-1][j]>=rows[i][j-1])i--;else j--}
 return {expected,actual,matches,score:matches.filter(Boolean).length,total:expected.length,capitalized:/^\s*[A-Z]/.test(answer),period:/\.\s*$/.test(answer)};
}
const styles=".revision{border:1px solid #2b3645;border-radius:14px;background:#171d26;padding:24px}.revHead{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.revTitle{font-size:24px;margin:0}.revSub{color:#9aa7b8;font-size:14px;line-height:1.6}.revActions{display:flex;gap:9px;flex-wrap:wrap;margin:16px 0}.revBtn{min-height:44px;border:1px solid #354355;border-radius:9px;background:#1d2530;color:#eef3f8;padding:10px 14px;font:700 14px system-ui;cursor:pointer}.revBtn.primary{background:#62d394;color:#10151d;border:0}.revBtn:disabled{opacity:.5;cursor:not-allowed}.revItem{border:1px solid #2b3645;border-radius:11px;background:#10161f;padding:15px;margin:10px 0}.revSentence{font-size:18px;font-weight:750;line-height:1.55}.revMeaning{color:#aebdcd;line-height:1.5;margin-top:7px}.revMeta{color:#93a1b3;font-size:12px;margin-top:8px}.revRow{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.revProgress{color:#62d394;font-weight:800}.revArea{width:100%;min-height:115px;resize:vertical;box-sizing:border-box;background:#0f151e;color:#f3f6fa;border:1px solid #41536a;border-radius:10px;padding:14px;font:16px/1.5 system-ui;margin:10px 0}.revScore{font-size:25px;color:#62d394;font-weight:900;margin:12px 0}.revWords{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.revWord{border-radius:6px;padding:5px 8px;background:#442d32;color:#ffc1c7;font-size:13px}.revWord.ok{background:#173b2d;color:#9cf0bf}.revError{color:#ff9ca8}.revEmpty{padding:34px 16px;text-align:center;color:#9aa7b8;border:1px dashed #41536a;border-radius:10px;margin-top:16px}.revNote{color:#9aa7b8;font-size:13px;line-height:1.6;margin:8px 0}.revTag{border:1px solid #354355;border-radius:999px;padding:4px 8px;color:#9aa7b8;font-size:12px}";
function shuffle(list){const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
export default function RevisionPanel(){
 const [entries,setEntries]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[auth,setAuth]=useState(false);
 const [queue,setQueue]=useState([]),[index,setIndex]=useState(0),[active,setActive]=useState(false),[answer,setAnswer]=useState(""),[submitted,setSubmitted]=useState(false),[grade,setGrade]=useState(null),[feedback,setFeedback]=useState("");
 const audio=useRef(null),current=queue[index];
 async function load(){
  setLoading(true);setError("");
  try{const r=await fetch("/api/wfd-revision",{cache:"no-store"}),d=await r.json();if(r.status===401){setAuth(true);setEntries([]);return}if(!r.ok)throw Error(d.error||"리비전을 불러오지 못했습니다.");setAuth(false);setEntries(d.entries||[])}
  catch(e){setError(e.message||"리비전을 불러오지 못했습니다.")}
  finally{setLoading(false)}
 }
 useEffect(()=>{load()},[]);
 const sorted=useMemo(()=>[...entries].sort((a,b)=>a.sentence_id-b.sentence_id||String(a.created_at).localeCompare(String(b.created_at))),[entries]);
 function begin(order){if(!sorted.length)return;const list=order==="random"?shuffle(sorted):sorted;setQueue(list);setIndex(0);setAnswer("");setGrade(null);setSubmitted(false);setFeedback(order==="random"?"저장 문장을 무작위 순서로 복습합니다.":"저장 문장을 번호 순서로 복습합니다.");setActive(true)}
 async function play(entry=current){if(!entry?.audio_url||!audio.current){setFeedback("이 문장의 MP3 주소가 없습니다.");return}const a=audio.current;try{a.pause();a.src=entry.audio_url;a.load();a.currentTime=0;await a.play();setFeedback("문장을 듣고 받아쓰세요.")}catch{setFeedback("음성을 재생할 수 없습니다. 다시 눌러 주세요.")}}
 async function submit(){
  if(!current||!answer.trim()||submitted)return;
  const result=scoreSentence(current.sentence,answer);setGrade(result);setSubmitted(true);
  const correct=result.score===result.total&&result.capitalized&&result.period;
  try{
   const r=await fetch("/api/wfd-revision",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"review",id:current.id,correct})});
   const d=await r.json();if(!r.ok)throw Error(d.error||"복습 결과를 저장하지 못했습니다.");
   const updated=d.entry;setEntries(v=>v.map(x=>x.id===updated.id?updated:x));setQueue(v=>v.map(x=>x.id===updated.id?updated:x));
   setFeedback(updated.memorized?"암기 완료 · 3회 연속 정답입니다.":correct?"정답입니다. 연속 정답 "+updated.consecutive_correct+"/3":"오답 또는 표기 오류입니다. 연속 정답 횟수를 0으로 돌렸습니다.");
  }catch(e){setError(e.message||"복습 결과를 저장하지 못했습니다.")}
 }
 function next(){
  if(index>=queue.length-1){setActive(false);setFeedback("복습 목록을 모두 완료했습니다.");return}
  setIndex(v=>v+1);setAnswer("");setGrade(null);setSubmitted(false);setFeedback("다음 리비전 문항입니다. 먼저 음성을 들어보세요.")
 }
 async function remove(entry){
  if(!window.confirm("이 문장을 리비전 목록에서 삭제할까요?"))return;
  try{const r=await fetch("/api/wfd-revision",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:entry.id})});const d=await r.json();if(!r.ok)throw Error(d.error||"삭제하지 못했습니다.");setEntries(v=>v.filter(x=>x.id!==entry.id));setFeedback("리비전 문장을 삭제했습니다.")}
  catch(e){setError(e.message||"삭제하지 못했습니다.")}
 }
 function exportCsv(){
  const quote=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
  const rows=[["번호","영어 문장","한국어 뜻","중요도","연속 정답","암기 완료","출처 리비전"],...sorted.map(x=>[x.sentence_id,x.sentence,x.meaning,x.stars,x.consecutive_correct,x.memorized?"예":"아니요",x.source_revision])];
  const csv="\uFEFF"+rows.map(row=>row.map(quote).join(",")).join("\r\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="JARVIS_WFD_Revision.csv";a.click();URL.revokeObjectURL(url)
 }
 return <section className="revision"><style>{styles}</style><audio ref={audio} preload="none"/><div className="revHead"><h2 className="revTitle">WFD 리비전</h2><span className="revTag">{entries.length}문장 저장</span></div>
  <p className="revSub">어려운 문장을 여기 모아 순차 또는 랜덤으로 다시 풀어보세요. 문장 전체를 대문자와 마침표까지 포함해 3회 연속 맞히면 암기 완료로 표시됩니다. 저장 문장은 월별 WFD 문항이 바뀌어도 별도 보관됩니다.</p>
  {auth&&<div className="revItem"><p>리비전 문장을 여러 기기에서 동기화하려면 Google 로그인이 필요합니다.</p><a className="revBtn primary" href="/api/auth/signin?callbackUrl=%2Fpte%2Fwfd">Google 로그인</a></div>}
  {error&&<p className="revError" role="alert">{error}</p>}
  {!auth&&<div className="revActions"><button className="revBtn primary" onClick={()=>begin("sequential")} disabled={!entries.length}>▶ 순차 복습</button><button className="revBtn" onClick={()=>begin("random")} disabled={!entries.length}>🔀 랜덤 복습</button><button className="revBtn" onClick={exportCsv} disabled={!entries.length}>CSV 다운로드</button><button className="revBtn" onClick={load}>새로고침</button></div>}
  {active&&current?<div className="revItem"><div className="revRow"><strong className="revSentence">{current.sentence_id}번 · {index+1}/{queue.length}</strong><span className="revTag">{current.memorized?"암기 완료":"연속 정답 "+current.consecutive_correct+"/3"}</span></div><p className="revNote">{feedback}</p><div className="revActions"><button className="revBtn" onClick={()=>play(current)}>🔊 문장 듣기 / 다시 듣기</button></div><label className="revNote" htmlFor="revision-answer">들은 문장을 입력하세요.</label><textarea id="revision-answer" className="revArea" value={answer} onChange={e=>setAnswer(e.target.value)} disabled={submitted} placeholder="첫 글자는 대문자, 끝에는 마침표를 입력하세요."/>
   {!submitted?<button className="revBtn primary" onClick={submit} disabled={!answer.trim()}>채점 및 연속 정답 기록</button>:<div className="revItem"><div className="revScore">{grade.score}/{grade.total} 단어 정답</div><div className="revWords">{grade.expected.map((word,i)=><span key={i} className={"revWord "+(grade.matches[i]?"ok":"")}>{word}{grade.matches[i]?" ✓":" · 오답"}</span>)}</div><p className="revNote">첫 글자 대문자: {grade.capitalized?"확인":"미확인"} · 문장 끝 마침표: {grade.period?"확인":"미확인"}</p><p className="revNote">정답: {current.sentence}</p><button className="revBtn primary" onClick={next}>{index===queue.length-1?"복습 완료":"다음 문장 →"}</button></div>}
  </div>:!auth&&<>{loading?<div className="revEmpty">리비전 목록을 불러오는 중…</div>:entries.length===0?<div className="revEmpty">아직 저장된 문장이 없습니다.<br/>연습 모드에서 어려운 문장 옆의 “리비전에 저장”을 누르세요.</div>:<div>{sorted.map(entry=><article className="revItem" key={entry.id}><div className="revRow"><strong className="revSentence">{entry.sentence_id}번 · {entry.sentence}</strong><span className="revTag">{entry.memorized?"암기 완료":"연속 정답 "+entry.consecutive_correct+"/3"}</span></div><div className="revMeaning">{entry.meaning}</div><div className="revMeta">저장 리비전 {entry.source_revision||"—"} · {entry.stars}</div><div className="revActions"><button className="revBtn" onClick={()=>play(entry)}>🔊 듣기</button><button className="revBtn" onClick={()=>remove(entry)}>목록에서 삭제</button></div></article>)}</div>}</>}
 </section>
}
