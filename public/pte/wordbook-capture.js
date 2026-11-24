(function(){
 "use strict";
 if(window.JarvisWordbook)return;
 const css=".jw-open{position:fixed;z-index:9997;top:14px;right:14px;background:#1b2737;color:#eaf1fb;border:1px solid #42546b;border-radius:999px;padding:9px 13px;text-decoration:none;font:700 13px system-ui;box-shadow:0 5px 18px #0006}.jw-select{position:fixed;z-index:9998;left:50%;bottom:22px;transform:translateX(-50%);background:#62d394;color:#102019;border:0;border-radius:999px;padding:13px 18px;font:800 15px system-ui;box-shadow:0 8px 24px #0008;display:none;cursor:pointer}.jw-shade{position:fixed;z-index:9999;inset:0;background:#05080dcc;display:none;align-items:center;justify-content:center;padding:14px;font:15px system-ui;color:#eef3f8}.jw-shade.open{display:flex}.jw-box{width:min(560px,100%);max-height:92vh;overflow:auto;background:#171d26;border:1px solid #36465b;border-radius:16px;padding:20px;box-shadow:0 20px 70px #0009}.jw-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px}.jw-head h2{font-size:21px;margin:0}.jw-x{background:transparent;border:0;color:#bac5d3;font-size:25px;cursor:pointer}.jw-note{font-size:13px;color:#9aa7b8;line-height:1.5;margin:8px 0}.jw-label{display:block;font-size:13px;color:#b9c4d2;margin:12px 0 5px}.jw-input,.jw-area,.jw-select-source{width:100%;box-sizing:border-box;background:#0f151e;color:#eef3f8;border:1px solid #41536a;border-radius:9px;padding:11px;font:15px/1.5 system-ui}.jw-area{min-height:70px;resize:vertical}.jw-actions{display:flex;gap:10px;margin-top:14px}.jw-save,.jw-cancel{flex:1;border:0;border-radius:9px;padding:12px;background:#62d394;color:#10151d;font-weight:850;font-size:15px;cursor:pointer}.jw-cancel{background:#273242;color:#eef3f8}.jw-save:disabled{opacity:.55;cursor:wait}.jw-status{min-height:18px;color:#9aa7b8;font-size:13px}.jw-definition{background:#10161f;border-radius:8px;padding:10px;color:#b9c4d2;font-size:13px;line-height:1.5;display:none}.jw-audio{width:100%;height:38px;display:none;margin-top:8px}.jw-token{all:unset;display:inline;cursor:pointer;border-radius:4px}.jw-token:hover{background:#28384b;color:#fff}.jw-token:focus-visible{outline:2px solid #6ea8ff}";
 const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
 const openLink=document.createElement("a");openLink.className="jw-open";openLink.href="/pte/vocabulary";openLink.textContent="📚 내 단어장";document.body.appendChild(openLink);
 const selectButton=document.createElement("button");selectButton.type="button";selectButton.className="jw-select";selectButton.textContent="📚 선택한 단어 단어장에 저장";document.body.appendChild(selectButton);
 const shade=document.createElement("div");shade.className="jw-shade";shade.innerHTML='<section class="jw-box" role="dialog" aria-modal="true" aria-labelledby="jw-title"><div class="jw-head"><h2 id="jw-title">단어장에 저장</h2><button class="jw-x" type="button" aria-label="닫기">×</button></div><div class="jw-status" aria-live="polite"></div><label class="jw-label">영어 단어</label><input class="jw-input jw-word" readonly><label class="jw-label">한국어 뜻</label><textarea class="jw-area jw-meaning" placeholder="자동으로 찾지 못하면 직접 적어도 됩니다."></textarea><label class="jw-label">발음기호</label><input class="jw-input jw-phonetic" placeholder="예: /ˈmætʃ/"><audio class="jw-audio" controls></audio><div class="jw-definition"></div><label class="jw-label">원문 예문</label><textarea class="jw-area jw-example"></textarea><label class="jw-label">출처</label><select class="jw-select-source"><option value="WFD">WFD</option><option value="RA">RA</option><option value="RS">RS</option><option value="SST">SST</option><option value="OTHER">기타</option></select><div class="jw-actions"><button class="jw-cancel" type="button">취소</button><button class="jw-save" type="button">저장</button></div></section>';
 document.body.appendChild(shade);
 const q=s=>shade.querySelector(s),status=q(".jw-status"),wordInput=q(".jw-word"),meaningInput=q(".jw-meaning"),phoneticInput=q(".jw-phonetic"),exampleInput=q(".jw-example"),sourceInput=q(".jw-select-source"),audio=q(".jw-audio"),definition=q(".jw-definition"),saveButton=q(".jw-save");
 let selectedWord="",meaningEdited=false;
 function sourceHere(){const p=location.pathname.toLowerCase();if(p.includes("/ra"))return "RA";if(p.includes("/rs"))return "RS";if(p.includes("/sst"))return "SST";if(p.includes("/wfd"))return "WFD";return "OTHER"}
 function exampleHere(range,selected){let node=range?.commonAncestorContainer||null;if(node&&node.nodeType!==1)node=node.parentElement;const el=node?.closest?.(".text,.sentence,.en,p,article,section");return (el?.innerText||selected||"").trim().replace(/\s+/g," ").slice(0,1200)}
 async function openCard(word,example,source){
  selectedWord=(word||"").trim().replace(/\s+/g," ").slice(0,120);if(!selectedWord)return;
  wordInput.value=selectedWord;meaningInput.value="";phoneticInput.value="";exampleInput.value=(example||"").trim().slice(0,1200);sourceInput.value=["WFD","RA","RS","SST","OTHER"].includes(source)?source:sourceHere();status.textContent="뜻과 발음을 찾는 중…";definition.style.display="none";definition.textContent="";audio.removeAttribute("src");audio.style.display="none";meaningEdited=false;shade.classList.add("open");meaningInput.focus();
  try{
   const response=await fetch("/api/vocabulary/lookup?word="+encodeURIComponent(selectedWord),{cache:"no-store"});const data=await response.json();
   if(response.status===401){status.textContent="Google 로그인 후 단어장을 사용할 수 있습니다.";return}
   if(!response.ok)throw new Error(data.error||"자동 사전을 불러오지 못했습니다.");
   if(!meaningEdited&&data.meaning)meaningInput.value=data.meaning;
   phoneticInput.value=data.phonetic||"";
   if(data.audioUrl){audio.src=data.audioUrl;audio.style.display="block"}
   if(data.definition){definition.textContent="영어 사전 뜻: "+data.definition;definition.style.display="block"}
   status.textContent=data.meaning||data.phonetic?"자동 사전 결과를 확인하고 저장하세요.":"자동 검색 결과가 없습니다. 뜻을 직접 입력할 수 있습니다.";
  }catch{status.textContent="자동 검색에 실패했습니다. 뜻은 직접 입력해 저장할 수 있습니다."}
 }
 function closeCard(){shade.classList.remove("open")}
 function pickedSelection(){
  const sel=window.getSelection();const text=(sel?.toString()||"").trim().replace(/\s+/g," ");
  if(!text||text.length>120||!/^[A-Za-z][A-Za-z'’ -]*$/.test(text)){selectButton.style.display="none";return}
  selectedWord=text;selectButton.style.display="block";
 }
 selectButton.addEventListener("click",function(){const sel=window.getSelection(),range=sel&&sel.rangeCount?sel.getRangeAt(0):null;openCard(selectedWord,exampleHere(range,selectedWord),sourceHere());selectButton.style.display="none"});
 document.addEventListener("mouseup",function(e){if(e.target.closest(".jw-shade,.jw-select,.jw-open"))return;setTimeout(pickedSelection,0)});
 document.addEventListener("touchend",function(e){if(e.target.closest(".jw-shade,.jw-select,.jw-open"))return;setTimeout(pickedSelection,80)},{passive:true});
 window.addEventListener("jarvis-wordbook-add",function(e){const d=e.detail||{};openCard(d.word,d.example,d.source)});
 meaningInput.addEventListener("input",function(){meaningEdited=true});
 q(".jw-x").addEventListener("click",closeCard);q(".jw-cancel").addEventListener("click",closeCard);shade.addEventListener("click",function(e){if(e.target===shade)closeCard()});
 document.addEventListener("keydown",function(e){if(e.key==="Escape")closeCard()});
 saveButton.addEventListener("click",async function(){
  if(!selectedWord)return;saveButton.disabled=true;status.textContent="저장 중…";
  try{
   const response=await fetch("/api/vocabulary",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({word:selectedWord,meaning:meaningInput.value,phonetic:phoneticInput.value,audio_url:audio.src||"",example:exampleInput.value,source:sourceInput.value})});
   const data=await response.json();if(response.status===401)throw new Error("Google 로그인 후 저장할 수 있습니다.");if(!response.ok)throw new Error(data.error||"저장하지 못했습니다.");
   status.textContent="단어장에 저장했습니다.";window.dispatchEvent(new CustomEvent("jarvis-wordbook-saved",{detail:data.entry}));setTimeout(closeCard,650);
  }catch(error){status.textContent=error.message||"저장에 실패했습니다."}
  finally{saveButton.disabled=false}
 });
 window.JarvisWordbook={add:openCard};
})();