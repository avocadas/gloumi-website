import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from "@/components/brand/Wordmark";
import { getCopy } from "@/content/copy";
import type { Lang } from "@/content/lang";
import { site } from "@/content/site";


export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * The two faces are read from disk, not fetched.
 *
 * They used to come from Google Fonts during the build, which made the build
 * non-deterministic: on 2026-09-14 a deployment failed while prerendering the
 * English card with "Cannot read properties of undefined (reading 'split')",
 * because one of the two requests came back empty and the layout was left
 * asking for a font that had not loaded. The same commit had built cleanly
 * minutes before. Reading from disk removes the network from the build.
 *
 * Read once at module scope, as the Next.js documentation shows, so the two
 * cards do not read the files twice.
 */
const FONT_DIR = join(process.cwd(), "assets", "fonts");
const serif = await readFile(join(FONT_DIR, "CormorantGaramond-SemiBold.ttf"));
const sans = await readFile(join(FONT_DIR, "DMSans-Medium.ttf"));

export async function renderOgImage(lang: Lang) {
  const copy = getCopy(lang);
  const markSvg = await readFile(join(process.cwd(), "public", "brand", "gloumi-mark.svg"), "utf8");
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;
  const fonts = [
    { name: "Cormorant", data: serif, style: "normal" as const, weight: 600 as const },
    { name: "DM Sans", data: sans, style: "normal" as const, weight: 500 as const },
  ];
  const serifFamily = "Cormorant";
  const sansFamily = "DM Sans";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #F9F6F0 0%, #F4ECE6 100%)",
          color: "#2D2320",
          position: "relative",
          fontFamily: sansFamily,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -220,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(143,61,38,0.22) 0%, rgba(143,61,38,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -220,
            bottom: -280,
            width: 640,
            height: 640,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(122,51,80,0.18) 0%, rgba(122,51,80,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={92} height={92} style={{ borderRadius: 24 }} alt="" />
          <svg viewBox={WORDMARK_VIEWBOX} width={214} height={74} fill="#55223A">
            {WORDMARK_PATHS.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontFamily: serifFamily,
              fontSize: 84,
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            {copy.seo.ogHeadline}
          </div>
          <div style={{ fontSize: 30, color: "#6B5D57" }}>{copy.seo.ogSub}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#6B5D57",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#8F3D26" }} />
            {site.url.replace(/^https?:\/\//, "")}
          </div>
          <div>{copy.seo.ogStores}</div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
