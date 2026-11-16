import type {Lesson} from '../types'
export function Tutor({lesson:l}:{lesson:Lesson}){return <details className="box"><summary>我没听懂 · 分层讲解</summary><small>预先编写的学习提示</small><p>{l.simple}</p><b>先试着想一想</b><p>{l.hint}</p></details>}
