"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

/*
 * Cloudflare Turnstile valdiklis: admin prisijungimas (developeris 2026-10-16)
 * ir viešas `/2fa-pagalba` (security 2026-10-18).
 *
 * Įsijungia tik su `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (viešas raktas – valdiklio
 * adresas, ne paslaptis). Be jo valdiklio nėra ir prisijungimas lieka toks,
 * koks buvo: kol Supabase CAPTCHA neįjungta, žetono niekas netikrina.
 *
 * Skriptas kraunamas tik puslapyje su valdikliu ir tik iš `challenges.cloudflare.com`.
 * Jį įterpia mūsų (nonce'u pažymėtas) kodas, tad griežta CSP su
 * `'strict-dynamic'` jį praleidžia; valdiklio rėmeliui – `frame-src` (`csp.ts`).
 */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")));
      script.onerror = () => {
        loading = null;
        reject(new Error("turnstile"));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

export type TurnstileHandle = { reset: () => void };

/**
 * `onToken(null)` – žetono nėra (dar neišspręsta, pasibaigė ar klaida).
 * Žetonas vienkartinis: panaudojus jį, kviečiamas `reset()`, ir valdiklis
 * išduoda naują kitam žingsniui.
 */
export function Turnstile({
  siteKey,
  action,
  onToken,
  ref,
}: {
  siteKey: string;
  /** Cloudflare `action` – kuriam veiksmui žetonas (matomas Cloudflare analitikoje ir tikrinant). */
  action: string;
  onToken: (token: string | null) => void;
  ref?: Ref<TurnstileHandle>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const tokenCallback = useRef(onToken);

  useEffect(() => {
    tokenCallback.current = onToken;
  }, [onToken]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      tokenCallback.current(null);
      if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !box.current) return;
        widget.current = api.render(box.current, {
          sitekey: siteKey,
          action,
          theme: "light",
          // „flexible“ reikia bent 300 px; siauresnėje vietoje (320 px telefonas) – „compact“ (150 × 140), kad neišsikištų.
          size: box.current.clientWidth >= 300 ? "flexible" : "compact",
          callback: (token: string) => tokenCallback.current(token),
          "expired-callback": () => tokenCallback.current(null),
          "error-callback": () => tokenCallback.current(null),
        });
      })
      .catch(() => tokenCallback.current(null));
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, action]);

  return <div ref={box} className="min-h-[65px]" />;
}
