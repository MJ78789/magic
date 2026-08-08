import test from "node:test";import assert from "node:assert/strict";import worker,{services} from "../server/index.js";
const request=path=>new Request(`https://example.test${path}`);
test("all secret-backed services default unavailable",()=>{assert.deepEqual(Object.values(services({})).map(x=>x.available),[false,false,false,false,false,false])});
test("public config exposes availability only",async()=>{const response=await worker.fetch(request("/api/public/config"),{});const body=await response.json();assert.equal(response.status,200);assert.equal(JSON.stringify(body).includes("secret"),false)});
test("admin route is unavailable without storage",async()=>{const response=await worker.fetch(request("/api/admin/overview"),{});assert.equal(response.status,503);assert.equal(response.headers.get("cache-control"),"no-store")});
test("unknown api does not leak internals",async()=>{const response=await worker.fetch(request("/api/nope"),{});assert.equal(response.status,404);assert.equal(response.headers.get("x-robots-tag"),"noindex, nofollow")});
