import {getServerSession} from "next-auth";
import {authOptions} from "../../../lib/auth";

export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store"};
const json=(data,status=200)=>Response.json(data,{status,headers:noStore});
const select="id,sentence_key,sentence_id,sentence,meaning,stars,audio_url,source_revision,consecutive_correct,memorized,last_reviewed_at,created_at,updated_at";
function validOrigin(request){return request.headers.get("origin")===new URL(request.url).origin;}
async function context(){
 const session=await getServerSession(authOptions);
 if(!session?.user?.email)return {error:json({error:"Google 로그인이 필요합니다."},401)};
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return {error:json({error:"리비전 저장소 설정이 필요합니다."},503)};
 return {user:session.user.email.toLowerCase(),url:url.replace(/\/$/,"")+"/rest/v1/pte_wfd_revision",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json"}};
}
async function findByKey(c,key){
 const q=new URLSearchParams({user_id:"eq."+c.user,sentence_key:"eq."+key,select,limit:"1"});
 const r=await fetch(c.url+"?"+q,{headers:c.headers,cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw Error("find failed");return (await r.json())[0]||null;
}
async function updateById(c,id,changes){
 const q=new URLSearchParams({user_id:"eq."+c.user,id:"eq."+id,select});
 const r=await fetch(c.url+"?"+q,{method:"PATCH",headers:{...c.headers,Prefer:"return=representation"},body:JSON.stringify(changes),signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw Error("update failed");return (await r.json())[0]||null;
}
export async function GET(){
 const c=await context();if(c.error)return c.error;
 try{
  const q=new URLSearchParams({user_id:"eq."+c.user,select,order:"created_at.asc"});
  const r=await fetch(c.url+"?"+q,{headers:c.headers,cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(!r.ok)return json({error:"리비전 문장을 불러오지 못했습니다."},502);
  return json({entries:await r.json()});
 }catch{return json({error:"리비전 서버에 연결하지 못했습니다."},502)}
}
export async function POST(request){
 if(!validOrigin(request))return json({error:"허용되지 않은 요청입니다."},403);
 const c=await context();if(c.error)return c.error;
 let body;try{if(Number(request.headers.get("content-length"))>12000)return json({error:"요청이 너무 큽니다."},413);body=await request.json()}catch{return json({error:"잘못된 요청입니다."},400)}
 try{
  if(body?.action==="add"){
   const key=typeof body.sentence_key==="string"?body.sentence_key.trim():"";
   const sentence=typeof body.sentence==="string"?body.sentence.trim():"";
   const sentenceId=Number(body.sentence_id);
   if(!key||key.length>500||!sentence||sentence.length>1200||!Number.isInteger(sentenceId)||sentenceId<1)return json({error:"리비전 문장 정보를 확인해 주세요."},400);
   const metadata={sentence_id:sentenceId,sentence,meaning:typeof body.meaning==="string"?body.meaning.slice(0,1600):"",stars:typeof body.stars==="string"?body.stars.slice(0,20):"",audio_url:typeof body.audio_url==="string"?body.audio_url.slice(0,1000):"",source_revision:typeof body.source_revision==="string"?body.source_revision.slice(0,40):"",updated_at:new Date().toISOString()};
   if(metadata.audio_url){try{const parsed=new URL(metadata.audio_url,request.url);if(parsed.protocol!=="https:"||parsed.origin!==new URL(request.url).origin)return json({error:"음성 주소는 HTTPS 같은 사이트 주소만 저장할 수 있습니다."},400);metadata.audio_url=parsed.href}catch{return json({error:"음성 주소가 올바르지 않습니다."},400)}}
   const existing=await findByKey(c,key);
   if(existing){const entry=await updateById(c,existing.id,metadata);return json({entry,existing:true})}
   const row={...metadata,user_id:c.user,sentence_key:key};
   let r=await fetch(c.url+"?select="+encodeURIComponent(select),{method:"POST",headers:{...c.headers,Prefer:"return=representation"},body:JSON.stringify(row),signal:AbortSignal.timeout(10000)});
   if(r.status===409){const duplicate=await findByKey(c,key);if(duplicate){const entry=await updateById(c,duplicate.id,metadata);return json({entry,existing:true})}}
   if(!r.ok)return json({error:"리비전 저장에 실패했습니다."},502);
   return json({entry:(await r.json())[0]||null,existing:false});
  }
  if(body?.action==="review"){
   if(typeof body.id!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id)||typeof body.correct!=="boolean")return json({error:"복습 결과를 확인해 주세요."},400);
   const q=new URLSearchParams({user_id:"eq."+c.user,id:"eq."+body.id,select,limit:"1"});
   const r=await fetch(c.url+"?"+q,{headers:c.headers,cache:"no-store",signal:AbortSignal.timeout(10000)});
   if(!r.ok)return json({error:"리비전 문장을 찾지 못했습니다."},502);
   const row=(await r.json())[0];if(!row)return json({error:"리비전 문장을 찾지 못했습니다."},404);
   const count=row.memorized?3:body.correct?Math.min(3,row.consecutive_correct+1):0;
   const entry=await updateById(c,row.id,{consecutive_correct:count,memorized:count>=3,last_reviewed_at:new Date().toISOString(),updated_at:new Date().toISOString()});
   return json({entry});
  }
  return json({error:"요청 유형을 확인해 주세요."},400);
 }catch{return json({error:"리비전 서버에 연결하지 못했습니다."},502)}
}
export async function DELETE(request){
 if(!validOrigin(request))return json({error:"허용되지 않은 요청입니다."},403);
 const c=await context();if(c.error)return c.error;
 let body;try{body=await request.json()}catch{return json({error:"잘못된 요청입니다."},400)}
 if(typeof body?.id!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id))return json({error:"리비전 문장을 확인해 주세요."},400);
 try{
  const q=new URLSearchParams({user_id:"eq."+c.user,id:"eq."+body.id});
  const r=await fetch(c.url+"?"+q,{method:"DELETE",headers:{...c.headers,Prefer:"return=minimal"},signal:AbortSignal.timeout(10000)});
  if(!r.ok)return json({error:"리비전 삭제에 실패했습니다."},502);
  return json({deleted:true});
 }catch{return json({error:"리비전 서버에 연결하지 못했습니다."},502)}
}
