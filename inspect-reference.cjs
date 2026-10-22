const { chromium } = require('C:/Users/bukha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
(async()=>{
 const browser = await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage();
 await page.goto('file:///C:/Users/bukha/Downloads/Aireo/reference.mp4');
 await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
 const duration=await page.evaluate(()=>document.querySelector('video').duration);
 console.log('Duration',duration); fs.mkdirSync('qa',{recursive:true});
 for(let i=0;i<6;i++){
  await page.evaluate(async t=>{const v=document.querySelector('video');v.pause();v.currentTime=t;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));const c=document.createElement('canvas');c.width=960;c.height=540;c.getContext('2d').drawImage(v,0,0,960,540);return true},Math.max(.1,duration*i/6));
  await page.screenshot({path:'qa/reference-'+i+'.jpg'});
 }
 await browser.close();
})();

