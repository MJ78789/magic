const json=(body,status=200,headers={})=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...headers}});
const unavailable=(service)=>json({ok:false,error:"service_unavailable",service,message:"ยังไม่ได้ตั้งค่าบริการนี้"},503);
const enabled=(env,...keys)=>keys.every(key=>typeof env[key]==="string"&&env[key].trim().length>0);
const services=env=>({
  googleOAuth:{available:enabled(env,"GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","SESSION_SECRET","OAUTH_REDIRECT_URI")},
  database:{available:Boolean(env.DB)},
  analytics:{available:enabled(env,"GA_PROPERTY_ID","GOOGLE_SERVICE_ACCOUNT_JSON")},
  newsletter:{available:enabled(env,"NEWSLETTER_ENDPOINT","NEWSLETTER_API_TOKEN")},
  affiliate:{available:enabled(env,"AFFILIATE_PROVIDER_TOKEN")},
  payments:{available:enabled(env,"PAYMENT_PROVIDER_SECRET","PAYMENT_WEBHOOK_SECRET")}
});
const getSession=async(request,env)=>{
  const cookie=request.headers.get("cookie")||"";
  if(!env.SESSIONS||!cookie.includes("magic_session="))return null;
  const id=cookie.match(/(?:^|;\s*)magic_session=([^;]+)/)?.[1];
  if(!id)return null;
  return env.SESSIONS.get(decodeURIComponent(id),"json");
};
const requireUser=async(request,env)=>{const session=await getSession(request,env);return session?.sub&&session.emailVerified===true?session:null};
const requireAdmin=async(request,env)=>{
  const session=await requireUser(request,env);if(!session)return null;
  const allowlist=(env.ADMIN_EMAIL_ALLOWLIST||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
  return allowlist.includes(String(session.email).toLowerCase())?session:null;
};
const securityHeaders={"content-security-policy":"default-src 'none'; frame-ancestors 'none'","x-frame-options":"DENY","referrer-policy":"no-referrer","x-robots-tag":"noindex, nofollow"};

export default {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==="/api/public/config"&&request.method==="GET")return json({services:services(env)});
  if(url.pathname==="/api/auth/google/start"){
    if(!services(env).googleOAuth.available)return unavailable("googleOAuth");
    return json({ok:false,error:"not_implemented",message:"OAuth adapter ต้องผ่าน security review ก่อนเปิด"},501,securityHeaders);
  }
  if(url.pathname==="/api/auth/session"){
    const user=await requireUser(request,env);return user?json({authenticated:true,user:{displayName:user.displayName||null}}):json({authenticated:false},401);
  }
  if(url.pathname.startsWith("/api/member/")){
    if(!env.DB||!env.SESSIONS)return unavailable("member");
    const user=await requireUser(request,env);if(!user)return json({ok:false,error:"unauthorized"},401,securityHeaders);
    return json({ok:false,error:"not_implemented"},501,securityHeaders);
  }
  if(url.pathname.startsWith("/api/admin/")){
    if(!env.DB||!env.SESSIONS)return unavailable("admin");
    const admin=await requireAdmin(request,env);if(!admin)return json({ok:false,error:"forbidden"},403,securityHeaders);
    return json({ok:false,error:"not_implemented",message:"Admin data adapter ยังไม่เปิด"},501,securityHeaders);
  }
  if(url.pathname==="/api/newsletter/subscribe")return services(env).newsletter.available?json({ok:false,error:"not_implemented"},501):unavailable("newsletter");
  if(url.pathname.startsWith("/api/payments/"))return services(env).payments.available?json({ok:false,error:"not_implemented"},501):unavailable("payments");
  if(url.pathname.startsWith("/api/"))return json({ok:false,error:"not_found"},404,securityHeaders);
  if(env.ASSETS&&typeof env.ASSETS.fetch==="function")return env.ASSETS.fetch(request);
  return new Response("Not found",{status:404,headers:{"content-type":"text/plain; charset=utf-8"}});
}};

export {services,requireAdmin};
