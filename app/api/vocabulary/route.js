import {getServerSession} from "next-auth";
import {authOptions} from "../../../lib/auth";

export const dynamic="force-dynamic";
const noStore={"Cache-Control":"no-store"};
const json=(data,status=200)=>Response.json(data,{status,headers:noStore});

async function context(){
 const session=await getServerSession(authOptions);
 if(!session?.user?.email)return {error:json({error:"Google 로그인이 필요합니다."},401)};
 const url=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return {error:json({error:"단어장 서버 설정이 필요합니다."},503)};
 return {user:session.user.email.toLowerCase(),url:url.replace(/\/$/,"")+"/rest/v1/pte_vocabulary",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json"}};
}
function validOrigin(request){return request.headers.get("origin")===new URL(request.url).origin;}
function cleanText(value,max){return typeof value==="string"?value.trim().slice(0,max):"";}
function validWord(value){return typeof value==="string"&&value.trim().length>0&&value.trim().length<=120&&/^[A-Za-z][A-Za-z'’ -]*$/.test(value.trim());}

export async function GET(){
 const c=await context();if(c.error)return c.error;
 try{
  const query=new URLSearchParams({user_id:"eq."+c.user,select:"id,word,meaning,phonetic,audio_url,example,source,created_at,updated_at",order:"created_at.desc"});
  const response=await fetch(c.url+"?"+query,{headers:c.headers,cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(!response.ok)return json({error:"단어장을 불러오지 못했습니다."},502);
  return json({entries:await response.json()});
 }catch{return json({error:"단어장 서버에 연결하지 못했습니다."},502)}
}

export async function POST(request){
 if(!validOrigin(request))return json({error:"허용되지 않은 요청입니다."},403);
 const c=await context();if(c.error)return c.error;
 let body;try{if(Number(request.headers.get("content-length"))>12000)return json({error:"요청이 너무 큽니다."},413);body=await request.json()}catch{return json({error:"잘못된 요청입니다."},400)}
 if(!validWord(body?.word))return json({error:"영어 단어를 확인해 주세요."},400);
 const source=["WFD","RA","RS","SST","OTHER"].includes(body.source)?body.source:"OTHER";
 const row={user_id:c.user,word:body.word.trim().replace(/\s+/g," "),meaning:cleanText(body.meaning,600),phonetic:cleanText(body.phonetic,120),audio_url:cleanText(body.audio_url,1000),example:cleanText(body.example,1200),source,updated_at:new Date().toISOString()};
 if(row.audio_url){try{if(new URL(row.audio_url).protocol!=="https:")return json({error:"발음 주소는 HTTPS만 저장할 수 있습니다."},400)}catch{return json({error:"발음 주소 형식이 올바르지 않습니다."},400)}}
 try{
  const query=new URLSearchParams({on_conflict:"user_id,word_key",select:"id,word,meaning,phonetic,audio_url,example,source,created_at,updated_at"});
  const response=await fetch(c.url+"?"+query,{method:"POST",headers:{...c.headers,Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(row),signal:AbortSignal.timeout(10000)});
  if(!response.ok)return json({error:"단어 저장에 실패했습니다."},502);
  const rows=await response.json();return json({entry:rows[0]||null});
 }catch{return json({error:"단어장 서버에 연결하지 못했습니다."},502)}
}

export async function DELETE(request){
 if(!validOrigin(request))return json({error:"허용되지 않은 요청입니다."},403);
 const c=await context();if(c.error)return c.error;
 let body;try{body=await request.json()}catch{return json({error:"잘못된 요청입니다."},400)}
 if(typeof body?.id!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id))return json({error:"단어 항목을 확인해 주세요."},400);
 try{
  const query=new URLSearchParams({user_id:"eq."+c.user,id:"eq."+body.id});
  const response=await fetch(c.url+"?"+query,{method:"DELETE",headers:{...c.headers,Prefer:"return=minimal"},signal:AbortSignal.timeout(10000)});
  if(!response.ok)return json({error:"단어 삭제에 실패했습니다."},502);
  return json({deleted:true});
 }catch{return json({error:"단어장 서버에 연결하지 못했습니다."},502)}
}
