import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "See real pools we clean across the Main Line PA and Northern Delaware. Before and after photos, green-to-clean transformations, and weekly maintenance results.",
  alternates: {
    canonical: `${siteConfig.url}/gallery`,
  },
};

const photos = [
  {
    src: "/images/gallery/pool-01.jpg",
    alt: "Pool Cleaning Dude branded service van",
    caption: "Our van on the road",
  },
  {
    src: "/images/gallery/pool-06.jpg",
    alt: "Green pool before cleaning service",
    caption: "Before: green and neglected",
    tag: "before",
  },
  {
    src: "/images/gallery/pool-05.jpg",
    alt: "Crystal clear pool after cleaning",
    caption: "After: crystal clear",
    tag: "after",
  },
  {
    src: "/images/gallery/pool-11.jpg",
    alt: "Swamp-green pool before restoration",
    caption: "Before: full swamp mode",
    tag: "before",
  },
  {
    src: "/images/gallery/pool-10.jpg",
    alt: "Clean restored pool after service",
    caption: "After: ready to swim",
    tag: "after",
  },
  {
    src: "/images/gallery/pool-03.jpg",
    alt: "Brandon Calloway poolside at a customer's home",
    caption: "Brandon on-site",
  },
];

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Our Work", url: `${siteConfig.url}/gallery` },
        ])}
      />

      <section className="bg-gradient-to-b from-sky-50 to-white py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Our Work
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real pools. Real results. No stock photos. This is what we actually
            do every week across the Main Line and Northern Delaware.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.src}
                className="relative rounded-xl overflow-hidden shadow-md group"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={600}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {photo.tag && (
                  <span
                    className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full ${
                      photo.tag === "before" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {photo.tag === "before" ? "BEFORE" : "AFTER"}
                  </span>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm font-medium">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        headline="Want Your Pool to Look Like This?"
        subtext="Call or text for a free quote. We respond fast."
      />
    </>
  );
}
