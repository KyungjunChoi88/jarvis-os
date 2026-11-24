import {getServerSession} from "next-auth";
import {authOptions} from "../../../../lib/auth";

export const dynamic="force-dynamic";
const json=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
const WORD=/^[A-Za-z][A-Za-z'’ -]{0,119}$/;

export async function GET(request){
 const session=await getServerSession(authOptions);
 if(!session?.user?.email)return json({error:"Google 로그인이 필요합니다."},401);
 const word=(new URL(request.url).searchParams.get("word")||"").trim().replace(/\s+/g," ");
 if(!WORD.test(word))return json({error:"영어 단어를 확인해 주세요."},400);
 const encoded=encodeURIComponent(word);
 const dictionaryPromise=word.includes(" ")?Promise.resolve(null):fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+encoded,{cache:"no-store",signal:AbortSignal.timeout(7000)}).then(r=>r.ok?r.json():null).catch(()=>null);
 const translationPromise=fetch("https://api.mymemory.translated.net/get?q="+encoded+"&langpair=en%7Cko",{cache:"no-store",signal:AbortSignal.timeout(7000)}).then(r=>r.ok?r.json():null).catch(()=>null);
 const [dictionary,translation]=await Promise.all([dictionaryPromise,translationPromise]);
 const entry=Array.isArray(dictionary)?dictionary[0]:null;
 const phonetics=entry?.phonetics||[];
 const phonetic=entry?.phonetic||phonetics.find(x=>x.text)?.text||"";
 let audioUrl=phonetics.find(x=>x.audio)?.audio||"";
 if(audioUrl.startsWith("//"))audioUrl="https:"+audioUrl;
 const definition=entry?.meanings?.flatMap(m=>(m.definitions||[]).map(d=>d.definition)).find(Boolean)||"";
 let meaning=translation?.responseData?.translatedText||"";
 if(meaning.toLowerCase()===word.toLowerCase()||meaning==="MYMEMORY WARNING: TOO MANY REQUESTS")meaning="";
 return json({word,meaning,phonetic,audioUrl,definition});
}
