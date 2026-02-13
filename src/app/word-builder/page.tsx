import type { Metadata } from "next";
import WordBuilderGame from "@/components/word-builder/WordBuilderGame";

export const metadata: Metadata = {
  title: "Word Builder Game | Publishing Collectives",
  description:
    "A fun drag-and-drop spelling game for kids! Drag the letter tiles to spell the word that matches the picture.",
};

export default function WordBuilderPage() {
  return (
    <>
      <section className="bg-primary">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-dark tracking-tight">
            Word Builder
          </h1>
          <p className="mt-2 text-lg text-dark/80 font-medium">
            Drag the letters to spell the word!
          </p>
        </div>
      </section>
      <section className="bg-light">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <WordBuilderGame />
        </div>
      </section>
    </>
  );
}
