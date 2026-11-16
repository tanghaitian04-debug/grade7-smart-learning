export type Term='upper'|'lower'
export type Question={id:string,type:string,prompt:string,options:string[],answer:string,why:string}
export type Lesson={id:string,title:string,goal:string,explain:string[],life:string,focus:string,example:string,steps:string[],simple:string,hint:string,questions:Question[]}
export type Chapter={name:string,lessons:Lesson[]}
export type Subject={id:string,name:string,edition:string,sources:{title:string,url:string}[],upper:Chapter[],lower:Chapter[]}
export type Entry=Lesson & {sub:Subject,term:Term,chapter:Chapter}
