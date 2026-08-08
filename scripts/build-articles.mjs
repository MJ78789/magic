import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const { items } = JSON.parse(await readFile(path.join(root, "data/articles.json"), "utf8"));
const escape = value => String(value).replace(/[&<>\"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

for (const item of items) {
  const canonical = `https://magicsuccessthailand.com/articles/${item.slug}/`;
  const image = `https://magicsuccessthailand.com/${item.image}`;
  const schema=JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:item.title,description:item.excerpt,image:[image],datePublished:item.date,dateModified:item.updatedAt||item.date,mainEntityOfPage:canonical,publisher:{"@type":"Organization",name:"MagicSuccess Thailand",url:"https://magicsuccessthailand.com/"}});
  const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="/"><title>${escape(item.title)} — MagicSuccess Thailand</title><meta name="description" content="${escape(item.excerpt)}"><meta name="theme-color" content="#07182d"><link rel="canonical" href="${canonical}"><meta property="og:locale" content="th_TH"><meta property="og:type" content="article"><meta property="og:site_name" content="MagicSuccess Thailand"><meta property="og:url" content="${canonical}"><meta property="og:title" content="${escape(item.title)}"><meta property="og:description" content="${escape(item.excerpt)}"><meta property="og:image" content="${image}"><meta property="og:image:alt" content="${escape(item.imageAlt)}"><meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(item.title)}"><meta name="twitter:description" content="${escape(item.excerpt)}"><meta name="twitter:image" content="${image}"><link rel="stylesheet" href="assets/css/styles.css"></head>
<body data-article-slug="${escape(item.slug)}"><a class="skip-link" href="#main">ข้ามไปยังเนื้อหา</a><header class="site-header"><a class="brand" href="index.html"><img src="assets/images/magicsuccess-logo.jpg" alt="โลโก้ MagicSuccess Thailand"><span>MAGICSUCCESS <small>THAILAND</small></span></a><button class="menu-button" aria-expanded="false" aria-controls="nav">เมนู</button><nav id="nav"><a href="index.html">หน้าแรก</a><a href="youtube.html">YouTube</a><a class="active" href="content.html">บทความ</a></nav></header>
<main id="main" class="article-shell"><a class="back-link" href="content.html">← กลับคลังบทความ</a><article class="article-body" id="article-body"><p>กำลังโหลดบทความ…</p></article><aside class="related-video" id="related-video" hidden></aside></main>
<footer><div class="brand"><img src="assets/images/magicsuccess-logo.jpg" alt=""><span>MAGICSUCCESS <small>THAILAND</small></span></div><p>© <span id="year"></span> MagicSuccess Thailand</p><a href="content.html">บทความทั้งหมด ↑</a></footer><script src="assets/js/main.js"></script><script type="module" src="assets/js/article.js?v=20260802-4"></script></body></html>\n`;
  const output = path.join(root, "articles", item.slug);
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, "index.html"), html.replace("</head>",`<script type="application/ld+json">${schema}</script></head>`));
}

const publicPages = [
  ["", "2026-08-02"],
  ["youtube.html", "2026-08-02"],
  ["content.html", "2026-08-08"],
  ["faqs.html", "2026-08-02"],
  ["products.html", "2026-08-02"],
  ["search.html", "2026-08-02"],
  ["legal.html", "2026-08-02"],
  ["services.html", "2026-08-02"],
  ["governance.html", "2026-08-02"]
];
const pageUrls = publicPages.map(([page, lastmod]) => `  <url><loc>https://magicsuccessthailand.com/${page}</loc><lastmod>${lastmod}</lastmod></url>`);
const articleUrls = items.map(item => `  <url><loc>https://magicsuccessthailand.com/articles/${item.slug}/</loc><lastmod>${item.updatedAt||item.date}</lastmod></url>`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageUrls,...articleUrls].join("\n")}\n</urlset>\n`;
await writeFile(path.join(root, "sitemap.xml"), sitemap);
console.log(`Built ${items.length} static article pages and sitemap.xml`);
