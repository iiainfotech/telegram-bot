# Telegram Broadcast Bot

Standalone Node.js bot — har X minute me aapke groups me messages bhejta hai. Koi cloud/database nahi.

## Setup (5 min)

### 1. Bot banao
- Telegram me `@BotFather` kholo
- `/newbot` → naam + username do
- **Bot Token** copy karo (e.g. `123456:ABC-xyz...`)

### 2. Bot ko groups me Admin banao
- Group → Add Members → bot ka username add karo
- Group settings → Administrators → bot ko admin banao
- "Send Messages" permission ON rakho

### 3. Group Chat IDs nikalo
Sabse easy tarika:
- Group me `@userinfobot` ya `@RawDataBot` add karo (temporarily)
- Wo bot Chat ID dega, kuch is tarah: `-1001234567890`
- Note kar lo, phir us bot ko remove kar do

### 4. config.json edit karo
```json
{
  "botToken": "YOUR_TOKEN",
  "intervalMinutes": 5,
  "mode": "rotate",        // ya "random"
  "groups": [-1001234567890, -1009876543210],
  "messages": [
    "First message",
    "Second message"
  ]
}
```

- `mode: "rotate"` → messages turn-by-turn jayenge
- `mode: "random"` → har baar random message
- HTML formatting supported (`<b>`, `<i>`, `<a href="">`)

### 5. Bot chalu karo
```bash
cd telegram-bot
node bot.js
```

Node 18+ chahiye. Bas — bot ab har 5 min me sab groups me message bhejega.

## Hosting (24/7 chalane ke liye)
Local PC band ho jaye to message rukega. Free hosting options:
- **Railway.app** (free tier) — repo push karo, deploy ho jayega
- **Render.com** background worker
- **Replit** (free, but sleep ho sakta hai)
- Koi bhi VPS (DigitalOcean, Hetzner $5/month)

Bas us host pe `node bot.js` chala dena.

## Tips
- `state.json` apne aap banta hai (rotation track karta hai) — delete mat karo
- Telegram rate limit ~30 msg/sec — 100+ groups ho to interval badhao
- Bot ko admin na banaya to `403 Forbidden` aayega
