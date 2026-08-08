import {cp,mkdir,readFile,rm,writeFile} from "node:fs/promises";import path from "node:path";
const root=process.cwd(),dist=path.join(root,"dist");
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
const files=["index.html","youtube.html","content.html","article.html","faqs.html","products.html","search.html","legal.html","services.html","governance.html","404.html","robots.txt","CNAME","manifest.webmanifest","sw.js","README.md"];
const canonicalFor=file=>`https://magicsuccessthailand.com/${file==="index.html"?"":file}`;
for(const file of files.filter(x=>x.endsWith(".html")&&!['article.html','404.html'].includes(x))){
  const source=path.join(root,file);let html=await readFile(source,"utf8"),canonical=canonicalFor(file),title=html.match(/<title>([^<]+)<\/title>/)?.[1]||"MagicSuccess Thailand";
  if(!html.includes('property="og:url"'))html=html.replace("</head>",`<meta property="og:url" content="${canonical}"></head>`);
  if(!html.includes('name="twitter:card"'))html=html.replace("</head>",'<meta name="twitter:card" content="summary_large_image"></head>');
  if(!html.includes('rel="manifest"'))html=html.replace("</head>",'<link rel="manifest" href="manifest.webmanifest"></head>');
  if(!html.includes('name="theme-color"'))html=html.replace("</head>",'<meta name="theme-color" content="#07182d"></head>');
  if(!html.includes('application/ld+json')){const schema={"@context":"https://schema.org","@type":"WebPage",name:title,url:canonical,isPartOf:{"@type":"WebSite",name:"MagicSuccess Thailand",url:"https://magicsuccessthailand.com/"},breadcrumb:{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"หน้าแรก",item:"https://magicsuccessthailand.com/"},{"@type":"ListItem",position:2,name:title,item:canonical}]}};html=html.replace("</head>",`<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`)}
  if(html.includes("<nav>")&&!html.includes('aria-controls="nav"'))html=html.replace("<nav>",'<button class="menu-button" aria-expanded="false" aria-controls="nav">เมนู</button><nav id="nav" aria-label="เมนูหลัก">');
  html=html.replace("FAQ starter set แสดงจำนวนจริง 18/180","FAQ ชุดทบทวนปัจจุบันแสดงจำนวนจริง 60/180");
  await writeFile(source,html);
}
for(const file of files)await cp(path.join(root,file),path.join(dist,file));
for(const dir of ["assets","data","content","articles","server",".openai"]){await cp(path.join(root,dir),path.join(dist,dir),{recursive:true})}
const pages=files.filter(x=>x.endsWith(".html")&&!['article.html','404.html'].includes(x));
const articles=JSON.parse(await readFile(path.join(root,"data/articles.json"),"utf8")).items.map(x=>`articles/${x.slug}/`);
const urls=[...pages,...articles].map(p=>`  <url><loc>https://magicsuccessthailand.com/${p==="index.html"?"":p}</loc></url>`).join("\n");
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
await writeFile(path.join(root,"sitemap.xml"),sitemap);await writeFile(path.join(dist,"sitemap.xml"),sitemap);
console.log(`Built ${pages.length} public pages and ${articles.length} article URLs`);
