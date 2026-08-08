import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const data = JSON.parse(
  await readFile(path.join(root, "data/products.json"), "utf8"),
);
const items = data.items.filter(
  (item) =>
    item.status === "Published" && item.complianceStatus === "approved",
);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch],
  );
const money = (item) =>
  item.price
    ? `฿${Number(item.price.min).toLocaleString("th-TH")}`
    : "ตรวจราคาล่าสุดใน Shopee";

for (const item of items) {
  const canonical = `https://magicsuccessthailand.com/products/${item.slug}/`;
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`;
  const image = item.imageUrl;
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: [image],
    category: item.category,
    offers: item.price
      ? {
          "@type": "Offer",
          url: item.affiliateUrl,
          priceCurrency: item.price.currency,
          price: item.price.min,
        }
      : undefined,
  });
  const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="/"><title>${escape(item.name)} — MagicSuccess Thailand</title><meta name="description" content="${escape(item.description)}"><link rel="canonical" href="${canonical}"><meta name="theme-color" content="#07182d"><meta property="og:locale" content="th_TH"><meta property="og:type" content="product"><meta property="og:site_name" content="MagicSuccess Thailand"><meta property="og:url" content="${canonical}"><meta property="og:title" content="${escape(item.name)}"><meta property="og:description" content="${escape(item.description)}"><meta property="og:image" content="${escape(image)}"><meta property="og:image:secure_url" content="${escape(image)}"><meta property="og:image:alt" content="${escape(item.name)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(item.name)}"><meta name="twitter:description" content="${escape(item.description)}"><meta name="twitter:image" content="${escape(image)}"><link rel="stylesheet" href="assets/css/styles.css"><script type="application/ld+json">${schema}</script></head>
<body><a class="skip-link" href="#main">ข้ามไปยังเนื้อหา</a><header class="site-header"><a class="brand" href="index.html"><img src="assets/images/magicsuccess-logo.jpg" alt="โลโก้ MagicSuccess Thailand"><span>MAGICSUCCESS <small>THAILAND</small></span></a><button class="menu-button" aria-expanded="false" aria-controls="nav">เมนู</button><nav id="nav"><a href="index.html">หน้าแรก</a><a href="content.html">บทความ</a><a class="active" href="products.html">สินค้า</a></nav></header>
<main id="main" class="article-shell"><a class="back-link" href="products.html">← กลับหน้าสินค้า</a><article class="product-detail"><img class="product-image" src="${escape(image)}" alt="${escape(item.name)}"><p class="eyebrow">สินค้าแนะนำ · ตรวจล่าสุด ${escape(item.checkedAt)}</p><h1>${escape(item.name)}</h1><p class="lede">${escape(item.description)}</p><p class="product-price">${escape(money(item))} <small>ณ วันที่ตรวจ ราคาและโปรโมชันอาจเปลี่ยน</small></p><h2>จุดเด่น</h2><ul>${item.highlights.map((value) => `<li>${escape(value)}</li>`).join("")}</ul><h2>ข้อควรตรวจก่อนซื้อ</h2><ul>${item.limitations.map((value) => `<li>${escape(value)}</li>`).join("")}</ul><div class="share-actions"><a class="button primary affiliate-link" href="${escape(item.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener" data-track="affiliate_click" data-product-id="${escape(item.id)}">ดูราคาและตัวเลือกล่าสุดใน Shopee</a><a class="button secondary facebook-share" href="${shareUrl}" target="_blank" rel="noopener noreferrer" data-track="facebook_share" data-product-id="${escape(item.id)}">แชร์ไป Facebook</a></div><p><small>ลิงก์ Affiliate — เว็บไซต์อาจได้รับค่าคอมมิชชัน โดยผู้ซื้อไม่เสียค่าใช้จ่ายเพิ่ม</small></p></article></main>
<footer><a href="legal.html#affiliate">Affiliate Disclosure</a><p>© <span id="year"></span> MagicSuccess Thailand</p></footer><script src="assets/js/main.js"></script></body></html>\n`;
  const output = path.join(root, "products", item.slug);
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, "index.html"), html);
}

console.log(`Built ${items.length} static product share pages`);
