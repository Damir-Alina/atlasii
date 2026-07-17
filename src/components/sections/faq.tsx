import { Accordion } from "@/components/ui";
import { FAQ_ITEMS } from "@/lib/constants";

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/60 bg-surface/40">
      <div className="container py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Частые вопросы
          </h2>
          <p className="mt-4 text-muted-foreground">
            Не нашли ответ? Напишите нам — раздел поддержки в футере.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <Accordion items={[...FAQ_ITEMS]} />
        </div>
      </div>
    </section>
  );
}
