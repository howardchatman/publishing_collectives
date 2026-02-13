import type { Metadata } from "next";
import PhonemeBlenderGame from "@/components/phoneme-blender/PhonemeBlenderGame";

export const metadata: Metadata = {
  title: "Phoneme Blender Game | Publishing Collectives",
  description:
    "A fun drag-and-drop phonics game for kids! Drag sound segments together to blend and build words. Learn letter sounds, blends, digraphs, and vowel teams!",
};

export default function PhonemeBlenderPage() {
  return (
    <>
      <section className="bg-accent">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-dark tracking-tight">
            Phoneme Blender
          </h1>
          <p className="mt-2 text-lg text-dark/80 font-medium">
            Drag the sounds together to blend the word!
          </p>
        </div>
      </section>
      <section className="bg-light">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <PhonemeBlenderGame />
        </div>
      </section>
    </>
  );
}
