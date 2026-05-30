import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "First Cause · A Bilingual Atlas of the Landmark Chinese Popular-Science Series";
const TITLE_ZH = "第一推动 · 中国科普出版史上里程碑式丛书的双语图集";
const DESC =
  "A bilingual scholarly atlas of thirteen books from 「第一推动」(First Cause), the landmark popular-science series launched in 1992 by Hunan Science & Technology Press: Schrödinger's What Is Life?, Crick's Astonishing Hypothesis, Penrose's Emperor's New Mind, Thorne's Black Holes and Time Warps, Chandrasekhar's Shakespeare Newton Beethoven, Davis's Universal Computer, Nesse & Williams's Why We Get Sick, and more. Five subjects, twelve authors, sixty-three years of original publication — paired with the thematic threads that run through the series.";

export const metadata: Metadata = {
  metadataBase: new URL("https://first-cause-books.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "First Cause series", "第一推动", "Chinese popular science", "Hunan Science Press", "湖南科学技术出版社",
    "Schrödinger", "What is Life", "Crick", "Astonishing Hypothesis", "Penrose", "Emperor's New Mind",
    "Thorne", "Black Holes and Time Warps", "Chandrasekhar", "Shakespeare Newton Beethoven",
    "Martin Davis", "Universal Computer", "Engines of Logic", "Why We Get Sick", "Darwinian Medicine",
    "Kippenhahn", "100 Billion Suns", "Gribbin", "Laughlin", "Different Universe",
    "Coveney Highfield", "Arrow of Time", "Brockman", "Next Fifty Years",
    "薛定谔", "生命是什么", "克里克", "惊人的假说", "彭罗斯", "皇帝新脑",
    "索恩", "黑洞与时间弯曲", "钱德拉塞卡", "莎士比亚牛顿贝多芬",
    "马丁戴维斯", "逻辑的引擎", "我们为什么生病", "达尔文医学",
    "基彭哈恩", "千亿个太阳", "格里宾", "宇宙传记", "劳克林", "不同的宇宙",
    "考文尼", "时间之箭", "布罗克曼", "未来50年",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "First Cause · 第一推动 — A Bilingual Atlas of the Series" }],
    title: TITLE_EN,
    description:
      "Thirteen landmark popular-science books from 「第一推动」, presented bilingually with author profiles, themes, and a reading roadmap.",
    url: "https://first-cause-books.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description: "The books that taught a generation how to think about everything. A bilingual atlas of 「第一推动」.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#05060f" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://first-cause-books.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
              about: {
                "@type": "BookSeries",
                name: "第一推动 · First Cause",
                publisher: { "@type": "Organization", name: "湖南科学技术出版社 · Hunan Science & Technology Press" },
                inLanguage: "zh-CN",
              },
            }),
          }}
        />
      </head>
      <body className="bg-void-950 text-ghost-100 antialiased">
        {children}
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
