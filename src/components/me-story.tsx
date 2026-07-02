import Image from "next/image";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";
import { IMG } from "@/lib/images";

export function MeStory() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] flex items-end overflow-hidden"
    >
      <Image
        src={IMG.meStoryBg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/40" />

      <div
        aria-hidden
        className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 [writing-mode:vertical-rl] rotate-180 text-bone/90 font-display text-3xl md:text-4xl tracking-tight select-none z-10"
      >
        .me story
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] w-full px-6 md:px-10 pb-20 md:pb-28 pt-32">
        <h1
          id="me"
          className="font-display text-6xl md:text-7xl lg:text-[6rem] leading-none tracking-tight text-bone"
        >
          Hello!
        </h1>

        <p className="mt-8 max-w-2xl text-bone text-lg md:text-xl leading-relaxed text-balance">
          Me For me, tattooing is about leaving something special behind. It’s not just a job;
          it’s about capturing people’s stories, their emotions, and engraving them on their
          skin, making them timeless. I work primarily in fine line and micro-realism,
          creating each design from scratch, ensuring that every piece holds a meaning. Every
          tattoo is a part of someone’s life that will leave a mark.
        </p>

        <div className="mt-10">
          <Link
            href="#works"
            className="group inline-flex items-center gap-2 text-bone text-lg md:text-xl border-b border-bone/60 pb-1 hover:text-gold hover:border-gold transition-colors"
          >
            learn more
            <ChevronsRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
