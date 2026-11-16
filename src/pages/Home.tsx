import {useState, type CSSProperties} from 'react'
import Icon from '../components/Icon'
import {subjects,lessons,termName} from '../data'
import {marks} from '../design/subjects'
import {useRecords} from '../hooks/records'
import type {Term} from '../types'

export function Home({term,setTerm}:{term:Term,setTerm:(v:Term)=>void}){
  const d=useRecords(), [text,setText]=useState('')
  const list=lessons.filter(l=>l.term===term)
  const recent=list.filter(l=>d.visits[l.id]).sort((a,b)=>d.visits[b.id]-d.visits[a.id])
  const featured=recent[0]||list.find(l=>l.id==='math-signed')||list[0]
  const mastered=list.filter(l=>d.states[l.id]==='已掌握').length
  const percent=list.length?Math.round(mastered/list.length*100):0
  const suggested=list.find(l=>d.states[l.id]==='需要复习')||list.find(l=>!d.visits[l.id])||featured
  const results=list.filter(l=>[l.title,l.chapter.name,l.sub.name,...l.explain].join(' ').toLowerCase().includes(text.trim().toLowerCase()))
  return <>
    <div className="homehead">
      <div><small className="eyebrow">七年级 · {termName(term)}学习空间</small><h1>欢迎来到智慧课堂</h1></div>
      <label className="search"><Icon name="search"/><input aria-label="搜索知识点" type="search" placeholder="搜索本册知识点" value={text} onChange={e=>setText(e.target.value)}/></label>
    </div>
    {text.trim()&&<section className="box"><h2>本册搜索结果 · {results.length}</h2>{results.length===0&&<p>试试学科名或知识点中的关键词。</p>}{results.map(l=><a className="row" key={l.id} href={'#/lesson/'+l.id}>{l.sub.name} · {l.title} ›</a>)}</section>}
    <div className="spotlight">
      {featured&&<section className="hero">
        <div className="heroCopy"><div className="heroLabel"><Icon name="book-open" size={17}/>{recent.length?'继续上次学习':'今日推荐课程'}</div>
          <h2>{featured.title}</h2><p>{featured.goal}</p>
          <a className="primary" href={'#/lesson/'+featured.id}>{recent.length?'继续学习':'开始学习'} <Icon name="arrow-right" size={17}/></a>
        </div>
        <div className="folio" aria-hidden="true"><div className="volume second"/><div className="volume first"><span>{featured.sub.name}</span><Icon name={marks[featured.sub.id].icon} size={42}/><i>七年级{termName(term)}</i></div></div>
      </section>}
      <section className="progressCard"><h2><Icon name="target"/>本册学习进度</h2>
        <div className="progressBody"><div className="ring" style={{'--angle':percent+'%'} as CSSProperties}><b>{percent}<small>%</small></b></div>
        <p><strong>{mastered} / {list.length}</strong><small>已掌握知识点</small></p></div>
        <a className="lineLink" href="#/me">查看学习记录 <Icon name="arrow-right" size={16}/></a>
      </section>
    </div>
    <div className="sectionHead"><div><h2>学科书架</h2><p>选择学科，进入章节目录</p></div>
      <div className="segment" aria-label="选择册别">{(['upper','lower'] as Term[]).map(t=><button type="button" aria-pressed={term===t} key={t} onClick={()=>setTerm(t)}>{termName(t)}</button>)}</div>
    </div>
    <div className="grid">{subjects.map(s=>{
      const n=list.filter(l=>l.sub===s).length
      return <a className="course" data-subject={s.id} key={s.id} href={'#/subject/'+s.id+'/'+term}>
        <div className="subjectMark"><Icon name={marks[s.id].icon} size={24}/></div>
        <div><h3>{s.name}</h3><small>{s[term].length} 个章节 · {n} 个知识点</small></div><Icon name="chevron-right" size={16}/>
      </a>})}
    </div>
    <div className="homeBottom"><section className="box"><h2><Icon name="lightbulb"/>今日学习建议</h2>
      {suggested&&<a className="row" href={'#/lesson/'+suggested.id}>{d.states[suggested.id]==='需要复习'?'复习':'读一读'}：{suggested.title} ›</a>}
      <a className="lineLink" href="#/practice">进入练习中心 <Icon name="arrow-right" size={16}/></a>
    </section><section className="box"><h2><Icon name="clock-3"/>最近学习</h2>{recent.length?recent.slice(0,3).map(l=><a className="row" href={'#/lesson/'+l.id} key={l.id}>{l.title} ›</a>):<p>读完第一节课后，可以从这里接着学。</p>}</section></div>
  </>
}
