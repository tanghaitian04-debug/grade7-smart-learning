import assert from 'node:assert/strict'
import {readdirSync,readFileSync} from 'node:fs'
const files=readdirSync('src/data').filter(f=>f.endsWith('.json'))
const subjects=files.flatMap(f=>JSON.parse(readFileSync('src/data/'+f,'utf8')))
const ids=new Set(),que=new Set()
assert.equal(new Set(subjects.map(s=>s.id)).size,7)
for(const s of subjects){
 assert(s.sources.length&&s.edition&&s.lower.length)
 assert(s.upper.filter(c=>c.lessons.length).length>=2)
 for(const c of [...s.upper,...s.lower])for(const l of c.lessons){
  assert(!ids.has(l.id));ids.add(l.id)
  for(const field of ['title','goal','life','focus','example','hint','simple'])assert(l[field]?.trim(),l.id+' '+field)
  assert(l.explain.length>=2&&l.steps.length>=2&&l.questions.length>=2)
  for(const q of l.questions){assert(!que.has(q.id));que.add(q.id);assert(q.why&&q.answer&&q.prompt);assert(q.type==='填空'||q.options.includes(q.answer))}
 }
}
console.log(subjects.length+' subjects, '+ids.size+' lessons, '+que.size+' unique graded questions.')
