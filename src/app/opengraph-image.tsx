import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from "@/components/brand/Wordmark";
import { copy } from "@/content/copy";
import { site } from "@/content/site";

export const alt = copy.seo.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Satori reads ttf/otf/woff only; this UA makes Google Fonts answer with one TTF. */
const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`, {
      headers: { "User-Agent": LEGACY_UA },
    }).then((res) => (res.ok ? res.text() : ""));
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/**
 * The share card: the app icon and wordmark over the site's cream, the
 * headline in Cormorant. Rendered once at build time. If Google Fonts is
 * unreachable during the build, the card falls back to the bundled default
 * face rather than failing the build.
 */
export default async function OpenGraphImage() {
  const [serif, sans, markSvg] = await Promise.all([
    loadGoogleFont("Cormorant+Garamond", 600),
    loadGoogleFont("DM+Sans", 500),
    readFile(join(process.cwd(), "public", "brand", "gloumi-mark.svg"), "utf8"),
  ]);
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;
  const fonts = [
    ...(serif ? [{ name: "Cormorant", data: serif, style: "normal" as const, weight: 600 as const }] : []),
    ...(sans ? [{ name: "DM Sans", data: sans, style: "normal" as const, weight: 500 as const }] : []),
  ];
  const serifFamily = serif ? "Cormorant" : undefined;
  const sansFamily = sans ? "DM Sans" : undefined;

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
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
