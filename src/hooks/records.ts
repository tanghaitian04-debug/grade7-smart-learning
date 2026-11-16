import {useSyncExternalStore} from 'react'
import {bank,lessons} from '../data'
export const statuses=['未学习','学习中','已掌握','需要复习'] as const
type Status=typeof statuses[number]
type Attempt={id:string,value:string,time:number}
type Records={version:1,states:Record<string,Status>,visits:Record<string,number>,attempts:Attempt[],errors:Record<string,Attempt>}
const key='grade7.classroom.v1'
const blank=():Records=>({version:1,states:{},visits:{},attempts:[],errors:{}})
const obj=(x:unknown)=>!!x&&typeof x==='object'&&!Array.isArray(x)
const isLesson=(id:string)=>lessons.some(l=>l.id===id)
function validAttempt(a:Attempt){return obj(a)&&bank.some(q=>q.id===a.id)&&typeof a.value==='string'&&Number.isFinite(a.time)}
export function validate(raw:string):Records{
 const d=JSON.parse(raw)
 if(!obj(d)||d.version!==1||!obj(d.states)||!obj(d.visits)||!Array.isArray(d.attempts)||!obj(d.errors))throw Error('记录格式不正确')
 if(!Object.entries(d.states).every(([id,s])=>isLesson(id)&&statuses.includes(s as Status))||!Object.entries(d.visits).every(([id,t])=>isLesson(id)&&Number.isFinite(t))||!d.attempts.every(validAttempt)||!Object.entries(d.errors).every(([id,v])=>validAttempt(v as Attempt)&&(v as Attempt).id===id))throw Error('记录内容与当前课程不匹配')
 return d
}
let data=blank()
try{const value=localStorage.getItem(key);if(value)data=validate(value)}catch{}
const subs=new Set<()=>void>()
function notify(){subs.forEach(f=>f())}
export function save(d:Records){data=d;try{localStorage.setItem(key,JSON.stringify(d))}catch{window.dispatchEvent(new Event('storage-failed'))}notify()}
window.addEventListener('storage',e=>{if(e.key===key){try{data=e.newValue?validate(e.newValue):blank();notify()}catch{}}})
export function useRecords(){return useSyncExternalStore(cb=>{subs.add(cb);return ()=>subs.delete(cb)},()=>data)}
export function visit(id:string){save({...data,visits:{...data.visits,[id]:Date.now()},states:{...data.states,[id]:data.states[id]||'学习中'}})}
export function setStatus(id:string,s:Status){save({...data,states:{...data.states,[id]:s}})}
export const equal=(a:string,b:string)=>a.normalize('NFKC').trim().toLowerCase().replace(/−/g,'-')===b.normalize('NFKC').trim().toLowerCase().replace(/−/g,'-')
export function grade(id:string,value:string){const q=bank.find(q=>q.id===id)!;const a={id,value,time:Date.now()};const errors={...data.errors};if(equal(value,q.answer))delete errors[id];else errors[id]=a;save({...data,errors,attempts:[...data.attempts,a]})}
export function clearErrors(ids:string[]){save({...data,errors:Object.fromEntries(Object.entries(data.errors).filter(([id])=>!ids.includes(id)))})}
