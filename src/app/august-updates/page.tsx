import Image from "next/image";
import Link from "next/link";

export default function AugustUpdates() {
  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl md:text-5xl font-black text-dark tracking-tight">
          August&apos;s Updates
        </h1>

        <div className="mt-8 relative w-full max-w-2xl aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
          <Image
            src="/images/august.JPEG"
            alt="August — The Boy Who Spoke to the Sun"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-8 max-w-2xl">
          <p className="text-lg text-gray-700 leading-relaxed">
            August has officially turned <strong>5 years old</strong>! He
            continues to amaze everyone around him as he excels in both his
            communication and cognitive skills. August loves seeing himself in
            his very own book and truly enjoys reading along with his family.
            Every storytime is a celebration — watching him light up as the
            pages turn is a reminder of why this story was written in the first
            place. August&apos;s journey is proof that every child shines in
            their own way, and we couldn&apos;t be more proud of how far
            he&apos;s come.
          </p>
        </div>
      </div>
    </section>
  );
}
