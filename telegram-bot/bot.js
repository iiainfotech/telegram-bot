// Telegram Scheduled Broadcast Bot
// Run: node bot.js
// Requires Node 18+ (built-in fetch)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));

const { botToken, intervalMinutes, groups, messages, mode } = CONFIG;
if (!botToken || !groups?.length || !messages?.length) {
  console.error("config.json me botToken, groups, messages zaroori hain");
  process.exit(1);
}

const STATE_FILE = path.join(__dirname, "state.json");
let state = { index: 0 };
if (fs.existsSync(STATE_FILE)) {
  try { state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch {}
}
const saveState = () => fs.writeFileSync(STATE_FILE, JSON.stringify(state));

async function sendMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`${chatId}: ${data.description}`);
  return data;
}

async function broadcast() {
  const msg = mode === "random"
    ? messages[Math.floor(Math.random() * messages.length)]
    : messages[state.index % messages.length];

  console.log(`\n[${new Date().toLocaleString()}] Broadcasting message #${state.index % messages.length + 1}`);
  console.log(`Text: ${msg.slice(0, 60)}${msg.length > 60 ? "..." : ""}`);

  for (const chatId of groups) {
    try {
      await sendMessage(chatId, msg);
      console.log(`  ✓ Sent to ${chatId}`);
    } catch (e) {
      console.error(`  ✗ Failed ${chatId}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 500)); // small delay between groups
  }

  state.index = (state.index + 1) % messages.length;
  saveState();
}

console.log(`Bot started. Interval: ${intervalMinutes} min | Groups: ${groups.length} | Messages: ${messages.length}`);
broadcast();
setInterval(broadcast, intervalMinutes * 60 * 1000);
