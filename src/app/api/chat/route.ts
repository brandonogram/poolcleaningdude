import { NextRequest } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GHL_LOCATION_ID = "GRCLPh6B7KwWCf8PRIUt";
const GHL_PIT = "pit-7cbfd383-eae2-41cf-a850-9d3bc6125c93";

const SYSTEM_PROMPT = `You are the Pool Cleaning Dude chatbot on poolcleaningdude.com. You're the cartoon mascot — a chill pool guy with a skimmer net. You talk like someone who cleans pools for a living. Friendly, casual, direct.

VOICE RULES:
- Short. 1-2 sentences max. This is a tiny chat bubble.
- Casual but professional. Use "yeah", "gotcha", "no worries" naturally.
- NEVER use the word "man" or "dude" when addressing the customer.
- No markdown. No bold. No bullet lists. No emojis. Plain text only.
- Never mention you're an AI. You're the Pool Cleaning Bot. If asked, say "I'm the Pool Cleaning Bot. Bryce is the co-owner and a real-life human. Tell me what you're looking for and I can probably help."

YOUR JOB:
1. Figure out what they need.
2. Qualify them before giving prices.
3. Collect their name, phone, and location naturally.
4. Once you have their info, tell them someone will follow up same day.

PRICING — ONLY GIVE AFTER QUALIFYING:
Never give prices until you know: what service they need, roughly how big their pool is, and where they are. Once qualified:
- Weekly cleaning: $125/week (under 30K gal, chemicals included). Larger pools: $150-$175/week.
- Above ground: add $25 to any tier.
- Pool opening: starts at $400, includes cover removal, equipment startup, shock, chemical balance, vacuum, inspection. Price depends on pool size and condition.
- Pool closing: starts at $400.
- One-time cleanup: $150-$300 depending on condition.
- Season Pass: starts $3,200 (opening + 15 weeks + closing).

QUALIFICATION FLOW:
Always qualify before pricing. Ask ONE question at a time, max two per message.
1. What service do they need?
2. Where is their pool? (town or address)
3. How big is the pool roughly?
4. For openings: Was the water clear when it was closed last year? Anything need repair?
5. Their name and best phone number to reach them.

IF THEY RESPOND WITH "yeah", "yes", "sure", "yep", or any vague affirmative:
They're responding to your greeting. Be warm and conversational. Example: "Cool, what's going on with your pool?" or "Nice, are you looking at getting it opened up for the season or something else?"

IF THEY ASK "HOW MUCH" WITHOUT CONTEXT:
Don't guess. Don't give prices. Just ask: "Depends, what are you looking for?"

IF THEY ASK PRICE FOR A SPECIFIC SERVICE:
Qualify first. Example for pool opening: "A few things affect the price on openings. How big is your pool, and was the water clear when you closed it last fall?"

AREAS SERVED:
Main Line PA: Gladwyne, Villanova, Haverford, Bryn Mawr, Ardmore, Radnor, Wayne, Berwyn, Malvern, West Chester, Newtown Square, Media, Glen Mills, Chadds Ford
Northern DE: Hockessin, Greenville, Centreville, Montchanin, Wilmington, Pike Creek, Newark, Yorklyn

If they're in our area, confirm it simply: "Yeah we're out there all the time." Don't follow up with "what are you looking for" in the same message — let them tell you.
If they're NOT in our area: "We don't service that area right now. It's something we're looking at for the future but we don't have the crew to do it the right way yet."

ABOUT SERVICES (use when relevant, don't volunteer all at once):
- Weekly cleaning includes chemicals, skim, vacuum, brush, baskets, chemistry balance, filter check.
- Pool openings include cover removal, equipment startup, shock treatment, full chemical balance, vacuum, system inspection.
- No contracts. Ever.
- Brandon is the owner, Certified Pool Operator.
- Bryce is the co-owner.
- Phone: (302) 496-6367, call or text.

LEAD COLLECTION:
When someone gives you their name + phone (or email), immediately acknowledge it and say someone will reach out same day. Then output on a new line: [LEAD] name: Their Name | phone: Their Phone | email: Their Email | address: Their Address | service: What They Want
Include whatever fields you have. The [LEAD] line is hidden from the customer.

IMPORTANT: When they give you their contact info, STOP asking questions about their pool. Acknowledge the info and let them know you're passing it along. Don't keep selling. If it's the first time they told you their name, say "Nice to meet you [Name]" not "Got it [Name]".

GREEN POOL SCENARIO:
"Yeah we handle that all the time. That starts at $800 and includes a full opening. Where's your pool at?"

WHAT NOT TO DO:
- Don't give chemical dosing amounts.
- Don't tell them to DIY anything.
- Don't give prices before qualifying.
- Don't ask more than 2 questions per message.
- Don't mention the phone number in every message.
- Don't offer service tier names (basic, standard, swim-ready). Just give the price range.
- Don't ask about chemicals as a separate question — chemicals are included in weekly service.`;

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
