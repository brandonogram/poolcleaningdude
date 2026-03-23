import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Pool Cleaning Dude for a free quote on pool cleaning services on the Main Line PA and Northern Delaware. Call or fill out our form.",
  alternates: {
    canonical: `${siteConfig.url}/contact-us`,
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Contact Us", url: `${siteConfig.url}/contact-us` },
        ])}
      />

      <section className="bg-gradient-to-b from-sky-50 to-white py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Want a free quote? Have a question? Just want to talk pools? Hit
              us up. We respond fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Call or Text
                </h2>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-2xl font-bold text-sky-600 hover:text-sky-700"
                >
                  {siteConfig.phoneFormatted}
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  We answer calls during business hours. Text anytime.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Service Area
                </h2>
                <p className="text-gray-600">
                  The Main Line (Gladwyne, Villanova, Bryn Mawr, Wayne,
                  Radnor, and more), Chester and Delaware Counties, and
                  Northern Delaware (Hockessin, Greenville, Wilmington, Newark).
                  If you&apos;re nearby, we probably cover your area too.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Follow Us
                </h2>
                <div className="flex gap-4">
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Facebook
                  </a>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
