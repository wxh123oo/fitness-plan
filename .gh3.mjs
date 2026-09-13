import { readFileSync } from 'node:fs';
try {
  const T=process.env.GH_TOKEN, O='wxh123oo', R='fitness-plan';
  async function api(p, init={}){
    const res = await fetch('https://api.github.com'+p, { ...init, headers:{ 'Authorization':'Bearer '+T,
      'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'dsh-agent', ...(init.headers||{}) }});
    const t = await res.text(); let d; try{ d=JSON.parse(t) }catch{ d=t }
    return { status: res.status, data: d };
  }
  for (const f of ['减肥计划.html','打卡图生成器.html','发布文案.html','发布文案.md']) {
    const p = '/repos/'+O+'/'+R+'/contents/'+encodeURIComponent(f);
    const cur = await api(p);
    if (cur.status === 200) {
      const del = await api(p, { method:'DELETE', body: JSON.stringify({ message:'rename: remove '+f, sha: cur.data.sha }) });
      console.log('del', decodeURIComponent(f), del.status);
    } else console.log('del', f, 'skip', cur.status);
  }
  for (const f of ['index.html','plan.html','checkin.html','captions.html','captions.md']) {
    const p = '/repos/'+O+'/'+R+'/contents/'+encodeURIComponent(f);
    const cur = await api(p);
    const body = { message:'update '+f, content: readFileSync(f).toString('base64') };
    if (cur.status === 200) body.sha = cur.data.sha;
    const up = await api(p, { method:'PUT', body: JSON.stringify(body) });
    console.log('put', f, up.status);
  }
} catch(e){ console.log('ERR', e.message); }
