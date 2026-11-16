import {useState} from 'react'
import {bank,subjects,lessons,termName} from '../data'
import {Quiz} from '../components/Quiz'
import {useRecords,clearErrors} from '../hooks/records'
import type {Term} from '../types'
export function Practice({args}:{args:string[]}){
 const [subject,setSubject]=useState(subjects.find(s=>s.id===args[0])?.id||subjects[0]?.id),[term,setTerm]=useState<Term>(args[1]==='lower'?'lower':'upper'),[ch,setCh]=useState(args[2]??'all')
 const sub=subjects.find(s=>s.id===subject);if(!sub)return null
 const pool=bank.filter(q=>q.lesson.sub===sub&&q.lesson.term===term&&(ch==='all'||q.lesson.chapter===sub[term][+ch]))
 return <><small>自主练习</small><h1>练习中心</h1><p>按章节巩固知识，或选择整册已开放的题目进行阶段测试。</p><div className="box tools"><select aria-label="学科" value={subject} onChange={e=>{setSubject(e.target.value);setCh('all')}}>{subjects.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select><select aria-label="册别" value={term} onChange={e=>{setTerm(e.target.value as Term);setCh('all')}}><option value="upper">上册</option><option value="lower">下册</option></select><select aria-label="章节" value={ch} onChange={e=>setCh(e.target.value)}><option value="all">阶段测试 · 已开放章节</option>{sub[term].map((c,i)=><option key={i} value={i}>{c.name}</option>)}</select></div><section className="box"><h2>{sub.name} · {termName(term)}练习</h2><p>共 {pool.length} 题</p><Quiz key={subject+term+ch} questions={pool}/></section></>
}
export function Errors(){const d=useRecords(),[filter,setFilter]=useState('all'),[retry,setRetry]=useState(''),[confirm,setConfirm]=useState(false)
 const qs=bank.filter(q=>d.errors[q.id]&&(filter==='all'||q.lesson.sub.id===filter))
 return <><small>温故知新</small><h1>错题本</h1><div className="tools"><select aria-label="错题学科" value={filter} onChange={e=>{setFilter(e.target.value);setConfirm(false)}}><option value="all">全部学科</option>{subjects.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select>{qs.length>0&&<button onClick={()=>{if(confirm)clearErrors(qs.map(q=>q.id));setConfirm(!confirm)}}>{confirm?'确认清除当前筛选错题':'清除当前筛选'}</button>}</div>{qs.length===0&&<div className="box"><h2>当前没有错题</h2><p>提交练习后，答错的题会在这里保留。重练答对后自动移出。</p><a href="#/practice">进入练习中心 →</a></div>}{qs.map(q=><div className="box" key={q.id}><small>{q.lesson.sub.name} / <a href={'#/lesson/'+q.lesson.id}>{q.lesson.title}</a></small><h3>{q.prompt}</h3>{retry===q.id?<Quiz questions={[q]}/>:<><p>你的答案：{d.errors[q.id].value}</p><p>正确答案：{q.answer}</p><p>{q.why}</p><button onClick={()=>setRetry(q.id)}>再练一次</button></>}</div>)}</>}
