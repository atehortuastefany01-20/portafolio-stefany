import {appendFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

// Publica el identificador exacto devuelto al cargar el paquete.
// Evita depender del listado de paquetes, que puede tardar en actualizarse.
export async function publishPages({env=process.env,request=fetch,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}) {
  for (const name of ['GITHUB_TOKEN','GITHUB_REPOSITORY','GITHUB_SHA','ARTIFACT_ID','ACTIONS_ID_TOKEN_REQUEST_URL','ACTIONS_ID_TOKEN_REQUEST_TOKEN','SITE_URL']) {
    if (!env[name]) throw new Error(`Falta la variable de publicación ${name}`);
  }
  const artifactId=Number(env.ARTIFACT_ID);
  if (!Number.isSafeInteger(artifactId)||artifactId<=0) throw new Error('El identificador del paquete no es válido.');
  const identityResponse=await request(env.ACTIONS_ID_TOKEN_REQUEST_URL,{headers:{Authorization:`Bearer ${env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}`}});
  if (!identityResponse.ok) throw new Error(`No se obtuvo la identidad del despliegue (HTTP ${identityResponse.status}).`);
  const identity=await identityResponse.json();
  if (!identity.value) throw new Error('La identidad del despliegue está vacía.');
  const headers={Authorization:`Bearer ${env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json','Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'};
  const endpoint=`${env.GITHUB_API_URL||'https://api.github.com'}/repos/${env.GITHUB_REPOSITORY}/pages/deployments`;
  const creation=await request(endpoint,{method:'POST',headers,body:JSON.stringify({artifact_id:artifactId,pages_build_version:env.GITHUB_SHA,oidc_token:identity.value})});
  if (!creation.ok) throw new Error(`No se pudo iniciar la publicación (HTTP ${creation.status}).`);
  const deployment=await creation.json();
  const id=deployment.id||deployment.status_url?.split('/').pop()||env.GITHUB_SHA;
  const failures=new Set(['deployment_failed','deployment_content_failed','deployment_cancelled','deployment_lost']);
  for(let attempt=0;attempt<120;attempt++) {
    await wait(5000);
    const response=await request(`${endpoint}/${encodeURIComponent(id)}`,{headers});
    if (!response.ok) {
      if (response.status>=500||response.status===404) continue;
      throw new Error(`No se pudo consultar la publicación (HTTP ${response.status}).`);
    }
    const state=await response.json();
    if(state.status==='succeed') {
      const url=new URL(env.SITE_URL).href.replace(/\/?$/,'/');
      if(env.GITHUB_OUTPUT) await appendFile(env.GITHUB_OUTPUT,`page_url=${url}\n`);
      return {status:'succeed',url};
    }
    if(failures.has(state.status)) throw new Error(`La publicación terminó con estado ${state.status}.`);
  }
  throw new Error('La publicación superó el tiempo de espera.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  publishPages().then(result=>console.log(`Página publicada: ${result.url}`)).catch(error=>{console.error(error.message);process.exitCode=1;});
}
