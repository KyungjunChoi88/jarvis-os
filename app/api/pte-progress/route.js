import {getServerSession} from "next-auth";
import {authOptions} from "../../../lib/auth";
import {validWeek,validEntry} from "../../../lib/pte-progress";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
const json=(data,status=200)=>Response.json(data,{status,headers});
async function context(){
 const session=await getServerSession(authOptions);
 if(!session?.user?.email)return {error:json({error:"Google 로그인이 필요합니다."},401)};
 const url=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return {error:json({error:"공부 기록 서버 설정이 필요합니다. 관리자에게 문의하세요."},503)};
 return {user:session.user.email.toLowerCase(),url:url.replace(/\/$/,"")+"/rest/v1/pte_progress",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json"}};
}
export async function GET(request){
 const c=await context();if(c.error)return c.error;
 const week=new URL(request.url).searchParams.get("week");
 if(!validWeek(week))return json({error:"올바른 주차를 선택하세요."},400);
 try{
 const query=new URLSearchParams({user_id:"eq."+c.user,week_start:"eq."+week,select:"item,day,done,memo"});
 const response=await fetch(c.url+"?"+query,{headers:c.headers,cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(!response.ok)return json({error:"서버 기록을 불러오지 못했습니다. 저장소 설정을 확인하세요."},502);
 return json({entries:await response.json()});
 }catch{return json({error:"서버 연결에 실패했습니다. 다시 시도하세요."},502)}
}
export async function PUT(request){
 if(request.headers.get("origin")!==new URL(request.url).origin)return json({error:"허용되지 않은 요청입니다."},403);
 const c=await context();if(c.error)return c.error;
 let body;try{if(Number(request.headers.get("content-length"))>24000)return json({error:"요청이 너무 큽니다."},413);body=await request.json()}catch{return json({error:"잘못된 요청입니다."},400)}
 if(!validWeek(body.week)||!validEntry(body))return json({error:"잘못된 공부 기록입니다."},400);
 const row={user_id:c.user,week_start:body.week,item:body.item,day:body.day,done:body.item==="memo"?false:body.done,memo:body.item==="memo"?body.memo:"",updated_at:new Date().toISOString()};
 try{
 const response=await fetch(c.url+"?on_conflict=user_id,week_start,item,day",{method:"POST",headers:{...c.headers,Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(row),signal:AbortSignal.timeout(10000)});
 if(!response.ok)return json({error:"서버 저장에 실패했습니다. 다시 시도하세요."},502);
 return json({saved:true});
 }catch{return json({error:"서버 연결에 실패했습니다. 다시 시도하세요."},502)}
}
