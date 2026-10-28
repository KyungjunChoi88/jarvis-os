"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {TYPES,dateKey,weekStart} from "../../../lib/pte-progress";
const days=["월","화","수","목","금","토","일"];
export default function Checklist(){
 const [week,setWeek]=useState(""),[entries,setEntries]=useState({}),[memo,setMemo]=useState(""),[status,setStatus]=useState("불러오는 중"),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(""),[login,setLogin]=useState(false),[pending,setPending]=useState(null);
 const requestId=useRef(0),dirty=useRef(false),loadedWeek=useRef("");
 const load=useCallback(async(w,quiet=false)=>{const seq=++requestId.current;if(!quiet)setLoading(true);
 try{const r=await fetch("/api/pte-progress?week="+w,{cache:"no-store"});const x=await r.json();if(seq!==requestId.current)return;if(!r.ok){setLogin(r.status===401);throw Error(x.error)}
 const next={};for(const row of x.entries){if(row.item!=="memo")next[row.item+"-"+row.day]=row.done}
 if(!dirty.current){setEntries(next);setMemo(x.entries.find(e=>e.item==="memo")?.memo||"");loadedWeek.current=w}
 setError("");setLogin(false);setStatus("서버 기록 연결됨");
 }catch(e){if(seq===requestId.current){setError(e.message);setStatus("연결 확인 필요")}}finally{if(seq===requestId.current)setLoading(false)}},[]);
 useEffect(()=>setWeek(weekStart(dateKey(new Date()))),[]);
 useEffect(()=>{if(week)load(week)},[week,load]);
 useEffect(()=>{const refresh=()=>{if(week&&!saving&&!dirty.current)load(week,true)};window.addEventListener("focus",refresh);const timer=setInterval(refresh,30000);return()=>{window.removeEventListener("focus",refresh);clearInterval(timer)}},[week,saving,load]);
 useEffect(()=>{const guard=e=>{if(dirty.current||saving){e.preventDefault();e.returnValue=""}};window.addEventListener("beforeunload",guard);return()=>window.removeEventListener("beforeunload",guard)},[saving]);
 async function persist(change){ requestId.current++;
 setSaving(true);setStatus("서버에 저장 중");setError("");
 try{const r=await fetch("/api/pte-progress",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...change,week})});const x=await r.json();if(!r.ok)throw Error(x.error);
 if(change.item==="memo")dirty.current=false;setPending(null);setStatus("서버 저장 완료");
 }catch(e){setError(e.message+" 입력 내용은 이 화면에 남아 있습니다.");setPending(change);setStatus("저장 실패 · 재시도 필요")}finally{setSaving(false)}
 }
 function move(w){if(saving||pending)return;if(dirty.current&&!confirm("저장하지 않은 메모가 있습니다. 주차를 이동할까요?"))return;dirty.current=false;setEntries({});setMemo("");setWeek(w)}
 function shift(n){const d=new Date(week+"T12:00:00");d.setDate(d.getDate()+n);move(dateKey(d))}
 const dates=days.map((_,i)=>{const d=new Date(week+"T12:00:00");d.setDate(d.getDate()+i);return Number.isFinite(d.getTime())?d:null});
 const completed=Object.values(entries).filter(Boolean).length;
 const disabled=loading||saving||!!pending||loadedWeek.current!==week;
 return <main className="study"><style>{`
 body{margin:0;background:#0b0e13;color:#eef3f8;font-family:system-ui,sans-serif}.study{max-width:1120px;margin:auto;padding:30px 20px}a{color:#8dbbff}h1{font-size:30px;margin:16px 0 8px}.muted{color:#9aa7b8}.toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:25px 0}.panel{background:#171d26;border:1px solid #2b3645;border-radius:12px;padding:22px;margin:18px 0}button,input,textarea{font:inherit;color:inherit;background:#10161f;border:1px solid #354052;border-radius:8px;padding:11px}button{cursor:pointer;min-height:44px}button:disabled{opacity:.45;cursor:wait}.scroll{overflow:auto}table{width:100%;min-width:750px;border-collapse:collapse}th,td{padding:16px 9px;border-bottom:1px solid #2b3645;text-align:center}th:first-child,td:first-child{text-align:left;position:sticky;left:0;background:#171d26;min-width:180px}small{display:block;margin-top:5px;color:#9aa7b8}input[type=checkbox]{width:24px;height:24px;accent-color:#62d394}.bar{height:9px;background:#2b3645;border-radius:10px;overflow:hidden;margin-top:15px}.bar span{display:block;height:100%;background:#62d394}textarea{box-sizing:border-box;width:100%;min-height:110px}.error{color:#ffb2b2;line-height:1.7}.chips{display:flex;gap:10px;flex-wrap:wrap}.chips span{padding:8px 12px;background:#253140;border-radius:20px}.today{color:#62d394}@media(max-width:600px){.study{padding:18px 12px}.panel{padding:15px}h1{font-size:25px}}
 `}</style><a href="/">← 자비스 홈</a><h1>PTE 주간 공부 체크</h1><p className="muted">사무실에서도, 집에서도, 폰에서도 같은 Google 계정으로 이어서 공부하세요.</p>
 <p role="status" aria-live="polite">{status}</p>{error&&<div className="panel error" role="alert">{error}<br/>{login?<a href="/api/auth/signin?callbackUrl=%2Fpte%2Fchecklist">Google 로그인</a>:<button disabled={saving} onClick={()=>pending?persist(pending):load(week)}>다시 시도</button>}</div>}
 <nav className="toolbar"><button disabled={!week||saving||!!pending} onClick={()=>shift(-7)}>← 이전 주</button><input aria-label="주차 선택" type="date" value={week} disabled={saving||!!pending} onChange={e=>{if(e.target.value)move(weekStart(e.target.value))}}/><button disabled={!week||saving||!!pending} onClick={()=>shift(7)}>다음 주 →</button><button disabled={saving||!!pending} onClick={()=>move(weekStart(dateKey(new Date())))}>이번 주</button></nav>
 <section className="panel"><span className="muted">주간 달성률</span><h1>{Math.round(completed/49*100)}%</h1><span>{completed} / 49개 완료</span><div className="bar"><span style={{width:completed/49*100+"%"}}/></div></section>
 <section className="panel"><div className="scroll"><table><thead><tr><th>유형 / 하루 목표</th>{dates.map((d,i)=><th key={i} className={d&&dateKey(d)===dateKey(new Date())?"today":""}>{days[i]}<small>{d?(d.getMonth()+1)+"/"+d.getDate():""}</small></th>)}</tr></thead><tbody>{TYPES.map(t=><tr key={t[0]}><td><b>{t[0]}</b><small>{t[2]} · {t[1]}</small></td>{days.map((day,i)=><td key={i}><input type="checkbox" aria-label={t[0]+" "+day+"요일 완료"} checked={!!entries[t[0]+"-"+i]} disabled={disabled} onChange={e=>{const done=e.target.checked;setEntries(v=>({...v,[t[0]+"-"+i]:done}));persist({item:t[0],day:i,done})}}/></td>)}</tr>)}</tbody></table></div><p className="muted">WFD는 10문항 테스트와 틀린 문항 보충까지 마치면 체크하세요. 오답이 없으면 테스트 후 체크합니다.</p></section>
 <section className="panel"><h2>이번 주 복습 메모</h2><textarea aria-label="이번 주 복습 메모" maxLength={5000} value={memo} disabled={disabled} placeholder="어려웠던 문장, 보충할 유형을 적으세요." onChange={e=>{dirty.current=true;setMemo(e.target.value);setStatus("메모 수정 중 · 저장 버튼을 눌러주세요")}}/><button disabled={disabled} onClick={()=>persist({item:"memo",day:0,memo})}>메모 저장</button></section>
 <section className="panel"><h2>추가 예정 유형</h2><p className="muted">현재 목표와 달성률에서는 제외됩니다.</p><div className="chips">{["R2S","ESSAY","SST","L_FIB_TYPE","HIW"].map(t=><span key={t}>{t}</span>)}</div></section>
 <p className="muted">체크는 서버에 자동 저장됩니다. 다른 기기로 이동한 뒤 페이지를 열거나 다시 활성화하면 기록을 불러옵니다. 두 기기에서 같은 항목을 동시에 바꾸면 마지막으로 저장한 값이 적용됩니다.</p></main>
}
