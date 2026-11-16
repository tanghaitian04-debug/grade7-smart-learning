import {useState} from 'react'
import type {Question} from '../types'
import {grade,equal} from '../hooks/records'
export function Quiz({questions}:{questions:Question[]}){
 const [values,setValues]=useState<Record<string,string>>({}),[sent,setSent]=useState(false)
 if(!questions.length)return <p>当前范围尚未开放练习。</p>
 const score=questions.filter(q=>equal(values[q.id]||'',q.answer)).length
 return <div className="quiz"><form onSubmit={e=>{e.preventDefault();if(sent)return;questions.forEach(q=>grade(q.id,values[q.id]));setSent(true)}}>{questions.map((q,i)=><fieldset key={q.id} disabled={sent}><legend><small>{String(i+1).padStart(2,'0')} / {q.type}</small>{q.prompt}</legend>{q.type==='填空'?<input aria-label={q.prompt} required value={values[q.id]||''} onChange={e=>setValues({...values,[q.id]:e.target.value})}/>:q.options.map(option=><label className="choice" key={option}><input type="radio" name={q.id} checked={values[q.id]===option} onChange={()=>setValues({...values,[q.id]:option})}/>{option}</label>)}{sent&&<div className="feedback"><b>{equal(values[q.id],q.answer)?'回答正确':'再想一想'} · 正确答案：{q.answer}</b><p>{q.why}</p></div>}</fieldset>)}{sent?<div role="status"><strong>本次答对 {score} / {questions.length} 题　</strong><button type="button" onClick={()=>{setSent(false);setValues({})}}>重新练习</button></div>:<button className="primary" disabled={questions.some(q=>!values[q.id]?.trim())}>提交答案</button>}</form></div>
}
