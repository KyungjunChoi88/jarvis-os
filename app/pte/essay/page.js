"use client";
import { useEffect, useMemo, useRef, useState } from "react";
const PROMPT_KO=["오늘날 기술의 발전은 우리의 삶을 변화시키고 있습니다. 이것은 이로운가요? 최근 발명품 하나를 설명하고, 그것이 사회에 미친 긍정적 또는 부정적 영향을 설명하세요.","인공지능은 교육 분야에서 유용합니다. 이에 어느 정도 동의하나요?","인공지능의 발전이 윤리적 우려를 낳는다는 데 동의하나요?","현금 없는 거래가 전통적인 화폐를 어느 정도 대체할 것이라고 생각하나요?","현대 대중매체가 일으킨 정보 혁명은 개인과 사회에 긍정적·부정적 결과를 모두 가져왔습니다. 이것이 좋은지 나쁜지 자신의 경험을 들어 논의하세요.","현대 대중매체로 인한 정보 혁명은 개인과 사회에 긍정적·부정적 결과를 모두 가져왔습니다. 이 의견에 어느 정도 동의하거나 반대하나요? 자신의 경험을 들어 논의하세요.","TV, 라디오, 신문을 포함한 대중매체는 우리 사회에 영향을 주고 의견과 성격을 형성합니다. 이에 대해 어떻게 생각하나요?","TV, 라디오, 신문과 같은 대중매체는 특히 젊은 세대에게 영향을 줍니다. 청소년과 젊은이들의 의견을 형성하는 데 중요한 역할을 한다는 주장에 어느 정도 동의하나요? 예를 들어 설명하세요.","오늘날 TV는 생활의 필수적인 부분이 되었습니다. 뉴스와 인식을 전달하는 매체이며, 어떤 사람들에게는 동반자 역할도 합니다. 이에 대해 어떻게 생각하나요?","많은 교육 제도는 정식 필기시험으로 학생을 평가합니다. 이런 시험은 타당한 평가 방법이라는 의견에 어느 정도 동의하거나 반대하나요?","체험학습(직접 해보며 배우는 것)은 정규 교육에서 효과적일 수 있다는 의견이 있습니다. 반면 전통적인 교수 방식이 가장 좋다고 보는 사람들도 있습니다. 고등학교나 대학에서 체험학습이 효과적일 수 있다고 생각하나요?","온라인 디지털 자료가 늘어나면서 도서관의 역할은 쓸모없어졌습니다. 대학은 계속 개정되는 교재 대신 디지털 자료만 구입해야 한다는 주장에 대해 장단점을 논의하고 자신의 견해를 제시하세요.","대중음악을 전공하는 대학 학위 과정이 있어야 할까요? 동의하나요, 반대하나요?","이상적인 세상에서는 모든 청년이 대학에 가야 합니다. 이 주장에 동의하나요? 이유는 무엇인가요?","해외 유학은 과대평가되었다는 주장이 있습니다. 국내에서 공부하는 학자들도 많습니다. 이에 어느 정도 동의하나요?","성공적인 학자가 되려면 여행이 중요한 요소일까요? 어떤 사람들은 학자들이 책을 읽으면 되고 거주지를 떠날 필요는 없다고 생각합니다. 이에 어느 정도 동의하나요? 이유를 설명하세요.","인공지능 같은 첨단 기술은 외국어를 쉽게 번역할 수 있습니다. 그래도 외국어를 배우는 것이 필요하다고 생각하나요? 자신의 경험을 들어 의견을 뒷받침하세요.","오늘날 사람들은 직장에 너무 많은 시간을 써서 개인적·사적인 생활을 할 시간이 거의 없습니다. 이 문제는 얼마나 널리 퍼져 있나요? 시간 부족은 어떤 문제를 일으킬까요?","직장과 개인 생활 사이의 적절한 균형을 유지하는 것이 중요합니다. 이 문제는 얼마나 널리 퍼져 있으며 어떤 문제를 일으킬 수 있나요?","미래에는 사람들이 직장에서 일하는 시간이 줄어들 것입니다. 이에 어느 정도 동의하나요? 자신의 경험을 들어 의견을 뒷받침하세요.","청년 실업은 심각한 문제입니다. 더 많은 사람을 고용하기 위해 근무 주간을 단축하자는 제안이 있습니다. 이 접근의 장점과 단점은 무엇인가요? 청년에게만 적용해야 할까요, 전체 노동자에게 적용해야 할까요?","일부 회사에서는 고용주가 제품과 서비스에 관한 의사결정 과정에 직원들을 참여시킵니다. 이런 정책의 장점과 단점은 무엇인가요?","회사의 최고 경영진은 직원들을 의사결정 과정에 참여시켜야 합니다. 이에 대해 논의하세요.","경쟁이 개인 생활과 직장 생활의 질을 높인다고 주장하는 사람들이 있습니다. 반면 과도한 경쟁은 개인과 사회 전반에 해롭다고 보는 사람들도 있습니다. 여러분의 의견은 무엇인가요?","고소득 집단에 최고 임금 상한선을 두어야 할까요? 이것은 좋은 정책인가요, 나쁜 정책인가요? 이 주장에 어느 정도 동의하나요? 이유나 근거를 제시하세요.","많은 사람은 직장 때문에 개인 생활을 할 시간이 부족하다고 느낍니다. 이 문제는 얼마나 널리 퍼져 있나요? 시간 부족으로 생기는 문제를 어떻게 해결할 수 있을까요?","법은 인간의 행동을 변화시킨다고 믿는 사람들이 있습니다. 이에 어느 정도 동의하거나 반대하나요?","연령 제한은 어디에서나 볼 수 있습니다. 결혼이나 운전처럼 적정 연령에 도달하기 전에는 어떤 일을 해서는 안 된다고 여겨집니다. 한 가지 활동을 선택하고 적절한 최소 연령을 제시한 뒤 자신의 경험으로 설명하세요.","연령 제한은 많은 활동에 적용됩니다. 결혼, 운전, 투표, 특정 제품 구매 등은 적정 연령이 될 때까지 해서는 안 된다고 여겨집니다. 예를 하나 들고 적정 최소 연령을 제시한 뒤 자신의 경험을 이야기하세요.","건물 설계는 사람들이 살고 일하는 장소에 긍정적·부정적으로 어떤 영향을 미치나요?","점점 더 많은 나라가 현대 주택 대신 건물 복원에 많은 돈을 씁니다. 이 의견에 어느 정도 동의하거나 반대하나요? 경험이나 예를 들어 설명하세요.","많은 나라가 현대 주택보다 역사적 건물 복원에 많은 돈을 씁니다. 이 의견에 어느 정도 동의하거나 반대하나요? 장점과 단점은 무엇인가요? 경험이나 예를 들어 설명하세요.","비용이 많이 들더라도 과거의 아름다운 건물을 보존하는 것은 중요합니다. 이에 어느 정도 동의하거나 반대하나요?","도시가 확장되면 정부는 자동차 소유자를 위한 도로를 더 짓기보다 대중교통망을 개선해야 합니다. 이 주장에 어느 정도 동의하나요? 이유를 제시하세요.","시골에서 사는 것과 도시 생활 중 어느 쪽을 선호하나요? 예시나 개인 경험으로 의견을 뒷받침하세요.","대형 쇼핑몰이 소규모 상점을 대체하고 있습니다. 긍정적인 효과는 무엇이라고 생각하나요?","개발도상국에서 관광은 단점이 있지만 반대 의견도 있습니다. 이에 대한 여러분의 생각은 무엇인가요?","저개발국에서 관광의 단점은 장점만큼이나 큽니다. 이 주장을 논의하고 자신의 의견을 설명하세요.","새로운 곳을 여행할 때 먼저 지역 박물관을 방문하는 사람들이 꽤 많습니다. 사람들이 박물관 방문을 좋아하는 이유를 논의하세요.","세계 각국의 정부와 조직은 수많은 문제에 직면해 있습니다. 지구에 사는 사람들에게 가장 시급한 문제는 무엇이며 해결책은 무엇인가요?","기후변화 연구를 맡게 되었다고 가정해 봅시다. 어떤 연구 분야를 선택하고 싶으며 그 이유는 무엇인가요? 선택한 분야의 사례를 들어 설명하세요.","바이오플라스틱 사용이 플라스틱 오염을 줄이는 데 중요한 단계라는 데 동의하나요?","요즘 우주여행은 주목받고 있지만 환경 문제처럼 우리가 집중해야 할 사안도 많습니다. 공공자금 배분에 대해 어떻게 생각하나요?","기후변화는 우려가 큰 세계적 문제입니다. 정부, 대기업, 개인 중 누가 이 문제를 해결하기 위한 조치를 취할 주된 책임이 있나요?","의료 기술은 평균 수명 증가의 원인입니다. 이것은 축복이라고 생각하나요, 저주라고 생각하나요?","한 연구에 따르면 여성은 남성보다 더 많은 돌봄이 필요할 수 있습니다. 이에 어느 정도 동의하나요?","학교를 마치거나 직장을 구하기 전에 결혼하는 것은 어리석다는 주장이 있습니다. 이에 어느 정도 동의하거나 반대하나요?","학교를 마치거나 직장을 구하기 전에 결혼하는 것은 좋은 선택이 아니라는 주장이 있습니다.","과거보다 21세기에 아이들이 자라는 것이 더 어렵습니다. 동의하나요, 반대하나요?","과거보다 21세기에 아이들이 살아가고 성장하는 것이 더 어려워지고 있습니다. 동의하나요, 반대하나요?","성공한 스포츠 스타와 화려한 영화배우는 젊은이들의 롤모델이 됩니다. 이에 찬성하나요?","유명한 연예인이나 운동선수는 명성의 대가로 사생활을 포기해야 한다는 주장이 있습니다. 이에 어느 정도 동의하거나 반대하나요? 자신의 경험을 들어 의견을 뒷받침하세요.","제품이나 서비스에 불만을 제기할 때 어떤 사람들은 글로 전달하고, 다른 사람들은 직접 말하기를 선호합니다. 어느 방식을 더 선호하나요?"];
const G={
"the technological world":"기술의 세계","changing our life":"우리의 삶을 변화시키는 것","being on society":"사회에 미치는 것","describing a recent invention":"최근 발명품을 설명하는 것",
"new technology":"새로운 기술","artificial intelligence":"인공지능","smart phones":"스마트폰","digital tools":"디지털 도구","mobile banking":"모바일 뱅킹","easy daily life":"편리한 일상생활","fast information":"빠른 정보","being good in the teaching field":"교육 분야에서 유용한 것",
"the rise of artificial intelligence":"인공지능의 발전","raising ethical concerns":"윤리적 우려를 높이는 것","responsible use":"책임 있는 사용","privacy problems":"개인정보 문제","machine mistakes":"기계의 실수","computer decisions":"컴퓨터의 결정","online safety":"온라인 안전","future society":"미래 사회","technology rules":"기술 관련 규칙","human control":"인간의 통제",
"cashless transactions":"현금 없는 거래","replacing traditional money":"전통적인 화폐를 대체하는 것","ATM":"현금자동입출금기","online banking":"온라인 뱅킹","coins and notes":"동전과 지폐","secure transaction":"안전한 거래","easy payments":"간편한 결제",
"the information revolution":"정보 혁명","modern mass communication":"현대 대중매체","positiving consequences for individuals":"개인에게 미치는 긍정적 결과","positiving consequences for society":"사회에 미치는 긍정적 결과","negativing consequences for individuals":"개인에게 미치는 부정적 결과","negativing consequences for society":"사회에 미치는 부정적 결과",
"mass media":"대중매체","TV programs":"TV 프로그램","online news":"온라인 뉴스","social modia":"소셜 미디어","fake news":"가짜 뉴스","good learning programs":"유익한 교육 프로그램","social media":"소셜 미디어","media messages":"미디어 메시지","public opinion":"여론","the mass media":"대중매체","TV":"TV","radio":"라디오","newspapers":"신문","influencing our society":"우리 사회에 영향을 주는 것","shaping our opinions and characters":"우리의 의견과 성격을 형성하는 것","screen time":"화면 시청 시간","media habits":"미디어 이용 습관","on younger generations":"젊은 세대에게","having an influence on people":"사람들에게 영향을 미치는 것","playing a pivotal role":"중요한 역할을 하는 것","shaping the opinions of people":"사람들의 의견을 형성하는 것","daily information":"일상 정보","strong awareness":"높은 인식","personal opinion":"개인 의견","news influence":"뉴스의 영향",
"becoming an essential part of life":"생활의 필수적인 부분이 되는 것","being a medium to spread news":"뉴스를 전달하는 매체인 것","being a medium to spread awareness":"인식을 넓히는 매체인 것","acting like a companion":"동반자 역할을 하는 것","TV news access":"TV 뉴스 이용","daily public information":"일상적인 공공 정보","educational TV programs":"교육용 TV 프로그램","TV companionship for lonely viewers":"외로운 시청자에게 TV가 동반자가 되는 것","less loneliness for older people":"고령자의 외로움 감소","too much tv time":"지나친 TV 시청 시간","passive TV watching":"수동적인 TV 시청","less real social contact":"실제 사회적 접촉 감소",
"experiential learning":"체험 학습","learning by doing":"직접 해보며 배우기","test result":"시험 결과","student learning":"학생의 학습","school pressure":"학교 부담","class projects":"수업 프로젝트","group work":"그룹 활동","education quality":"교육의 질","digital book":"전자책","online learning":"온라인 학습","textbook learning":"교과서 학습","useful knowledge":"유용한 지식","study skills":"학습 기술","school library":"학교 도서관","pop music":"대중음악","music class":"음악 수업","creative talent":"창의적 재능","future career":"미래 직업","teacher support":"교사의 지원","every young person":"모든 청년","going to university":"대학에 진학하는 것",
"studying overseas":"해외 유학","being overrated":"과대평가되는 것","studying locally":"국내에서 공부하는 것","local education":"국내 교육","study cost":"학업 비용","living expenses":"생활비","language problems":"언어 문제","cultural differences":"문화 차이","learning environment":"학습 환경","travel experience":"여행 경험","foreign countries":"외국","new culture":"새로운 문화","global communication":"세계적 소통","translation apps":"번역 앱","speaking skills":"말하기 능력","language confidence":"언어에 대한 자신감",
"work stress":"업무 스트레스","long working hours":"긴 근무 시간","family time":"가족과 보내는 시간","free time":"자유 시간","life balance":"삶의 균형","work problems":"직장 문제","job pressure":"업무 압박","company rules":"회사 규정","job opportunities":"취업 기회","shorter workweek":"주당 근무 시간 단축","income gap":"소득 격차","fair pay":"공정한 임금","unemployment":"실업","young people":"젊은 사람들","team support":"팀의 지원","office competition":"직장 내 경쟁","team decisions":"팀의 결정","worker ideas":"직원의 아이디어","high salaries":"높은 급여","hyper-competition":"과도한 경쟁","a maximum wage":"최고 임금 상한선","high-paying groups":"고소득 집단",
"law rules":"법률 규정","legal age":"법적 연령","age limits":"연령 제한","safety rules":"안전 규칙","adult responsibility":"성인의 책임","good judgment":"올바른 판단","life experience":"인생 경험","public safety":"공공 안전","minimum age":"최소 연령","driving license":"운전면허",
"modern housing":"현대 주택","old buildings":"오래된 건물","historical places":"역사적 장소","housing problems":"주택 문제","government money":"정부 예산","public budget":"공공 예산","building repair cost":"건물 수리 비용","culture value":"문화적 가치","local history":"지역 역사","future generations":"미래 세대","city planning":"도시 계획","community pride":"지역사회의 자부심",
"public transport":"대중교통","road traffic":"도로 교통","busy streets":"복잡한 거리","big parking areas":"넓은 주차장","daily convenience":"일상의 편리함","quiet environment":"조용한 환경","fresh air":"맑은 공기","city jobs":"도시 일자리","shopping malls":"쇼핑몰","small shops":"작은 상점","low prices":"저렴한 가격","food courts":"푸드코트",
"tourism":"관광","developing countries":"개발도상국","advantages":"장점","disadvantages":"단점","local museums":"지역 박물관","new places":"새로운 장소",
"climate change":"기후변화","air pollution":"대기 오염","water pollution":"수질 오염","plastic pollution":"플라스틱 오염","ocean pollution":"해양 오염","global hunger":"세계 기아","war":"전쟁","green energy":"친환경 에너지","environmental issues":"환경 문제","environmental protection":"환경 보호","government action":"정부 조치","environmental budget":"환경 예산","green products":"친환경 제품","space travel":"우주여행","clean air":"깨끗한 공기","global cooperation":"국제 협력","social responsibility":"사회적 책임",
"medical technology":"의료 기술","longer life":"더 긴 수명","health problems":"건강 문제","hospital care":"병원 치료","healthcare cost":"의료비","new medicine":"신약","money problems":"경제적 문제","antibiotics":"항생제","women":"여성","elderly people":"노인","family care":"가족 돌봄","women’s health":"여성 건강","men’s health":"남성 건강","early marriage":"이른 결혼","job preparation":"취업 준비","life decisions":"인생의 결정","future plans":"미래 계획","family responsibility":"가족에 대한 책임","school life":"학교생활","busy life":"바쁜 생활","time management":"시간 관리","work-life balance":"일과 생활의 균형","living cost":"생활비",
"children today":"오늘날의 아이들","modern life":"현대 생활","study stress":"학업 스트레스","family problems":"가정 문제","mental stress":"정신적 스트레스","busy schedules":"바쁜 일정","mobile phones":"휴대전화","online platforms":"온라인 플랫폼","global competition":"세계적 경쟁","movie stars":"영화배우","famous people":"유명인","life goals":"인생의 목표","today’s youth":"오늘날의 청소년","sports stars":"스포츠 스타","bad behavior":"나쁜 행동","customer service":"고객 서비스","customers service":"고객 서비스","product problems":"제품 문제","service problems":"서비스 문제","clear messages":"명확한 전달","customer’s feedback":"고객 의견","problem solving":"문제 해결","service quality":"서비스 품질","customer’s experience":"고객 경험"
};
function parse(source){
 const b=source.split(/\n[ \t]*\n/).map(x=>x.trim()).filter(Boolean);
 const isQ=x=>/^Q\d{2}-\d{2}\s*$/m.test(x)||x.split("\n").some(l=>l.length>45&&/[.?]/.test(l)&&!/[가-힣]/.test(l));
 const at=[];b.forEach((x,i)=>{if(isQ(x))at.push(i)});
 return at.map((bi,n)=>{
  const block=b[bi],rawId=(block.match(/Q\d{2}-\d{2}/)||[])[0];
  const prompt=block.split("\n").filter(l=>!/^Q\d{2}-\d{2}$/.test(l.trim())&&!/^논점:/.test(l.trim())).join(" ").replace(/\s+/g," ").trim();
  const keys=[];
  for(let j=bi+1;j<(at[n+1]??b.length);j++)for(const line of b[j].split("\n")){
   const t=line.trim();
   if(!t||/^논점:/.test(t)||/^예시 논지/.test(t)||/^\d{2}\s+[가-힣]/.test(t)||/^the 명사/.test(t)||/^(Work,|Education|Technology|Media|Study Abroad|Law|Architecture|Tourism|Environment|Health|Children|Urban|Consumer)/i.test(t))continue;
   const inline=t.match(/^(.+?)\s+([가-힣].*)$/);
   keys.push({en:(inline?inline[1]:t).trim(),ko:(inline?inline[2]:"").trim()});
  }
  return {id:rawId||`Q${n+1}`,prompt,ko:PROMPT_KO[n]||((block.match(/논점:\s*([^|\n]+)/)||[])[1]||"").trim(),keys};
 });
}
const normalize=x=>x.toLowerCase().replace(/[.,!?;:]/g,"").replace(/\s+/g," ").trim();
function gloss(k){return k.ko||G[k.en]||"뜻 추가 예정";}
export default function EssayPage(){
 const [source,setSource]=useState(""),[loading,setLoading]=useState(true),[query,setQuery]=useState(""),[practice,setPractice]=useState(false),[reveal,setReveal]=useState({}),[answers,setAnswers]=useState({}),[selected,setSelected]=useState(0);
 const [progress,setProgress]=useState({statuses:{},lastIndex:0,lastId:"",lastStudiedAt:""}),[progressSync,setProgressSync]=useState("진도 기록 불러오는 중"),[progressLoaded,setProgressLoaded]=useState(false),[authRequired,setAuthRequired]=useState(false);
 const saveQueue=useRef(Promise.resolve()),progressKey="jarvis-essay-progress-v1",progressWeek="2000-01-03";
 useEffect(()=>{fetch("/essay-keywords.txt").then(r=>r.text()).then(setSource).finally(()=>setLoading(false));},[]);
 useEffect(()=>{
  let active=true;
  const readLocal=()=>{try{return JSON.parse(localStorage.getItem(progressKey)||"{}")}catch{return {}}};
  (async()=>{
   const local=readLocal(),empty=!local||!Object.keys(local.statuses||{}).length;
   try{
    const r=await fetch("/api/pte-progress?week="+progressWeek,{cache:"no-store"}),data=await r.json();
    if(!r.ok){const e=Error(data.error||"server unavailable");e.status=r.status;throw e}
    const raw=data.entries?.find(x=>x.item==="memo")?.memo||"",saved=raw?JSON.parse(raw):{};
    const remote=saved.essayProgress;
    const loaded=remote&&typeof remote==="object"?remote:(empty?{statuses:{},lastIndex:0,lastId:"",lastStudiedAt:""}:local);
    if(active){setProgress(loaded);setSelected(Number.isInteger(loaded.lastIndex)?loaded.lastIndex:0);setProgressSync("기기 간 기록 연결됨");setProgressLoaded(true)}
    if(!remote&&!empty) persistProgress(loaded);
   }catch(error){
    if(active){setProgress(local);setSelected(Number.isInteger(local.lastIndex)?local.lastIndex:0);setAuthRequired(error.status===401);setProgressSync(error.status===401?"이 기기에 저장 중":"이 기기에 저장됨 · 서버 연결을 확인해 주세요");setProgressLoaded(true)}
   }
  })();
  return()=>{active=false};
 },[]);
 const all=useMemo(()=>parse(source),[source]);
 const items=useMemo(()=>all.map((x,index)=>({...x,index})).filter(x=>!query||[x.prompt,x.ko,...x.keys.map(k=>k.en)].join(" ").toLowerCase().includes(query.toLowerCase())),[all,query]);
 const ci=items.findIndex(x=>x.index===selected), item=items[ci>=0?ci:0];
 const completeCount=all.filter(x=>progress.statuses?.[x.id]==="done").length;
 const activeCount=all.filter(x=>progress.statuses?.[x.id]==="learning").length;
 const progressPercent=all.length?Math.round(completeCount/all.length*100):0;
 function persistProgress(next){
  setProgress(next);
  try{localStorage.setItem(progressKey,JSON.stringify(next))}catch{}
  setProgressSync("저장 중…");
  const memo=JSON.stringify({essayProgress:next});
  saveQueue.current=saveQueue.current.catch(()=>{}).then(async()=>{
   const r=await fetch("/api/pte-progress",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({week:progressWeek,item:"memo",day:0,memo})});
   if(!r.ok){const data=await r.json().catch(()=>({}));const e=Error(data.error||"save failed");e.status=r.status;throw e}
   setAuthRequired(false);setProgressSync("다른 기기와 동기화됨");
  }).catch(e=>{if(e.status===401)setAuthRequired(true);setProgressSync(e.status===401?"이 기기에 저장됨":"이 기기에 저장됨 · 서버 연결을 확인해 주세요")});
 }
 function openQuestion(index){
  const q=all[index];if(!q)return;
  const statuses={...(progress.statuses||{})};
  if(!statuses[q.id])statuses[q.id]="learning";
  const next={...progress,statuses,lastIndex:index,lastId:q.id,lastStudiedAt:new Date().toISOString()};
  setSelected(index);persistProgress(next);
 }
 function setCurrentStatus(status){
  if(!item)return;
  const statuses={...(progress.statuses||{})};
  if(status==="new")delete statuses[item.id];else statuses[item.id]=status;
  persistProgress({...progress,statuses,lastIndex:item.index,lastId:item.id,lastStudiedAt:new Date().toISOString()});
 }
 useEffect(()=>{
  if(!progressLoaded||!all.length)return;
  const index=Math.min(Math.max(progress.lastIndex||0,0),all.length-1);
  setSelected(index);openQuestion(index);
 },[progressLoaded,all.length]);
 const btn={minHeight:40,border:"1px solid #444",borderRadius:8,padding:"0 12px",background:"#252525",color:"#fff",cursor:"pointer"};
 const card={border:"1px solid #303030",background:"#181818",borderRadius:12,padding:"20px clamp(16px,3vw,28px)",marginTop:18};
 const label={fontWeight:800,fontSize:16,margin:"18px 0 10px"};
 const doneCount=completeCount, untouchedCount=Math.max(0,all.length-doneCount-activeCount);
 return <main style={{minHeight:"100vh",padding:"24px clamp(14px,3vw,36px)",background:"#111",color:"#f5f5f5",fontFamily:"Inter, Pretendard, 'Noto Sans KR', system-ui, sans-serif"}}><div style={{maxWidth:1000,margin:"0 auto"}}>
 <a href="/" style={{color:"#bbb",textDecoration:"none"}}>← JARVIS 홈</a><header style={{margin:"20px 0 16px"}}><div style={{fontSize:13,color:"#b8b8b8",fontWeight:700}}>PTE 에세이 키워드 연습</div><h1 style={{fontSize:"clamp(26px,4vw,36px)",margin:"7px 0 10px"}}>지문 · 해석 · 키워드</h1><p style={{color:"#c3c3c3",lineHeight:1.6}}>내가 정리한 키워드는 그대로 두고, 뜻을 보며 직접 입력해 연습할 수 있어요.</p></header>
 <section style={{...card,marginTop:12,padding:16}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",alignItems:"center"}}><strong>내 에세이 진도</strong><span style={{color:"#aaa",fontSize:13}}>{progressSync}{authRequired&&<a href="/api/auth/signin?callbackUrl=%2Fpte%2Fessay" style={{color:"#9ec9ff",marginLeft:8}}>Google 로그인해 기기 간 동기화</a>}</span></div>
  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:12,fontSize:14}}><span>완료 {doneCount}/{all.length}</span><span>학습 중 {activeCount}</span><span>미학습 {untouchedCount}</span><span>{progressPercent}%</span></div>
  <div style={{height:8,background:"#333",borderRadius:9,overflow:"hidden",marginTop:10}}><div style={{height:"100%",width:progressPercent+"%",background:"#62d394",transition:"width .2s"}}/></div>
  <div style={{fontSize:12,color:"#aaa",marginTop:9}}>마지막 학습 문항: {progress.lastId||"아직 없음"}</div>
 </section>
 <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) auto",gap:10}}><input value={query} onChange={e=>{setQuery(e.target.value);setSelected(0)}} placeholder="문항 또는 지문 검색" aria-label="문항 검색" style={{minWidth:0,minHeight:44,padding:"0 12px",borderRadius:8,border:"1px solid #444",background:"#1b1b1b",color:"#fff",fontSize:15}}/><button type="button" onClick={()=>{setPractice(v=>!v);setReveal({});setAnswers({})}} style={{...btn,background:practice?"#315d40":"#252525"}}>{practice?"연습 종료":"키워드 가리고 연습"}</button></div>
 {loading?<p style={{marginTop:20}}>지문을 불러오는 중...</p>:!item?<p style={{marginTop:20}}>검색 결과가 없습니다.</p>:<>
 <div style={{display:"flex",alignItems:"center",gap:8,marginTop:16}}><button style={btn} disabled={ci<=0} onClick={()=>openQuestion(items[Math.max(0,ci-1)].index)}>이전</button><select aria-label="문항 선택" value={item.index} onChange={e=>openQuestion(Number(e.target.value))} style={{minHeight:40,flex:1,minWidth:0,borderRadius:8,border:"1px solid #444",background:"#1b1b1b",color:"#fff",padding:"0 8px"}}>{items.map(x=><option key={x.index} value={x.index}>{progress.statuses?.[x.id]==="done"?"✓ ":progress.statuses?.[x.id]==="learning"?"▶ ":"○ "}{x.id} · {x.prompt.slice(0,65)}{x.prompt.length>65?"…":""}</option>)}</select><button style={btn} disabled={ci>=items.length-1} onClick={()=>openQuestion(items[Math.min(items.length-1,ci+1)].index)}>다음</button></div>
 <section style={card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:18}}><strong style={{fontSize:18}}>{item.id}</strong><label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#ccc"}}>진도 상태<select aria-label="현재 문항 진도 상태" value={progress.statuses?.[item.id]||"new"} onChange={e=>setCurrentStatus(e.target.value)} style={{minHeight:38,borderRadius:8,border:"1px solid #444",background:"#202020",color:"#fff",padding:"0 8px"}}><option value="new">미학습</option><option value="learning">학습 중</option><option value="done">완료</option></select></label></div><div style={label}>지문</div><div style={{borderLeft:"4px solid #666",padding:"4px 0 4px 16px",lineHeight:1.8,color:"#eee"}}>{item.prompt}</div><div style={label}>해석</div><div style={{lineHeight:1.8,color:"#e0e0e0"}}>{item.ko||"해석 준비 중"}</div><div style={{display:"flex",justifyContent:"space-between",marginTop:24,borderBottom:"1px solid #444",paddingBottom:10}}><strong>{practice?"키워드 연습":"경준님 키워드"}</strong><strong>뜻</strong></div>
 {!item.keys.length?<p style={{padding:"14px 0",color:"#aaa"}}>이 문항의 키워드가 없습니다.</p>:item.keys.map((k,i)=>{const key=item.index+"-"+i,typed=answers[key]||"",shown=reveal[key],correct=normalize(typed)===normalize(k.en);return <div key={key} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:14,padding:"10px 0",borderBottom:"1px solid #2c2c2c",alignItems:"center"}}><div style={{minWidth:0,overflowWrap:"anywhere"}}>{practice?(shown?k.en:<div style={{display:"flex",gap:7,alignItems:"center"}}><input value={typed} onChange={e=>setAnswers(v=>({...v,[key]:e.target.value}))} placeholder="키워드를 입력하세요" aria-label={"키워드 "+(i+1)+" 입력"} style={{width:"100%",minWidth:0,minHeight:40,padding:"0 9px",borderRadius:7,border:"1px solid #444",background:"#202020",color:"#fff"}}/>{typed&&<span>{correct?"✓":"·"}</span>}</div>):k.en}</div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,color:"#ddd",overflowWrap:"anywhere"}}><span>{gloss(k)}</span>{practice&&<button type="button" onClick={()=>setReveal(v=>({...v,[key]:!v[key]}))} style={{...btn,minHeight:32,padding:"0 8px",fontSize:12,flexShrink:0}}>{shown?"정답 숨기기":"정답 보기"}</button>}</div></div>})}
 </section></>}
 <footer style={{color:"#888",fontSize:12,margin:"14px 2px 28px"}}>영어 키워드는 원본 그대로 보존했습니다. 입력은 대소문자와 문장부호 차이를 허용해 확인합니다.</footer></div></main>;
}
