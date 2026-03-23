import { NextRequest, NextResponse } from "next/server";

const GHL_LOCATION_ID = "GRCLPh6B7KwWCf8PRIUt";
const GHL_PIT = "pit-7cbfd383-eae2-41cf-a850-9d3bc6125c93";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Split name into first/last
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Create or update contact in GHL
    const contactRes = await fetch(
      "https://services.leadconnectorhq.com/contacts/upsert",
      {
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
          phone,
          email: email || undefined,
          source: "Pool Cleaning Dude Website",
          tags: ["website-contact-form"],
          customFields: message
            ? [{ key: "contact_message", field_value: message }]
            : undefined,
        }),
      }
    );

    if (!contactRes.ok) {
      const errText = await contactRes.text();
      console.error("GHL contact upsert failed:", contactRes.status, errText);
      return NextResponse.json(
        { error: "Failed to submit. Please call us instead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please call us instead." },
      { status: 500 }
    );
  }
}
