import test from "node:test";
import assert from "node:assert/strict";
import { getDefaultAIStatus, resolveDefaultConnection } from "../src/lib/server/default-ai";
import { handleTextRequest } from "../src/lib/server/ai-text";

const req = (body: unknown, ip = "1.1.1.1") =>
  new Request("http://localhost/api/polish", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": ip },
    body: JSON.stringify(body),
  });

test("status reports unavailable without a key and never returns the key", () => {
  delete process.env.GROQ_API_KEY;
  assert.deepEqual(getDefaultAIStatus(), { available: false });
  process.env.GROQ_API_KEY = "gsk_secret_value";
  const status = getDefaultAIStatus();
  assert.equal(status.available, true);
  assert.ok(!JSON.stringify(status).includes("gsk_secret_value"));
});

test("default connection points at Groq and uses GROQ_MODEL when set", () => {
  process.env.GROQ_API_KEY = "gsk_test";
  process.env.GROQ_MODEL = "openai/gpt-oss-20b";
  const connection = resolveDefaultConnection(req({}, "2.2.2.2"), { content: "hi" });
  assert.equal(connection.baseUrl, "https://api.groq.com/openai/v1");
  assert.equal(connection.model, "openai/gpt-oss-20b");
  delete process.env.GROQ_MODEL;
});

test("missing key returns configRequired (503) through the handler", async () => {
  delete process.env.GROQ_API_KEY;
  const response = await handleTextRequest(req({ content: "hello", useDefault: true }, "3.3.3.3"), "polish");
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "configRequired");
});

test("rate limit blocks after 20 requests from one IP", () => {
  process.env.GROQ_API_KEY = "gsk_test";
  for (let i = 0; i < 20; i++) resolveDefaultConnection(req({}, "4.4.4.4"), { content: "x" });
  assert.throws(() => resolveDefaultConnection(req({}, "4.4.4.4"), { content: "x" }), /rateLimited/);
  // another IP is unaffected
  resolveDefaultConnection(req({}, "5.5.5.5"), { content: "x" });
});

test("oversized content is rejected before calling the provider", () => {
  process.env.GROQ_API_KEY = "gsk_test";
  assert.throws(
    () => resolveDefaultConnection(req({}, "6.6.6.6"), { content: "a".repeat(12_001) }),
    /requestTooLarge/
  );
});

test("default path calls Groq with the server key and the key is not echoed back", async () => {
  process.env.GROQ_API_KEY = "gsk_server_key";
  let seenUrl = "";
  let seenAuth = "";
  const fakeFetch = (async (url: string, init: RequestInit) => {
    seenUrl = String(url);
    seenAuth = String((init.headers as Record<string, string>).Authorization);
    return Response.json({ choices: [{ message: { content: JSON.stringify({ errors: [] }) } }] });
  }) as unknown as typeof fetch;
  const response = await handleTextRequest(req({ content: "Hello world", useDefault: true }, "7.7.7.7"), "grammar", fakeFetch);
  assert.equal(response.status, 200);
  assert.equal(seenUrl, "https://api.groq.com/openai/v1/chat/completions");
  assert.equal(seenAuth, "Bearer gsk_server_key");
  assert.ok(!(await response.text()).includes("gsk_server_key"));
});

test("a client cannot use the default key for the connection test task", async () => {
  process.env.GROQ_API_KEY = "gsk_test";
  const response = await handleTextRequest(req({ useDefault: true }, "8.8.8.8"), "test");
  assert.notEqual(response.status, 200);
});
