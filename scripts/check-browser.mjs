// Exercise the production build under the same subpath used by GitHub Pages.
import { chromium, webkit, devices } from 'playwright'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const base='http://127.0.0.1:4187/grade7-smart-learning/'
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--base','/grade7-smart-learning/','--port','4187','--strictPort'],{stdio:'inherit'})
const data=['english','humanities','stem'].flatMap(f=>JSON.parse(readFileSync('src/data/'+f+'.json','utf8')))
try {
 for(let i=0;i<80;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 assert((await fetch(base)).ok,'Production preview is unavailable')
 for(const [name,engine,options] of [['iPhone',webkit,devices['iPhone 13']],['Android',chromium,devices['Pixel 7']],['iPad',webkit,devices['iPad (gen 7)']],['Desktop',chromium,{viewport:{width:1440,height:900}}]]){
  const browser=await engine.launch()
  try{
   const page=await browser.newPage(options);const errors=[]
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))errors.push(r.status()+' '+r.url())})
   async function go(route){await page.goto(base+'#/'+route);await page.reload();await page.locator('h1').waitFor();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow '+route)}
   await go('home');assert.equal(await page.locator('.course').count(),7)
   await page.getByLabel('搜索知识点').fill('正数与负数');await page.getByRole('link',{name:'数学 · 正数与负数 ›'}).waitFor()
   for(const s of data)for(const t of ['upper','lower']){
    await go('subject/'+s.id+'/'+t);await page.getByRole('heading',{name:s.name,exact:true}).waitFor()
    assert.equal(await page.locator('details').count(),s[t].length+1)
    for(const c of s[t])for(const l of c.lessons){await go('lesson/'+l.id);await page.getByRole('heading',{name:l.title,exact:true}).waitFor();assert.equal(await page.locator('fieldset').count(),l.questions.length)}
   }
   await go('lesson/math-add');await page.locator('.katex').first().waitFor()
   await go('lesson/math-signed')
   await page.getByRole('radio',{name:'+12元',exact:true}).check()
   await page.getByRole('radio',{name:'错误',exact:true}).check()
   await page.getByRole('textbox').fill('-3')
   await page.getByRole('button',{name:'提交答案'}).click();await page.getByText('本次答对 2 / 3 题').waitFor()
   await page.getByLabel('学习状态').selectOption('已掌握')
   await go('errors');await page.reload();await page.getByText('你的答案：+12元').waitFor()
   await page.getByRole('button',{name:'再练一次'}).click();await page.getByRole('radio',{name:'−12元',exact:true}).check();await page.getByRole('button',{name:'提交答案'}).click()
   await page.getByRole('heading',{name:'当前没有错题'}).waitFor()
   await go('practice/math/upper/0');assert.equal(await page.locator('fieldset').count(),3)
   await go('me')
   const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'导出记录'}).click()
   const path=await (await downloaded).path();const backup=JSON.parse(readFileSync(path,'utf8'));assert.equal(backup.states['math-signed'],'已掌握');assert.equal(backup.attempts.length,4)
   const second=await browser.newPage(options);await second.goto(base+'#/me');await second.locator('input[type=file]').setInputFiles(path);await second.getByRole('button',{name:'确认替换'}).click();await second.getByText('学习记录已导入。').waitFor();await second.reload();assert.equal(await second.locator('section').filter({hasText:'最近答题'}).locator('.row').count(),4)
   assert.deepEqual(errors,[]);console.log(name+': 14 catalogs, 17 lessons, quiz grading, retry, reload and backup migration passed')
  }finally{await browser.close()}
 }
}finally{server.kill()}
