import {useState} from 'react'
import Icon from '../components/Icon'
import {subjects,lessons,termName} from '../data'
import {useRecords} from '../hooks/records'
import type {Term} from '../types'
export const art={
 chinese:['文','feather','#b75c50','#f6e6df'], math:['π','ruler','#3c72ad','#e3edf9'], english:['Aa','languages','#a67731','#f4ebd7'], history:['史','landmark','#85623d','#f0e5d6'], geo:['地','globe','#318079','#dfefea'], bio:['生','sprout','#5b8355','#e8efdf'], civics:['法','scale','#836398','#eee6f5']
} as const
export function Home({term,setTerm}:{term:Term,setTerm:(v:Term)=>void}){
 const d=useRecords(),[text,setText]=useState('')
 const list=lessons.filter(l=>l.term===term),recent=list.filter(l=>d.visits[l.id]).sort((a,b)=>d.visits[b.id]-d.visits[a.id])
 const featured=recent[0]||list.find(l=>l.id==='math-signed')||list[0]
 const mastered=list.filter(l=>d.states[l.id]==='已掌握').length
 const results=list.filter(l=>[l.title,l.chapter.name,l.sub.name,...l.explain].join(' ').toLowerCase().includes(text.trim().toLowerCase()))
 return <><div className="homehead"><div><small className="eyebrow">七年级 · 学习工作台</small><h1>学习首页</h1></div><label className="search"><Icon name="search"/><input aria-label="搜索知识点" placeholder="搜索课程与知识点" value={text} onChange={e=>setText(e.target.value)}/></label></div>{text.trim()&&<div className="box"><h3>本册搜索结果 · {results.length}</h3>{results.map(l=><a className="row" key={l.id} href={'#/lesson/'+l.id}>{l.sub.name} · {l.title} ›</a>)}</div>}
 {featured&&<section className="hero"><div className="heroCopy"><div className="heroLabel"><Icon name="bookmark" size={16}/>{recent.length?'继续上次学习':'今日推荐课程'}</div><small>{featured.sub.name}　/　七年级{termName(term)}</small><h2>{featured.title}</h2><p>{featured.goal}</p><a className="primary" href={'#/lesson/'+featured.id}>{recent.length?'继续学习':'开始学习'} <Icon name="arrow-right" size={17}/></a></div><div className="heroArt" aria-hidden="true"><div className="sheet back"></div><div className="sheet front"><i>STUDY NOTES</i><b>{featured.sub.name==='数学'?'数轴笔记':'课堂笔记'}</b>{featured.sub.name==='数学'?<><strong>−2　−1　 0　+1　+2</strong><div className="axis">●────●────●────●────●</div></>:<div className="noteLines"/>}<div className="pencil"/></div></div></section>}
 <div className="sectionHead"><div><h2>我的课程</h2><p>选择学科，按章节开始学习</p></div><div className="segment">{(['upper','lower'] as Term[]).map(t=><button aria-pressed={term===t} key={t} onClick={()=>setTerm(t)}>{termName(t)}</button>)}</div></div>
 <div className="grid">{subjects.map(s=>{const [glyph,icon,color,bg]=art[s.id as keyof typeof art],n=list.filter(l=>l.sub===s).length;return <a className="course" key={s.id} href={'#/subject/'+s.id+'/'+term}><div className="cover" style={{background:bg,color}}><div className="book" style={{background:color}}><Icon name={icon} size={21}/><em>{glyph}</em></div></div><div className="courseInfo"><h3>{s.name}</h3><small>{s[term].length} 个章节 · {n} 个知识点</small></div><Icon name="chevron-right" size={16}/></a>})}</div>
 <div className="homeBottom"><section className="box"><h3><Icon name="target"/> 学习进度</h3><p>本册已掌握 <b>{mastered}</b> / {list.length} 个开放知识点</p><progress value={mastered} max={list.length||1}/><p><a href="#/me">查看我的学习 →</a></p></section><section className="box"><h3><Icon name="clock-3"/> 最近学习记录</h3>{recent.length?recent.slice(0,3).map(l=><a className="row" href={'#/lesson/'+l.id} key={l.id}>{l.title} ›</a>):<p>打开第一节课后，这里会保存你的阅读记录。</p>}</section></div></>
}
