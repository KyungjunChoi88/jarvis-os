export const TYPES = [
["RA","2 SET","스피킹"],["RS","3 SET","스피킹"],["DI","10문항","스피킹"],
["RT","3 SET","스피킹"],["SGD","5 SET","스피킹"],["SWT","5 SET","라이팅"],["WFD","10개 테스트 + 보충","라이팅 연습"]];
export function dateKey(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
export function weekStart(value){const d=new Date(value+"T12:00:00");if(!Number.isFinite(d.getTime())||dateKey(d)!==value)throw Error("잘못된 날짜입니다.");d.setDate(d.getDate()-(d.getDay()+6)%7);return dateKey(d)}
export function validWeek(v){try{return typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&weekStart(v)===v}catch{return false}}
export function validEntry(e){return e&&((TYPES.some(t=>t[0]===e.item)&&Number.isInteger(e.day)&&e.day>=0&&e.day<7&&typeof e.done==="boolean")||(e.item==="memo"&&e.day===0&&typeof e.memo==="string"&&e.memo.length<=5000))}
