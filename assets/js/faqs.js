const form = document.querySelector("#faq-form"),
  list = document.querySelector("#faq-list"),
  count = document.querySelector("#faq-count");
let items = [];
if (form && !form.tag) {
  const field = document.createElement("div");
  field.className = "field";
  field.innerHTML =
    '<label for="tag">แท็ก</label><select id="tag" name="tag"><option value="">ทุกแท็ก</option></select>';
  form.append(field);
}
const esc = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    ),
  feedbackKey = "magic_faq_feedback_v1";
const savedFeedback = () => {
  try {
    return JSON.parse(localStorage.getItem(feedbackKey) || "{}");
  } catch {
    return {};
  }
};
const syncUrl = () => {
  const params = new URLSearchParams();
  for (const key of ["q", "category", "level", "tag"]) {
    const value = form.elements[key]?.value.trim();
    if (value) params.set(key, value);
  }
  history.replaceState(
    null,
    "",
    `${location.pathname}${params.size ? `?${params}` : ""}${location.hash}`,
  );
};
const render = () => {
  const q = form.q.value.trim().toLocaleLowerCase("th"),
    category = form.category.value,
    level = form.level.value,
    tag = form.tag.value;
  const filtered = items.filter(
    (item) =>
      (!q ||
        [
          item.question,
          item.answer,
          item.prompt,
          item.readyPrompt,
          item.usageExample?.prompt,
          item.usageExample?.expectedUse,
          ...item.tags,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("th")
          .includes(q)) &&
      (!category || item.category === category) &&
      (!level || item.level === level) &&
      (!tag || item.tags.includes(tag)),
  );
  const feedback = savedFeedback();
  count.textContent = `แสดง ${filtered.length} จาก ${items.length} รายการที่เผยแพร่`;
  list.innerHTML =
    filtered
      .map((item) => {
        const related = item.related
            .map((id) => items.find((x) => x.id === id))
            .filter(Boolean),
          example = item.usageExample
            ? `<section class="prompt-example" aria-label="ตัวอย่างใช้งานจริง"><h3>${esc(item.usageExample.title)}</h3><p class="content-status">${esc(item.usageExample.note)}</p><pre class="prompt">${esc(item.usageExample.prompt)}</pre><p><strong>วิธีใช้:</strong> ${esc(item.usageExample.expectedUse)}</p><p><a href="articles/ai-prompt-clear-results/">อ่านวิธีใช้ Prompt Template 5 ส่วน</a></p></section>`
            : "";
        return `<details class="faq-item" id="${esc(item.id)}"><summary>${esc(item.question)}</summary><div class="faq-answer"><p class="meta">${esc(item.id)} · ${esc(item.category)} · ${esc(item.level)} · ตรวจเนื้อหา ${esc(item.reviewedAt)}</p><p>${esc(item.answer)}</p><p class="content-status"><strong>สถานะแหล่งข้อมูล:</strong> ${esc(item.sourceStatus)} · ${esc(item.limitations)}</p><h3>Prompt พร้อมใช้งานจริง</h3><pre class="prompt">${esc(item.readyPrompt)}</pre><div class="faq-actions"><button class="button secondary copy-prompt" type="button" data-id="${esc(item.id)}">คัดลอก Prompt พร้อมใช้</button> <a href="faqs.html#${esc(item.id)}">ลิงก์คำถามนี้</a></div><details class="prompt-template"><summary>ดู Prompt Template ตาม Framework</summary><pre class="prompt">${esc(item.prompt)}</pre></details>${example}${related.length ? `<h3>คำถามที่เกี่ยวข้อง</h3><ul>${related.map((x) => `<li><a href="faqs.html#${esc(x.id)}">${esc(x.question)}</a></li>`).join("")}</ul>` : ""}<fieldset class="helpful"><legend>คำตอบนี้มีประโยชน์หรือไม่? (บันทึกในอุปกรณ์นี้เท่านั้น)</legend><button type="button" data-feedback="helpful" data-id="${esc(item.id)}" aria-pressed="${feedback[item.id] === "helpful"}">มีประโยชน์</button><button type="button" data-feedback="not-helpful" data-id="${esc(item.id)}" aria-pressed="${feedback[item.id] === "not-helpful"}">ควรปรับปรุง</button><span aria-live="polite">${feedback[item.id] ? "บันทึกแล้ว" : ""}</span></fieldset></div></details>`;
      })
      .join("") ||
    '<p class="empty-box">ไม่พบคำถาม ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>';
  syncUrl();
};
try {
  const data = await fetch("data/faqs.json").then((r) => {
    if (!r.ok) throw Error();
    return r.json();
  });
  items = data.items;
  document.querySelector("#faq-progress").style.width =
    `${(data.published / data.target) * 100}%`;
  document.querySelector("#faq-progress-text").textContent =
    `เผยแพร่และตรวจโครงสร้างแล้ว ${data.published}/${data.target} รายการ (${data.target - data.published} รายการยังรอเขียนและตรวจ)`;
  [...new Set(items.map((x) => x.category))].forEach((x) =>
    form.category.add(new Option(x, x)),
  );
  [...new Set(items.flatMap((x) => x.tags))]
    .sort((a, b) => a.localeCompare(b, "th"))
    .forEach((x) => form.tag.add(new Option(x, x)));
  const params = new URLSearchParams(location.search);
  for (const key of ["q", "category", "level", "tag"])
    if (params.has(key) && form.elements[key])
      form.elements[key].value = params.get(key);
  render();
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    target?.setAttribute("open", "");
    target?.scrollIntoView();
  }
} catch {
  list.innerHTML =
    '<p class="notice">โหลดคลัง FAQ ไม่สำเร็จ กรุณาลองใหม่ภายหลัง</p>';
}
form?.addEventListener("input", render);
list?.addEventListener("click", async (e) => {
  const copy = e.target.closest(".copy-prompt");
  if (copy) {
    const item = items.find((x) => x.id === copy.dataset.id);
    try {
      await navigator.clipboard.writeText(item.readyPrompt);
      copy.textContent = "คัดลอกแล้ว";
      window.magicTrack?.("prompt_copy", {
        faq_id: item.id,
        prompt_type: "ready",
      });
    } catch {
      copy.textContent = "คัดลอกไม่สำเร็จ";
    }
    return;
  }
  const button = e.target.closest("[data-feedback]");
  if (!button) return;
  const feedback = savedFeedback();
  feedback[button.dataset.id] = button.dataset.feedback;
  localStorage.setItem(feedbackKey, JSON.stringify(feedback));
  render();
  document.getElementById(button.dataset.id)?.setAttribute("open", "");
});
