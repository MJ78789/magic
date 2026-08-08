const grid = document.querySelector("#product-grid"),
  form = document.querySelector("#product-form");
let items = [],
  compare = new Set();
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const facebookShare = (url) =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
const render = () => {
  const q = form?.querySelector("#pq")?.value.toLocaleLowerCase("th") || "",
    category = form?.querySelector("#pc")?.value || "";
  const rows = items.filter(
    (x) =>
      (!q ||
        `${x.name} ${x.description} ${(x.tags || []).join(" ")}`
          .toLocaleLowerCase("th")
          .includes(q)) &&
      (!category || x.category === category),
  );
  const price = (x) =>
    x.price
      ? `฿${Number(x.price.min).toLocaleString("th-TH")} <small>ณ วันที่ตรวจ</small>`
      : "ตรวจราคาล่าสุดใน Shopee";
  grid.innerHTML = rows.length
    ? `${rows.map((x) => {
        const itemUrl = new URL(`products.html#${x.slug}`, location.href).href;
        return `<article class="product-card" id="${esc(x.slug)}">${x.imageUrl ? `<img class="product-image" src="${esc(x.imageUrl)}" alt="${esc(x.name)}" loading="lazy">` : ""}<p class="meta">ตรวจล่าสุด ${esc(x.checkedAt)} · ร้าน ${esc(x.shopName || "ตรวจใน Shopee")}</p><h2>${esc(x.name)}</h2><p>${esc(x.description)}</p><p class="product-price">${price(x)}</p><h3>จุดเด่น</h3><p>${esc(x.highlights.join(" · "))}</p><h3>ข้อควรตรวจ</h3><p>${esc(x.limitations.join(" · "))}</p><label><input type="checkbox" data-compare="${esc(x.id)}" ${compare.has(x.id) ? "checked" : ""}> เปรียบเทียบ</label><div class="share-actions">${x.status === "Published" && x.affiliateUrl ? `<a class="button affiliate-link" target="_blank" rel="sponsored nofollow noopener" data-product-id="${esc(x.id)}" href="${esc(x.affiliateUrl)}">ดูราคาใน Shopee</a>` : ""}<a class="button secondary facebook-share" target="_blank" rel="noopener noreferrer" data-track="facebook_share" href="${esc(facebookShare(itemUrl))}">แชร์ไป Facebook</a></div>${x.status === "Published" && x.affiliateUrl ? `<small>ลิงก์ Affiliate — เว็บไซต์อาจได้รับค่าคอมมิชชัน โดยผู้ซื้อไม่เสียค่าใช้จ่ายเพิ่ม</small>` : ""}</article>`;
      }).join("")}<div class="compare-bar" aria-live="polite">เลือกเปรียบเทียบ ${compare.size} รายการ${compare.size > 1 ? " · ตารางเปรียบเทียบจะแสดงเฉพาะข้อมูลที่ตรวจแล้ว" : ""}</div>`
    : '<div class="empty-box"><h2>ยังไม่มีรายการสินค้าที่ผ่านการตรวจ</h2><p>โครงสร้างรองรับค้นหา กรอง และเลือกเปรียบเทียบแล้ว แต่เราไม่สร้างชื่อสินค้า ราคา คะแนน รีวิว ร้านค้า หรือลิงก์ Affiliate ขึ้นเอง รายการจะปรากฏหลังผ่าน validation และ compliance review</p></div>';
};
try {
  const data = await fetch("data/products.json").then((r) => {
    if (!r.ok) throw Error();
    return r.json();
  });
  items = data.items;
  const category = form?.querySelector("#pc");
  for (const row of data.categories)
    category?.add(new Option(row.label, row.id));
  for (const control of form?.elements || []) control.disabled = !items.length;
  render();
  form?.addEventListener("input", render);
  grid.addEventListener("change", (e) => {
    const id = e.target.dataset.compare;
    if (!id) return;
    e.target.checked ? compare.add(id) : compare.delete(id);
    render();
  });
  grid.addEventListener("click", (e) => {
    const link = e.target.closest(".affiliate-link");
    if (link)
      window.magicTrack?.("affiliate_click", {
        product_id: link.dataset.productId,
      });
  });
} catch {
  grid.innerHTML =
    '<p class="notice">โหลดแคตตาล็อกไม่สำเร็จ กรุณาลองใหม่ภายหลัง</p>';
}
