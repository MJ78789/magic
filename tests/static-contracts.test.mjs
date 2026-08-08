import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const json = async (path) =>
  JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));
test("FAQ expansion is balanced, cautious, and deep-linkable", async () => {
  const data = await json("data/faqs.json"),
    counts = Object.groupBy(data.items, (x) => x.category);
  assert.equal(data.items.length, 60);
  assert.deepEqual(
    Object.values(counts).map((x) => x.length),
    [10, 10, 10, 10, 10, 10],
  );
  assert.equal(
    data.items.every(
      (x) => x.related.length === 2 && x.sourceStatus && x.limitations,
    ),
    true,
  );
  const risk = counts["Risk Management"];
  assert.equal(risk.length, 10);
  assert.equal(
    risk.every(
      (x) => x.sourceStatus === "general-practice-needs-context-review",
    ),
    true,
  );
});
test("public website content does not reference restricted organization names", async () => {
  const files = [
    "data/faqs.json",
    "faqs.html",
    "governance.html",
  ];
  const restricted = /(กฟผ\.?|การไฟฟ้าฝ่ายผลิต(?:แห่งประเทศไทย)?|EGAT|PPRM)/i;
  for (const file of files) {
    const body = await readFile(
      new URL(`../${file}`, import.meta.url),
      "utf8",
    );
    assert.equal(
      restricted.test(body),
      false,
      `${file} contains a restricted organization reference`,
    );
  }
});
test("catalog defaults empty and fail-closed", async () => {
  const data = await json("data/products.json");
  assert.equal(data.items.length, 0);
  assert.equal(data.status, "awaiting-verified-source");
  assert.deepEqual(data.importPolicy.prohibitedCategories, [
    "medicine",
    "controlled-product",
  ]);
});
test("FAQ usage examples stay explicit and Shopee intake has seven unpublished slots", async () => {
  const faqs = await json("data/faqs.json"),
    item = faqs.items.find((x) => x.id === "FAQ-MKT-002"),
    intake = await json("data/shopee-affiliate-intake.json");
  assert.match(item.usageExample.prompt, /Role:/);
  assert.match(item.usageExample.prompt, /Constraints:/);
  assert.match(item.usageExample.note, /ข้อมูลสาธิต/);
  assert.equal(intake.slots.length, 7);
  assert.equal(
    intake.slots.every(
      (x, i) =>
        x.position === i + 1 &&
        x.sourceUrl === null &&
        x.status === "awaiting-url",
    ),
    true,
  );
});
test("service worker never serves 404 HTML for failed subresources", async () => {
  const source = await readFile(new URL("../sw.js", import.meta.url), "utf8");
  assert.match(source, /request\.mode===\"navigate\"/);
  assert.doesNotMatch(source, /hit\|\|caches\.match\("\/404\.html"\)/);
});
