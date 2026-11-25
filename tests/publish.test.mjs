import test from 'node:test';
import assert from 'node:assert/strict';
import {publishPages} from '../scripts/publish-pages.mjs';
const env={GITHUB_TOKEN:'test-only',GITHUB_REPOSITORY:'example/portfolio',GITHUB_SHA:'example-sha',ARTIFACT_ID:'123',ACTIONS_ID_TOKEN_REQUEST_URL:'https://identity.example/token',ACTIONS_ID_TOKEN_REQUEST_TOKEN:'test-request',SITE_URL:'https://example.org/portfolio'};
test('La publicación utiliza el paquete exacto, conserva OIDC y espera el resultado final',async()=>{
  const calls=[];const states=[{value:'test-identity'},{id:'deployment-example'},{status:'queued'},{status:'succeed'}];
  const result=await publishPages({env,wait:async()=>{},request:async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>states.shift()};}});
  assert.equal(JSON.parse(calls[1].options.body).artifact_id,123);
  assert.equal(JSON.parse(calls[1].options.body).oidc_token,'test-identity');
  assert.equal(result.status,'succeed');assert.equal(result.url,'https://example.org/portfolio/');
  assert.equal(calls.length,4);
});
test('Un error de despliegue no se presenta como publicación correcta',async()=>{
  const states=[{value:'test-identity'},{id:'deployment-example'},{status:'deployment_failed'}];
  await assert.rejects(publishPages({env,wait:async()=>{},request:async()=>({ok:true,json:async()=>states.shift()})}),/deployment_failed/);
});
