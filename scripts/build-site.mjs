import {cp,mkdir,readFile,rm,writeFile} from "node:fs/promises";import path from "node:path";
const root=process.cwd(),dist=path.join(root,"dist");
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
const files=["index.html","youtube.html","content.html","article.html","faqs.html","products.html","search.html","legal.html","services.html","governance.html","404.html","robots.txt","CNAME","manifest.webmanifest","sw.js","README.md"];
for(const file of files)await cp(path.join(root,file),path.join(dist,file));
for(const dir of ["assets","data","content","articles","server",".openai"]){await cp(path.join(root,dir),path.join(dist,dir),{recursive:true})}
const pages=files.filter(x=>x.endsWith(".html")&&!['article.html','404.html'].includes(x));
const articles=JSON.parse(await readFile(path.join(root,"data/articles.json"),"utf8")).items.map(x=>`articles/${x.slug}/`);
const urls=[...pages,...articles].map(p=>`  <url><loc>https://magicsuccessthailand.com/${p==="index.html"?"":p}</loc></url>`).join("\n");
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
await writeFile(path.join(root,"sitemap.xml"),sitemap);await writeFile(path.join(dist,"sitemap.xml"),sitemap);
console.log(`Built ${pages.length} public pages and ${articles.length} article URLs`);
