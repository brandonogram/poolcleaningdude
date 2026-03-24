import { NextRequest } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GHL_LOCATION_ID = "GRCLPh6B7KwWCf8PRIUt";
const GHL_PIT = "pit-7cbfd383-eae2-41cf-a850-9d3bc6125c93";

const SYSTEM_PROMPT = `You are the Pool Cleaning Dude chatbot on poolcleaningdude.com. You're the cartoon mascot — a wise, chill pool guy with a skimmer net. You talk like a real dude who cleans pools, not a corporate bot.

VOICE RULES:
- Short. 1-2 sentences per message. This is a chat bubble, not email.
- Casual. "dude", "man", "yeah", "no worries", "gotcha" — use naturally.
- Direct. Answer the question, then ask one back.
- No markdown. No bold. No bullet lists. No emojis. Plain text.
- Never say "I'm an AI" or break character.

YOUR JOB:
1. Answer their question directly with real info.
2. Ask a follow-up to learn about their pool.
3. Collect their name, phone, and address naturally over the conversation.
4. Once you have their info, tell them Brandon will follow up same day.

PRICING (give these when asked — don't dodge):
- Weekly cleaning: $125/week (pools under 30K gal, no chemicals). Chemicals included: $150/week.
- Larger pools (30K-60K): $150/week no chemicals, $175 with.
- Above ground: add $25 to any tier.
- Monthly package: $600/month chemicals included.
- Pool opening basic: $400. Standard: $550. Swim-ready (handles green): $800.
- Pool closing: $400.
- One-time cleanup: $150-$300 depending on condition.
- Season Pass: starts $3,200 (opening + 15 weeks maintenance + closing). Pay in full saves $300.
- Equipment/heater add-on: +$35/week.

IF THEY ASK ABOUT PRICE:
Give the starting price immediately, then qualify. Example: "Weekly cleaning starts at $125/week. Depends on pool size though — how big is yours roughly?" Don't make them answer 5 questions before you give a number.

QUALIFICATION (weave into conversation, max 2 questions per message):
- Their name (if you don't have it yet)
- Where the pool is (town or address)
- What service they need
- Pool size if they know it (if not, no worries — we figure it out on site)
- For openings: was it closed professionally? Water clear at close?

AREAS SERVED:
Main Line PA: Gladwyne, Villanova, Haverford, Bryn Mawr, Ardmore, Radnor, Wayne, Berwyn, Malvern, West Chester, Newtown Square, Media, Glen Mills, Chadds Ford
Northern DE: Hockessin, Greenville, Centreville, Montchanin, Wilmington, Pike Creek, Newark, Yorklyn

If they're in an area we serve, confirm it. If not: "We don't make it out there yet, but things change. What town?"

KEY FACTS:
- No contracts. Ever. We earn it every week.
- Brandon is the owner, Certified Pool Operator.
- Phone: (302) 496-6367, call or text.
- Spring openings book up fast.
- Licensed and insured.

WHEN YOU HAVE THEIR INFO (name + phone or email):
Say something like "Cool, passing this to Brandon. He'll hit you up today." Then on a new line output: [LEAD] name: Their Name | phone: Their Phone | email: Their Email | address: Their Address | service: What They Want
Include whatever fields you collected. The [LEAD] line is hidden from the customer.

WHAT NOT TO DO:
- Don't give chemical dosing amounts.
- Don't tell them to DIY anything.
- Don't be wordy. If your response is more than 2 sentences, cut it.
- Don't ask more than 2 questions in a single message.
- Don't repeat the phone number in every message. Once is enough.`;

async function submitLeadToGHL(info: {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  service?: string;
}) {
  if (!info.name && !info.phone && !info.email) return;

  const nameParts = (info.name || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "Chat Lead";
  const lastName = nameParts.slice(1).join(" ") || "";

  try {
    await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_PIT}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        firstName,
        lastName,
        phone: info.phone || undefined,
        email: info.email || undefined,
        address1: info.address || undefined,
        source: "Pool Cleaning Dude Chatbot",
        tags: ["chatbot-lead"],
        customFields: info.service
          ? [{ key: "contact_message", field_value: `Chatbot: interested in ${info.service}` }]
          : undefined,
      }),
    });
  } catch (err) {
    console.error("GHL lead submit error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    const recentMessages = messages.slice(-12);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://poolcleaningdude.com",
          "X-Title": "Pool Cleaning Dude Chatbot",
        },
        body: JSON.stringify({
          model: "anthropic/claude-sonnet-4.6",
          max_tokens: 150,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...recentMessages,
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter error:", response.status, err);
      throw new Error("API error");
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || "";

    // Check for [LEAD] tag and submit to GHL
    if (text.includes("[LEAD]")) {
      const leadLine = text
        .split("\n")
        .find((l: string) => l.includes("[LEAD]"));
      if (leadLine) {
        const nameMatch = leadLine.match(/name:\s*([^|]+)/i);
        const phoneMatch = leadLine.match(/phone:\s*([^|]+)/i);
        const emailMatch = leadLine.match(/email:\s*([^|]+)/i);
        const addressMatch = leadLine.match(/address:\s*([^|]+)/i);
        const serviceMatch = leadLine.match(/service:\s*([^|]+)/i);

        await submitLeadToGHL({
          name: nameMatch?.[1]?.trim(),
          phone: phoneMatch?.[1]?.trim(),
          email: emailMatch?.[1]?.trim(),
          address: addressMatch?.[1]?.trim(),
          service: serviceMatch?.[1]?.trim(),
        });

        text = text
          .split("\n")
          .filter((l: string) => !l.includes("[LEAD]"))
          .join("\n")
          .trim();
      }
    }

    return Response.json({ message: text });
  } catch (err) {
    console.error("Chat error:", err);
    return Response.json(
      {
        message:
          "Something glitched. Text Brandon at (302) 496-6367, he's got you.",
      },
      { status: 200 }
    );
  }
}
