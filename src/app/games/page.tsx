import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Games | Publishing Collectives",
  description:
    "Fun educational games for kids ages 3-8. Build words, blend sounds, and learn phonics!",
};

const GAMES = [
  {
    title: "Word Builder",
    description: "Drag letter tiles to spell words that match the picture!",
    href: "/word-builder",
    emoji: "\uD83D\uDD24",
    color: "bg-primary",
  },
  {
    title: "Phoneme Blender",
    description: "Blend sound segments together to build words and learn phonics!",
    href: "/phoneme-blender",
    emoji: "\uD83D\uDD0A",
    color: "bg-accent",
  },
];

export default function GamesPage() {
  return (
    <>
      <section className="bg-primary">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-dark tracking-tight">
            Games
          </h1>
          <p className="mt-2 text-lg text-dark/80 font-medium">
            Choose a game and start learning!
          </p>
        </div>
      </section>
      <section className="bg-light">
        <div className="max-w-3xl mx-auto px-4 py-12 grid sm:grid-cols-2 gap-6">
          {GAMES.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-6 flex flex-col items-center text-center gap-4 hover:scale-[1.02]"
            >
              <div
                className={`w-20 h-20 ${game.color} rounded-2xl flex items-center justify-center text-4xl`}
              >
                {game.emoji}
              </div>
              <h2 className="text-xl font-bold text-dark group-hover:text-primary transition-colors">
                {game.title}
              </h2>
              <p className="text-sm text-dark/60">{game.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
