import {useEffect,useState} from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import {lessons,termName} from '../data'
import type {Entry,Subject,Term} from '../types'
import {statuses,useRecords,setStatus,visit} from '../hooks/records'
import {Quiz} from '../components/Quiz'
import {Speech} from '../components/Speech'
import {Tutor} from '../components/Tutor'
import Icon from '../components/Icon'
import {marks} from '../design/subjects'

export function Catalog({sub,term}:{sub:Subject,term:Term}){
 const d=useRecords()
 return <>
  <div className="titleGroup" data-subject={sub.id}>
    <div className="subjectMark"><Icon name={marks[sub.id].icon} size={26}/></div>
    <div><small>学科书架 / 七年级{termName(term)}</small><h1>{sub.name}</h1></div>
  </div>
  <div className="tools">{(['upper','lower'] as Term[]).map(t=><a key={t} aria-current={t===term?'page':undefined} href={'#/subject/'+sub.id+'/'+t}>{termName(t)}目录</a>)}</div>
  <details className="box"><summary>教材与核验依据</summary><p>{sub.edition}</p><p>本学年十二中实际用书待核对。</p>
    {sub.sources.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></p>)}
  </details>
  <h2>章节目录</h2>
  {sub[term].map((ch,i)=><details className="box chapter" key={ch.name} open={ch.lessons.length>0||undefined}>
    <summary>{ch.name}<small>　{ch.lessons.length?ch.lessons.filter(l=>d.states[l.id]==='已掌握').length+'/'+ch.lessons.length+' 已掌握':'0 个知识点 · 内容建设中'}</small></summary>
    {ch.lessons.map(l=><a className="row" href={'#/lesson/'+l.id} key={l.id}><b>{l.title}</b><span>{d.states[l.id]||'进入学习'} ›</span></a>)}
    {ch.lessons.length>0&&<a className="lineLink" href={'#/practice/'+sub.id+'/'+term+'/'+i}>章节复习与练习 →</a>}
  </details>)}
 </>
}
export function Reader({l}:{l:Entry}){
 const d=useRecords(),[size,setSize]=useState(18)
 useEffect(()=>{visit(l.id)},[l.id])
 const link='#/subject/'+l.sub.id+'/'+l.term, peers=lessons.filter(x=>x.sub===l.sub&&x.term===l.term),next=peers[peers.indexOf(l)+1],previous=peers[peers.indexOf(l)-1]
 function prose(s:string){return s.split(/(\$[^$]+\$)/g).map((p,i)=>p.startsWith('$')&&p.endsWith('$')?<span key={i} dangerouslySetInnerHTML={{__html:katex.renderToString(p.slice(1,-1),{throwOnError:false})}}/>:p)}
 return <article className="reader"><a href={link}>‹ 返回{l.sub.name}目录</a><p className="eyebrow">{l.sub.name} / 七年级{termName(l.term)} / {l.chapter.name}</p><h1>{l.title}</h1><div className="tools"><select aria-label="阅读字号" value={size} onChange={e=>setSize(+e.target.value)}>{[16,18,21,24].map(s=><option key={s} value={s}>{s} 号字</option>)}</select><Speech paragraphs={[l.title,l.goal,...l.explain,l.life,l.focus]}/></div><div className="paper" style={{fontSize:size}}><section className="callout"><b>学习目标</b><p>{l.goal}</p></section><h2>知识讲解</h2>{l.explain.map((p,i)=><p key={i}>{prose(p)}</p>)}{l.id==='math-signed'&&<figure className="numberline"><figcaption>以校门为零点，向东为正</figcaption><div>{['−2','−1','0','+1','+2'].map(n=><span key={n}>{n}</span>)}</div><small>西 ← 距离（米） → 东</small></figure>}<h2>生活中的例子</h2><p>{prose(l.life)}</p><h2>重点与易错点</h2><p className="keyPoint">{prose(l.focus)}</p><section className="worked"><h2>典型例题</h2><b>{prose(l.example)}</b><ol>{l.steps.map((s,i)=><li key={i}>{prose(s)}</li>)}</ol></section><Tutor lesson={l}/></div><section className="box"><h2>随堂练习</h2><Quiz key={l.id} questions={l.questions}/></section><div className="box"><label>学习状态　<select value={d.states[l.id]||'未学习'} onChange={e=>setStatus(l.id,e.target.value as typeof statuses[number])}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><nav className="readerNav" aria-label="知识点翻页">{previous&&<a href={'#/lesson/'+previous.id}>‹ 上一节 · {previous.title}</a>}<a href={next?'#/lesson/'+next.id:link}>{next?'下一节 · '+next.title:'返回章节目录'} →</a></nav></div><small>{l.sub.edition}</small></article>
}
