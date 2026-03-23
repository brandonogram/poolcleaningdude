import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import CTABanner from "@/components/CTABanner";

function WaveDecoration() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg
        className="relative block w-full h-16 sm:h-24"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C150,80 350,0 500,40 C650,80 800,20 1000,50 C1100,65 1150,55 1200,60 L1200,120 L0,120 Z"
          fill="white"
        />
        <path
          d="M0,60 C200,90 400,30 600,60 C800,90 1000,40 1200,70 L1200,120 L0,120 Z"
          fill="white"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

function PoolBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Decorative bubbles */}
      <div className="absolute top-20 left-[10%] w-4 h-4 rounded-full bg-white/10 animate-pulse" />
      <div className="absolute top-32 right-[15%] w-6 h-6 rounded-full bg-white/[0.07]" />
      <div className="absolute top-16 right-[30%] w-3 h-3 rounded-full bg-white/[0.12] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-[20%] w-5 h-5 rounded-full bg-white/[0.08]" />
      <div className="absolute top-40 left-[45%] w-2 h-2 rounded-full bg-white/[0.15] animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-40 right-[25%] w-8 h-8 rounded-full bg-white/[0.05]" />
      <div className="absolute top-24 left-[70%] w-3 h-3 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: "0.5s" }} />

      {/* Subtle water caustics pattern using SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pool-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 50 Q25 30, 50 50 T100 50" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M0 25 Q25 5, 50 25 T100 25" stroke="white" strokeWidth="1" fill="none"/>
            <path d="M0 75 Q25 55, 50 75 T100 75" stroke="white" strokeWidth="1" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pool-pattern)"/>
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sky-900 via-sky-700 to-cyan-500 py-24 sm:py-32 px-4 overflow-hidden">
        <PoolBubbles />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Small water drop icon above heading */}
          <div className="flex justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 40 44" className="drop-shadow-lg" aria-hidden="true">
              <path
                d="M20 2 C20 2 6 18 6 28 C6 35.18 12.268 41 20 41 C27.732 41 34 35.18 34 28 C34 18 20 2 20 2Z"
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
              />
              <ellipse cx="20" cy="30" rx="7" ry="2.5" fill="rgba(255,255,255,0.15)"/>
              <circle cx="16" cy="22" r="2" fill="rgba(255,255,255,0.25)"/>
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
            Your Pool Guy on the Main Line.{" "}
            <span className="text-cyan-300">No Contracts.</span>
          </h1>
          <p className="text-lg sm:text-xl text-sky-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pool Cleaning Dude keeps your pool crystal clear all season long.
            Reliable weekly service, honest pricing, and no long-term
            commitments. Serving the Main Line, Chester County, and
            Northern Delaware.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-sky-700 shadow-lg hover:bg-sky-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              Call {siteConfig.phoneFormatted}
            </a>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
          {/* Van photo */}
          <div className="mt-12 mx-auto max-w-2xl">
            <Image
              src="/images/pcd-van.jpg"
              alt="Pool Cleaning Dude service van"
              width={940}
              height={627}
              className="rounded-2xl shadow-2xl border-2 border-white/20"
              priority
            />
          </div>
        </div>
        <WaveDecoration />
      </section>

      {/* Trust bar */}
      <section className="border-y border-gray-100 py-6 px-4">
        <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 font-medium">
          <span>No Contracts</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>Licensed &amp; Insured</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>Locally Owned</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>Satisfaction Guaranteed</span>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Pool Services That Actually Show Up
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            We keep it simple. You call, we show up, your pool stays clean. No
            upsells, no runaround.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.services.map((service) => (
              <div
                key={service.slug}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="text-sky-600 font-semibold hover:text-sky-700 transition-colors"
            >
              View All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteConfig.testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
              >
                <p className="text-gray-700 italic leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="text-sm font-semibold text-gray-900">
                  {t.name}{" "}
                  <span className="font-normal text-gray-500">
                    &mdash; {t.location}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Before &amp; After
          </h2>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
            Green to clean. This is what we do.
          </p>
          <div className="space-y-8">
            {/* Pair 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/gallery/pool-06.jpg"
                  alt="Green pool before cleaning"
                  width={600}
                  height={800}
                  className="w-full h-64 object-cover"
                />
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEFORE
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/gallery/pool-05.jpg"
                  alt="Crystal clear pool after cleaning"
                  width={600}
                  height={800}
                  className="w-full h-64 object-cover"
                />
                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  AFTER
                </span>
              </div>
            </div>
            {/* Pair 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/gallery/pool-11.jpg"
                  alt="Swamp-green neglected pool before service"
                  width={600}
                  height={800}
                  className="w-full h-64 object-cover"
                />
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEFORE
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/gallery/pool-10.jpg"
                  alt="Same pool restored to crystal clear water"
                  width={600}
                  height={800}
                  className="w-full h-64 object-cover"
                />
                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  AFTER
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Serving the Main Line PA &amp; Northern Delaware
          </h2>
          <p className="text-gray-600 mb-8">
            We clean pools across the Main Line, Chester County, Delaware
            County, and Northern Delaware. If you&apos;re nearby, we&apos;ve
            got you covered.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {siteConfig.serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-sky-300 hover:text-sky-700 transition-colors"
              >
                {area.name}, {area.state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
