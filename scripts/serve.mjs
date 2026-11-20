import {createStaticServer} from './server.mjs';
const port=Number(process.env.PORT||4174);
const server=createStaticServer();
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'El puerto '+port+' está ocupado. Abre http://127.0.0.1:'+port:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log('Vista previa: http://127.0.0.1:'+port));
