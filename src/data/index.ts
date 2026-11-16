import type {Subject,Entry,Term} from '../types'
const files=import.meta.glob<Subject[]>('./*.json',{eager:true,import:'default'})
const order=['chinese','math','english','history','geo','bio','civics']
export const subjects=Object.values(files).flat().sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id))
export const lessons:Entry[]=subjects.flatMap(sub=>(['upper','lower'] as Term[]).flatMap(term=>sub[term].flatMap(chapter=>chapter.lessons.map(lesson=>({...lesson,sub,term,chapter})))))
export const bank=lessons.flatMap(lesson=>lesson.questions.map(q=>({...q,lesson})))
export const termName=(t:Term)=>t==='upper'?'上册':'下册'
