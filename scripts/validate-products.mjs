import {readFile} from "node:fs/promises";
const file=new URL("../data/products.json",import.meta.url),data=JSON.parse(await readFile(file,"utf8")),errors=[];
const required=["id","slug","name","category","description","highlights","limitations","suitableFor","notSuitableFor","sourceUrl","checkedAt","reviewedBy","status","complianceStatus","disclosureVersion"];
if(data.schemaVersion!==1)errors.push("unsupported schemaVersion");
const categories=new Set(data.categories.map(x=>x.id)),ids=new Set(),slugs=new Set();
for(const [index,item] of data.items.entries()){
  const at=`items[${index}]`;
  for(const key of required)if(item[key]===undefined||item[key]===null||item[key]===""||(Array.isArray(item[key])&&!item[key].length))errors.push(`${at}.${key} is required`);
  if(ids.has(item.id))errors.push(`${at}.id must be unique`);ids.add(item.id);if(slugs.has(item.slug))errors.push(`${at}.slug must be unique`);slugs.add(item.slug);
  if(!/^[a-z0-9-]+$/.test(item.slug||""))errors.push(`${at}.slug is invalid`);if(!categories.has(item.category))errors.push(`${at}.category is unknown`);
  if(item.status==="Published"&&item.complianceStatus!=="approved")errors.push(`${at} cannot publish before compliance approval`);
  if(item.status==="Published"&&item.disclosureVersion!==data.importPolicy.requiredDisclosureVersion)errors.push(`${at} disclosure is outdated`);
  if(data.importPolicy.prohibitedCategories.includes(item.subcategory))errors.push(`${at} prohibited category cannot be imported`);
  if(item.rating!==undefined||item.reviewCount!==undefined||item.soldCount!==undefined)errors.push(`${at} marketplace metrics are not accepted without a separately approved provenance contract`);
  if(item.price&&(!item.price.currency||!Number.isFinite(item.price.min)||!Number.isFinite(item.price.max)||item.price.min>item.price.max))errors.push(`${at}.price is invalid`);
  for(const key of ["sourceUrl","affiliateUrl"])if(item[key]&&!/^https:\/\//.test(item[key]))errors.push(`${at}.${key} must use HTTPS`);
}
if(errors.length){console.error(errors.join("\n"));process.exit(1)}console.log(`Product validation passed: ${data.items.length} verified listings, ${data.categories.length} categories, schema v${data.schemaVersion}`);
