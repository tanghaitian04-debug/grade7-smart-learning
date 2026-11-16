import {useEffect,useRef,useState} from 'react'
export function Speech({paragraphs}:{paragraphs:string[]}){
 const [rate,setRate]=useState(1),[status,setStatus]=useState(''),token=useRef(0)
 const api=window.speechSynthesis
 useEffect(()=>()=>{token.current++;api?.cancel()},[api])
 function stop(){token.current++;api.cancel();setStatus('')}
 function start(){stop();const epoch=token.current;function read(i:number){if(epoch!==token.current)return;if(i>=paragraphs.length){setStatus('');return}const u=new SpeechSynthesisUtterance(paragraphs[i]);u.lang='zh-CN';u.rate=rate;u.onend=()=>read(i+1);u.onerror=()=>{if(token.current===epoch)setStatus('当前设备无法朗读，请检查系统语音。')};api.speak(u)}setStatus('正在朗读');read(0)}
 return api?<div className="tools"><button onClick={start}>朗读讲解</button><select aria-label="朗读速度" value={rate} onChange={e=>{stop();setRate(+e.target.value)}}>{[0.8,1,1.2,1.5].map(r=><option key={r} value={r}>{r} 倍速</option>)}</select>{status&&<><button onClick={stop}>停止</button><small>{status}</small></>}</div>:<small>当前浏览器不支持语音朗读。</small>
}
