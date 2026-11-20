import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4','.vtt':'text/vtt; charset=utf-8','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
export function createStaticServer(directory=root){
 return http.createServer(async(req,res)=>{
  const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':'no-store'};
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{...headers,Allow:'GET, HEAD'});return res.end();}
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400,headers);return res.end('URL inválida');}
  const file=path.resolve(directory,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(directory+path.sep)||pathname.includes('\\')||pathname.includes('\0')){res.writeHead(403,headers);return res.end();}
  try{
   const content=await readFile(file);
   const responseHeaders={...headers,'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
   let start=0,end=content.length-1,status=200;
   if(req.headers.range){
    const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if(!match||(!match[1]&&!match[2])){res.writeHead(416,{...headers,'Content-Range':`bytes */${content.length}`});return res.end();}
    start=match[1]?Number(match[1]):Math.max(0,content.length-Number(match[2]));
    end=match[1]?(match[2]?Math.min(Number(match[2]),end):end):end;
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=content.length){res.writeHead(416,{...headers,'Content-Range':`bytes */${content.length}`});return res.end();}
    status=206;responseHeaders['Content-Range']=`bytes ${start}-${end}/${content.length}`;
   }
   res.writeHead(status,{...responseHeaders,'Content-Length':end-start+1});
   res.end(req.method==='HEAD'?undefined:content.subarray(start,end+1));
  }catch{res.writeHead(404,{...headers,'Content-Type':'text/plain; charset=utf-8'});res.end(req.method==='HEAD'?undefined:'No encontrado');}
 });
}
