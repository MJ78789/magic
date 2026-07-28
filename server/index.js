export default {
  async fetch(request, env) {
    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }
    return new Response("MagicSuccess Thailand", {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
