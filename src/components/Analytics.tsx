"use client";

import Script from "next/script";
import posthog from "posthog-js";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GTM_ID = "GTM-WK69CW77";
const GA4_ID = "G-HS91JX3MHT";
const META_PIXEL_ID = "1450089306162928";
const POSTHOG_KEY = "phc_coeTLrzdu6Sa1QamyXR3ysiKdlagXCT322TPjRDDxUU";

export default function Analytics() {
  const pathname = usePathname();
  const posthogInitialized = useRef(false);

  // Initialize PostHog once
  useEffect(() => {
    if (!posthogInitialized.current && typeof window !== "undefined") {
      posthog.init(POSTHOG_KEY, {
        api_host: "https://us.i.posthog.com",
        person_profiles: "always",
        capture_pageview: false,
      });
      posthogInitialized.current = true;
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.dataLayer) {
      w.dataLayer.push({ event: "page_view", page_path: pathname });
    }
    if (w.fbq) {
      w.fbq("track", "PageView");
    }
    if (posthogInitialized.current) {
      posthog.capture("$pageview", { $current_url: pathname });
    }
  }, [pathname]);

  return (
    <>
      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* GA4 */}
      <Script
        id="ga4"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}
      </Script>

      {/* Meta Pixel - init stub then load script */}
      <Script id="meta-pixel-init" strategy="beforeInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');`}
      </Script>
      <Script
        id="meta-pixel-sdk"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
