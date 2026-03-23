import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Pool Cleaning Dude is a locally owned pool service on the Main Line and Northern Delaware. No corporate overhead, no contracts, no runaround. Honest pool care from people who give a damn.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` },
        ])}
      />

      <section className="bg-gradient-to-b from-sky-50 to-white py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            About Pool Cleaning Dude
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re not a franchise. We&apos;re not a corporation. We&apos;re
            the people who actually clean your pool.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Brandon photo */}
          <div className="flex justify-center">
            <Image
              src="/images/brandon-pool.jpg"
              alt="Brandon Calloway, owner of Pool Cleaning Dude, poolside"
              width={160}
              height={160}
              className="rounded-full shadow-lg border-4 border-sky-100 w-32 h-32 object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              The Short Version
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Pool Cleaning Dude started because we got tired of hearing the
              same story from homeowners: &ldquo;My last pool guy
              disappeared.&rdquo; Missed appointments, no communication, dirty
              pools. We figured there had to be room for someone who just...
              shows up and does the work. Turns out there was.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              How We&apos;re Different
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-sky-500 font-bold text-lg shrink-0">
                  1.
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">No contracts.</h3>
                  <p className="text-gray-600 text-sm">
                    We earn your business every single week. If we don&apos;t
                    deliver, you walk. Simple as that.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-sky-500 font-bold text-lg shrink-0">
                  2.
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Honest pricing.
                  </h3>
                  <p className="text-gray-600 text-sm">
                    The price we quote is the price you pay. No surprise fees,
                    no &ldquo;chemical surcharges&rdquo; that magically appear on
                    your bill.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-sky-500 font-bold text-lg shrink-0">
                  3.
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    We actually communicate.
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Call or text us and you&apos;ll hear back the same day. If
                    something&apos;s wrong with your pool, we tell you. If
                    something&apos;s fine, we tell you that too.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-sky-500 font-bold text-lg shrink-0">
                  4.
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">Local.</h3>
                  <p className="text-gray-600 text-sm">
                    We live here. We clean pools here. Your money stays in the
                    community, not in some corporate HQ in another state.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Backed by Tri-State Aquatic Solutions
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Pool Cleaning Dude is the service and maintenance arm of Tri-State
              Aquatic Solutions. While Tri-State handles pool installations and
              larger projects, Pool Cleaning Dude is focused on one thing:
              keeping your pool clean and your water clear. Same team, same
              quality — just dedicated to the maintenance side.
            </p>
          </div>
        </div>
      </section>

      <CTABanner
        headline="Ready to Ditch Your Unreliable Pool Guy?"
        subtext="Give us one shot. If you're not happy, you owe us nothing."
      />
    </>
  );
}
