import type {CSSProperties} from 'react'
import icons from './icons.json'
export default function Icon({name,size=20,style}:{name:keyof typeof icons,size?:number,style?:CSSProperties}){
return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{icons[name].map(([tag,attrs],i)=>{const Tag=tag as 'path';return <Tag key={i} {...attrs as object}/>})}</svg>}
