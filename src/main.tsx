import {useEffect,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {subjects,lessons} from './data'
import type {Term} from './types'
import {Home} from './pages/Home'
import {Catalog,Reader} from './pages/Learning'
import {Practice,Errors} from './pages/Practice'
import {Profile} from './pages/Profile'
import Icon from './components/Icon'
import './style.css'
const nav=[['home','layout-dashboard','学习首页'],['practice','notebook-pen','练习中心'],['errors','bookmark','错题本'],['me','chart-no-axes-column','我的学习']] as const
function App(){
 const [route,setRoute]=useState(location.hash),[term,setTerm]=useState<Term>('upper'),[warning,setWarning]=useState(false)
 useEffect(()=>{const change=()=>{setRoute(location.hash);window.scrollTo(0,0)},warn=()=>setWarning(true);window.addEventListener('hashchange',change);window.addEventListener('storage-failed',warn);return ()=>{window.removeEventListener('hashchange',change);window.removeEventListener('storage-failed',warn)}},[])
 const [page,id,vol,ch]=route.replace(/^#\/?/,'').split('/'),sub=subjects.find(s=>s.id===id),lesson=lessons.find(l=>l.id===id),active=['practice','errors','me'].includes(page)?page:'home'
 const links=nav.map(([p,icon,label])=><a key={p} aria-current={active===p?'page':undefined} href={'#/'+p}><Icon name={icon}/>{label}</a>)
 return <div className="app"><aside><a className="brand" href="#/home"><i><Icon name="book-open" size={23}/></i>初一智慧课堂</a><div className="navLabel">学习空间</div><nav>{links}</nav><div className="sidefoot"><Icon name="graduation-cap"/><div>七年级学习空间<small>山东 · 济宁邹城</small></div></div></aside><main><header><a href="#/home"><Icon name="library" size={19}/> 初一智慧课堂</a><span><Icon name="calendar-days" size={16}/> {new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'long'}).format(new Date())}</span></header><div className="content">{warning&&<p role="alert">当前浏览器无法保存学习记录，请在离开前导出备份。</p>}{!page||page==='home'?<Home term={term} setTerm={setTerm}/>:page==='subject'&&sub?<Catalog key={route} sub={sub} term={vol==='lower'?'lower':'upper'}/>:page==='lesson'&&lesson?<Reader key={id} l={lesson}/>:page==='practice'?<Practice key={route} args={[id,vol,ch]}/>:page==='errors'?<Errors/>:page==='me'?<Profile/>:<div className="box">找不到这个页面。<a href="#/home">返回首页</a></div>}<footer>初一智慧课堂　·　独立学习辅助平台<br/>面向邹城七年级学生与家长，与学校及教育主管部门无隶属关系。</footer></div></main><nav className="mobile">{links}</nav></div>
}
createRoot(document.getElementById('root')!).render(<App/>)
