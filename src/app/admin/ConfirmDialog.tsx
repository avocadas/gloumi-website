"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { btn, btnDanger, btnQuiet, input, STROKE } from "./ui";

export type ConfirmOptions = {
  title: string;
  /** Pastraipos po antrašte: kas nutiks, kas dingsta kartu. */
  body?: (string | null | undefined)[];
  confirmLabel: string;
  danger?: boolean;
  /** Rodyti nebūtiną priežasties lauką; ji keliauja į administratorių žurnalą. */
  reason?: boolean;
  /** Lauko pavadinimas, jei ne „Priežastis" (pvz. ginčo sprendimui — „Pastaba"). */
  reasonLabel?: string;
  /** Žodis, kurį reikia įrašyti, kad mygtukas įsijungtų. */
  typeToConfirm?: string;
};

export type ConfirmResult = { reason: string } | null;

/*
 * Vienas langas vietoj `window.confirm` + `window.prompt` (#129). Naršyklės
 * langai buvo du iš eilės, be jokio ryšio su skydeliu, o antrasis — priežastis —
 * atrodė kaip klaida, ne kaip dalis veiksmo. Čia viskas, ką žmogus turi žinoti
 * prieš trinant, matosi vienu metu, ir atšaukti galima bet kuriuo momentu
 * (Esc, fonas, „Atšaukti").
 *
 * Tikrasis `<dialog>` su `showModal()`: naršyklė pati laiko fokusą viduje,
 * uždaro Esc ir išjungia puslapį po juo — kiekvieną iš šių savo kodu būtų
 * lengva padaryti pusiau.
 *
 * Telefone langas išlenda iš apačios su rankenėle, kaip programėlės lapai;
 * kompiuteryje — kortelė viduryje.
 */
export function useConfirm(): [ReactNode, (options: ConfirmOptions) => Promise<ConfirmResult>] {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((result: ConfirmResult) => void) | null>(null);

  const ask = useCallback((next: ConfirmOptions) => {
    // Neatsakytas ankstesnis klausimas laikomas atšauktu, ne pamirštu.
    resolver.current?.(null);
    setOptions(next);
    return new Promise<ConfirmResult>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = useCallback((result: ConfirmResult) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
  }, []);

  const dialog = options ? <ConfirmDialog key={options.title} options={options} onSettle={settle} /> : null;
  return [dialog, ask];
}

function ConfirmDialog({
  options,
  onSettle,
}: {
  options: ConfirmOptions;
  onSettle: (result: ConfirmResult) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");
  const { title, body, confirmLabel, danger, typeToConfirm } = options;
  const matches = !typeToConfirm || typed.trim() === typeToConfirm;

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
  }, []);

  const confirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matches) return;
    onSettle({ reason: reason.trim() });
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault();
        onSettle(null);
      }}
      onClick={(e) => {
        // Paspaudimas už kortelės ribų — ant fono — reiškia „ne".
        if (e.target === e.currentTarget) onSettle(null);
      }}
      className="mt-auto mb-0 w-full max-w-full rounded-t-[24px] bg-white p-0 text-app-ink shadow-app-bar backdrop:bg-app-ink/40 sm:m-auto sm:w-[28rem] sm:rounded-[22px]"
    >
      <form onSubmit={confirm} className="p-6 font-app-sans">
        <span aria-hidden className="mx-auto -mt-2 mb-4 block h-1 w-10 rounded-full bg-app-border sm:hidden" />
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-app-danger-bg text-app-danger" : "bg-app-band text-app-ink"
            }`}
          >
            <CircleAlert size={20} strokeWidth={STROKE} aria-hidden />
          </span>
          <h2 id="confirm-title" className="pt-1.5 font-app-serif text-xl leading-snug">
            {title}
          </h2>
        </div>

        {body?.filter(Boolean).map((p, i) => (
          <p key={i} className="mt-3 text-sm leading-relaxed text-app-body">
            {p}
          </p>
        ))}

        {typeToConfirm ? (
          <label className="mt-5 block">
            <span className="text-[13px] font-semibold text-app-ink">
              Patvirtinkite: įrašykite „{typeToConfirm}“
            </span>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className={`${input} mt-2`}
            />
          </label>
        ) : null}

        {options.reason ? (
          <label className="mt-5 block">
            <span className="text-[13px] font-semibold text-app-ink">
              {options.reasonLabel ?? "Priežastis"}{" "}
              <span className="font-normal text-app-muted">— nebūtina, matys tik administratoriai</span>
            </span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus={!typeToConfirm}
              maxLength={500}
              rows={2}
              className={`${input} mt-2 h-auto resize-none py-3`}
            />
          </label>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => onSettle(null)} className={btnQuiet} autoFocus={!options.reason && !typeToConfirm}>
            Atšaukti
          </button>
          <button type="submit" disabled={!matches} className={danger ? btnDanger : btn}>
            {confirmLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
