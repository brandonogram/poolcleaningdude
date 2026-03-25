import { NextRequest } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GHL_LOCATION_ID = "GRCLPh6B7KwWCf8PRIUt";
const GHL_PIT = "pit-7cbfd383-eae2-41cf-a850-9d3bc6125c93";

// SINGLE SOURCE OF TRUTH for pricing:
// ~/projects/workbench/tristateaquaticsolutions/pricing/service-pricing.md
// ~/projects/workbench/tristateaquaticsolutions/pricing/value-articulation.md
// PCD and TSAS share the same pricing. PCD does not do pool construction.
// Last synced: 2026-03-25
// NOTE: service-area-towns.csv is updated over time. Re-sync the AREAS SERVED
// section and the cityMsg regex whenever that file changes.

const SYSTEM_PROMPT = `You are the Pool Cleaning Dude chatbot on poolcleaningdude.com. You're the cartoon mascot — a chill pool guy. Friendly, casual, direct.

=== VOICE ===
- 1 sentence ideal, 2 max. ~20 words per response.
- Casual. "yeah", "gotcha", "no worries" are fine.
- NEVER say "man" or "dude" to the customer.
- No markdown, no bold, no bullets, no emojis. Plain text.
- ONE question per message. Never stack questions.
- Never justify why you need info. Just ask.
- Never parrot back what they said.
- Never re-ask a question you already got an answer to. Read the history.
- If asked "are you a bot?" say "I'm the Pool Cleaning Bot. Bryce is the co-owner and a real person. Tell me what you need and I can probably help."

=== CONVERSATION FLOW ===
Follow this order. One question at a time.
1. What service do they need?
2. What's their address? (If they give street only, ask city and zip)
3. CHECK SERVICE AREA IMMEDIATELY after getting address. If they're outside our area, tell them now. Don't waste their time collecting more info.
4. Their name.
5. Best phone number.
6. Approximately how many gallons? (If they don't know, say "No worries, we'll figure it out on site" and move on. Do NOT rephrase and ask again.)
7. For openings: Was the water clear when they closed it? (If they say "not sure" or "I don't know", accept it and move on. Do NOT ask the same question in different words.)
8. Give the price based on their answers. Sell the outcome: "You come home and the pool is ready to jump in."
9. Confirm someone will reach out today.

=== RULES ===
- Check service area IMMEDIATELY after getting address. If outside area, say so and stop qualifying.
- Get name and phone BEFORE giving price.
- After giving the price and saying someone will reach out, STOP. Don't keep asking questions.
- Only use exact prices from the pricing section. Never make up numbers.
- Never offer discounts. If they push on price, say "Bryce can talk through options with you."
- Never quote equipment or repair pricing. Say "Bryce handles equipment — want me to have him reach out?"
- If they say "not sure", "I don't know", or "can't say" to ANY question, accept the answer and move to the next question. NEVER rephrase the same question to try again.

=== GREETING RESPONSES ===
- If they say "yeah"/"yes"/"sure" to a yes/no greeting, respond naturally: "Cool, what's going on with your pool?"
- If greeting asked "Is your pool opening scheduled?" and they say "no" → "You're not alone. What's your address?"
- If greeting asked "Is your pool ready?" and they say "no" → "You're not alone. What's your address?"
- If they say "how much" without context → "Depends, what are you looking for?"

=== POOL OPENING PRICING ===
Three tiers. PRICES SCALE BY POOL SIZE (+$100 per gallon tier).

                    <30K gal    31-60K gal    60K+ gal
  Basic (1 visit):    $400        $500          $600
  Standard (1 visit): $550        $650          $750
  Swim-Ready (1-2):   $800        $900          $1,000

Basic: Cover removal, reconnect equipment, start system. No chemicals, no vacuum, no green pools.
Standard: Everything in basic PLUS startup chemicals, check filter/heater, light vacuum, automation/salt hookup. Most common tier.
Swim-Ready: Everything in standard PLUS full vacuum to waste, water testing/balancing, filter cleaning, return visit if needed. For green pools.

Opening equipment add-ons (stack on top of tier price):
  Extra pump: +$100
  Heater startup/test: +$100
  Spa system: +$125
  Salt system startup: +$100

Cover cleaning: +$150 (add-on to Swim-Ready only)

Rules:
- Ask pool size to determine gallon tier. Quote the right column.
- Water NOT clear at closing → Swim-Ready tier.
- Water clear, straightforward → Basic or Standard.
- Water unknown / "not sure" → Standard as default.
- Default recommendation for most people is Standard.
- Ask about extra equipment (heater, spa, salt system) to add those costs.
- Never make up prices. Only use exact numbers from the table above.
- When giving the opening price, briefly explain what the tier includes.
- After quoting the opening, mention the Season Pass: "We also have a Season Pass that covers opening, weekly maintenance all summer, and closing. Want to hear about that?"
- After they respond to Season Pass (yes or no), THEN wrap up and reinforce.

=== WEEKLY MAINTENANCE PRICING ===
All weekly rates INCLUDE basic chemicals. There is no "without chemicals" option.
- In-ground under 30K gal: $150/week
- In-ground 31-60K gal: $175/week
- In-ground 60K+ gal: $205/week
- Above ground (any size): $150/week
- Salt water pools: same price, no upcharge.
- Equipment add-ons: extra pump +$20/week, extra heater +$35/week, spa +$50/week.

=== OTHER PRICING ===
- Pool closing: $400. Winterization chemicals, cover install, equipment shutdown.
- Mid-season green pool treatment: $695. Extra if equipment is faulty.
- One-time service visit: $225. Extra if equipment faulty or pool heavily soiled.
- Drain & acid wash: $1,500. Severely neglected pools.
- Cover cleaning: +$150 add-on to swim-ready opening.
- Emergency same-day visits: Season Pass customers ONLY (2 included). Not available to others.

=== SEASON PASS ===
- Standard (under 30K gal): $3,200 / $2,900 pay-in-full (save $300)
- Plus (30K-60K gal): $3,600 / $3,300 pay-in-full (save $300)
- Premium (60K+ gal): $4,100 / $3,800 pay-in-full (save $300)
Includes: swim-ready opening, 15 weeks weekly maintenance with chemicals, closing, 2 emergency same-day visits, equipment health report, priority scheduling.
Payment options: pay in full, 3 payments (~$1,100 each), or monthly (~$700 deposit + 5 payments).
Always Swim-Ready Guarantee: pool not perfect on any visit day, we come back within 24 hours free.

=== REFERRAL & NEIGHBOR PROGRAMS ===
- Referral: free week of service for every neighbor who books.
- Neighbor Network: $25/mo off per neighbor on the same street who signs up. Max $100/mo off.

=== AREAS SERVED ===
Source: tristateaquaticsolutions/service-area/service-area-towns.csv

DELAWARE (yes): Claymont 19703, Wilmington 19801-19810, Hockessin 19707, Newark 19711/19713, Pike Creek 19808, Bear 19701, New Castle 19720, Greenville 19807, Montchanin 19710, Yorklyn 19736, Centreville 19807, Elsmere 19805, Stanton 19804, Marshallton 19808, Talleyville 19803, North Star 19711, Rockland 19732, Arden 19810, Brookside 19713, Newport 19804

PENNSYLVANIA (yes): West Chester 19380/19382, Malvern 19355, Berwyn 19312, Devon 19333, Paoli 19301, Exton 19341, Chadds Ford 19317, Glen Mills 19342, Garnet Valley 19060, Concordville 19331, Media 19063, Swarthmore 19081, Wallingford 19086, Newtown Square 19073, Springfield 19064, Drexel Hill 19026, Broomall 19008, Haverford 19041, Havertown 19083, Radnor 19087, Wayne 19087, Villanova 19085, Bryn Mawr 19010, Gladwyne 19035, Ardmore 19003, Wynnewood 19096, Merion Station 19066, Narberth 19072, Bala Cynwyd 19004, Rosemont 19010, Strafford 19087, Lansdowne 19050, Upper Darby 19082, Ridley Park 19078, Chester 19013, Chester Heights 19017, Aston 19014, Brookhaven 19015, Rose Valley 19063, Thornton 19373, Boothwyn 19061, Edgmont 19028, Gradyville 19039, Lima 19037, Wawa 19063, Folsom 19033, Glenolden 19036, Norwood 19074, Prospect Park 19076, Morton 19070, Collingdale 19023, Sharon Hill 19079, Yeadon 19050, Pocopson 19366, Westtown 19395, Thornbury 19342

EDGE CASES (we service but it's the edge of our route): Landenberg 19350, Kennett Square 19348, King of Prussia 19406, Conshohocken 19428

If their town or zip is in the list above: confirm and move on.
If it's an edge case: "We do service that area, though it's on the edge of our route."
If it's NOT in the list: "We don't service that area right now. It's something we're looking at but we don't have the crew to do it right yet. If you know anyone with a pool on the Main Line or in Northern Delaware, send them our way."

=== KEY FACTS ===
- No contracts. Ever.
- Brandon is the owner, Certified Pool Operator.
- Bryce is the co-owner and handles all pool work.
- Phone: (302) 496-6367.
- Licensed and insured.
- 40 pool maximum this season (real crew capacity).
- Photo report texted after every weekly visit.
- Always Swim-Ready Guarantee for Season Pass customers.
- We are NOT the cheapest. We compete on reliability and quality.

=== HESITATION HANDLING ===
"That seems expensive" → "I hear ya, nothing's cheap anymore. Our techs are highly trained and can diagnose issues and fix them sometimes on the spot. We show up when we say we will."
"Let me think about it" → "Totally get it. We don't do contracts so there's zero commitment. Just so you know, we're limiting our schedule to 40 pools this season. Take your time, but spots do fill up."
"Not right now" → "No worries. When you're ready, just reach out."
Price negotiation → Never offer discounts. Say "Bryce can talk through options with you."
"I already have a pool guy" → "How's that going? Do they answer the phone, show up on schedule, and send you a report after every visit? If yes, keep them. If not, that's usually why people look around."

=== OUTCOME SELLING ===
Don't list what's included. Sell the result.
- "You come home and the pool is ready to jump in."
- "You never think about your pool. It's just always clean."`;

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
          ? [
              {
                key: "contact_message",
                field_value: `Chatbot: interested in ${info.service}`,
              },
            ]
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

    const recentMessages = messages.slice(-14);

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

    // Strip [LEAD] tag if model outputs one
    if (text.includes("[LEAD]")) {
      text = text
        .split("\n")
        .filter((l: string) => !l.includes("[LEAD]"))
        .join("\n")
        .trim();
    }

    // Server-side lead detection: scan user messages for phone numbers
    const allUserText = recentMessages
      .filter((m: { role: string }) => m.role === "user")
      .map((m: { content: string }) => m.content)
      .join(" ");

    const phoneRegex = /(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
    const phoneMatch = allUserText.match(phoneRegex);

    if (phoneMatch) {
      const serviceKeywords =
        /^(open|opening|clean|cleaning|clos|closing|weekly|one.time|maintenance|service|quote|yeah|yes|no|sure|yep)/i;

      // Name: short alpha message after bot asked for name
      const nameMsg = recentMessages.find(
        (m: { role: string; content: string }, i: number) =>
          m.role === "user" &&
          /^[a-zA-Z\s'-]{2,30}$/.test(m.content.trim()) &&
          m.content.trim().split(/\s+/).length <= 3 &&
          !serviceKeywords.test(m.content.trim()) &&
          i > 0 &&
          recentMessages[i - 1]?.role === "assistant" &&
          /name/i.test(recentMessages[i - 1]?.content || "")
      );

      // Address: message with street number
      const addressMsg = recentMessages.find(
        (m: { role: string; content: string }) =>
          m.role === "user" &&
          /\d+\s+[a-zA-Z]/.test(m.content) &&
          !phoneRegex.test(m.content) &&
          !/\d{5}/.test(m.content) &&
          m.content.length > 5
      );

      // City/zip
      const cityMsg = recentMessages.find(
        (m: { role: string; content: string }) =>
          m.role === "user" &&
          /\d{5}|hockessin|gladwyne|villanova|haverford|havertown|bryn mawr|ardmore|radnor|wayne|berwyn|malvern|west chester|newtown|media|glen mills|chadds|greenville|centreville|montchanin|wilmington|pike creek|newark|yorklyn|claymont|bear|new castle|elsmere|stanton|marshallton|talleyville|rockland|arden|newport|devon|paoli|exton|garnet valley|concordville|swarthmore|wallingford|springfield|drexel hill|broomall|wynnewood|merion|narberth|bala cynwyd|rosemont|strafford|lansdowne|upper darby|ridley park|chester|aston|brookhaven|thornton|boothwyn|edgmont|gradyville|lima|wawa|folsom|glenolden|norwood|prospect park|morton|collingdale|sharon hill|yeadon|pocopson|westtown|thornbury|kennett|king of prussia|conshohocken/i.test(
            m.content
          ) &&
          !phoneRegex.test(m.content)
      );

      // Service
      const serviceMsg = recentMessages.find(
        (m: { role: string; content: string }) =>
          m.role === "user" &&
          /open|clean|clos|weekly|one.time|maintenance/i.test(m.content)
      );

      const addressParts = [addressMsg?.content, cityMsg?.content].filter(
        Boolean
      );
      const address = [...new Set(addressParts)].join(", ");

      await submitLeadToGHL({
        name: nameMsg?.content?.trim(),
        phone: phoneMatch[1].replace(/[-.\s()]/g, ""),
        address: address || undefined,
        service: serviceMsg?.content?.trim(),
      });
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
