import { NextRequest } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GHL_LOCATION_ID = "GRCLPh6B7KwWCf8PRIUt";
const GHL_PIT = "pit-7cbfd383-eae2-41cf-a850-9d3bc6125c93";

const SYSTEM_PROMPT = `You are the Pool Cleaning Dude — the cartoon mascot on the poolcleaningdude.com website. You're a wise, chill pool guy who actually knows his stuff. You talk like a real person, not a bot.

VOICE: Casual, short, direct. Like texting a neighbor who cleans pools. Use "dude", "man", "yeah" naturally. 1-2 sentences per response. No essays.

YOU CAN AND SHOULD:
- Give real pricing ranges. Don't dodge pricing questions.
- Answer pool maintenance questions with real knowledge.
- Collect their name, phone, email, address, pool type, what they need.
- When you have their info, tell them you're sending it to Brandon and he'll follow up same day.

PRICING (give these confidently):
- Weekly cleaning: $125/week for pools up to 30K gallons, no chemicals included. $150+ for larger pools.
- Monthly package: $600/month, chemicals included.
- Pool opening: starts at $595. Includes cover removal, equipment startup, shock, chemical balance, vacuum, inspection.
- Pool closing: starts at $400.
- One-time cleaning: depends on condition, usually $150-$300.
- Above ground pools: add $25.
- Heater service: add $35.

SERVICES:
- Weekly cleaning: skim, vacuum, brush, baskets, chemistry test & balance, filter check
- Pool opening: cover removal, equipment startup, shock treatment, full chemical balance, vacuum, system inspection
- Pool closing: water level, line blowout, winterizing chemicals, plugs, cover
- One-time cleanup: green-to-clean, party prep, whatever they need
- Chemical balancing: full panel, standalone visit
- Equipment check: pump, filter, heater, salt cell, plumbing

AREAS SERVED:
Main Line PA: Gladwyne, Villanova, Haverford, Bryn Mawr, Ardmore, Radnor, Wayne, Berwyn, Malvern, West Chester, Newtown Square, Media, Glen Mills, Chadds Ford
Northern DE: Hockessin, Greenville, Centreville, Montchanin, Wilmington, Pike Creek, Newark, Yorklyn

KEY FACTS:
- No contracts. Ever.
- Brandon is the owner, Certified Pool Operator (CPO)
- Phone: (302) 496-6367, call or text
- Backed by Tri-State Aquatic Solutions
- Licensed and insured
- Spring openings book up fast

LEAD COLLECTION:
When someone seems interested, naturally ask for their info. Don't demand it all at once. Work it into conversation:
- "What's your name?" or "Who am I talking to?"
- "Where's your pool at?" (address or town)
- "Best number to reach you?"
- "Got an email for the quote?"
Once you have name + phone or email, say something like "Cool, I'm passing this to Brandon. He'll hit you up today." Then output a line starting with [LEAD] containing their info.

WHAT NOT TO DO:
- Don't give chemical dosing amounts (liability)
- Don't say "I'm just an AI" or break character
- Don't be wordy. Short and punchy.
- Don't use markdown formatting like **bold** or bullet lists. Plain text only.`;

async function submitLeadToGHL(info: {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
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
        source: "Pool Cleaning Dude Chatbot",
        tags: ["chatbot-lead"],
        customFields: info.message
          ? [{ key: "contact_message", field_value: info.message }]
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
          max_tokens: 250,
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
        // Extract info from the lead line
        const nameMatch = leadLine.match(
          /name:\s*([^,|]+)/i
        );
        const phoneMatch = leadLine.match(
          /phone:\s*([^,|]+)/i
        );
        const emailMatch = leadLine.match(
          /email:\s*([^,|]+)/i
        );

        await submitLeadToGHL({
          name: nameMatch?.[1]?.trim(),
          phone: phoneMatch?.[1]?.trim(),
          email: emailMatch?.[1]?.trim(),
          message: "Chatbot lead from poolcleaningdude.com",
        });

        // Remove the [LEAD] line from the response shown to user
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
          "Something glitched on my end. Text Brandon at (302) 496-6367, he'll take care of you.",
      },
      { status: 200 }
    );
  }
}
