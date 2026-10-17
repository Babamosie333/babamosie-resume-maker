import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import LandingPage from "@/app/(public)/[locale]/page";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import enMessages from "@/i18n/locales/en.json";
import { SITE_NAME, SITE_URL } from "@/config/site";

const SEO_BASE_URL = SITE_URL;

function resolveLocale(rawLocale: string): Locale {
  if (locales.includes(rawLocale as Locale)) {
    return rawLocale as Locale;
  }
  return defaultLocale;
}

function getLocaleSeo(locale: Locale) {
  const messages = enMessages;
  const title = `${messages.common.title} - ${messages.common.subtitle}`;
  const description = messages.common.description;
  const localeTag = "en_US";
  const canonical = `${SEO_BASE_URL}/${locale}`;

  return {
    title,
    description,
    localeTag,
    canonical,
  };
}

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    // The Chinese version was removed; keep old /zh links working.
    if (params.locale === "zh") {
      throw redirect({ to: "/$locale", params: { locale: "en" } });
    }
  },
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    const seo = getLocaleSeo(locale);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { name: "robots", content: "index,follow" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:locale", content: seo.localeTag },
        { property: "og:url", content: seo.canonical },
        { property: "og:image", content: `${SEO_BASE_URL}/web-shot.png` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo.title },
        { name: "twitter:description", content: seo.description },
        { name: "twitter:image", content: `${SEO_BASE_URL}/web-shot.png` },
      ],
      links: [
        {
          rel: "preload",
          href: "/fonts/landing/source-han-serif-500.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous" as const,
        },
        ...[400, 700].map((weight) => ({
          rel: "preload",
          href: `/fonts/landing/misans-${weight}.woff2`,
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous" as const,
        })),
        { rel: "canonical", href: seo.canonical },
        { rel: "alternate", hrefLang: locale, href: seo.canonical },
        { rel: "alternate", hrefLang: "x-default", href: `${SEO_BASE_URL}/en` },
      ],
    };
  },
  component: LocaleLandingPage,
});

function LocaleLandingPage() {
  const { locale } = Route.useParams();

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  return <LandingPage />;
}
