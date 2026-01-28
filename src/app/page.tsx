import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ===================== HERO SECTION ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="/images/hero.jpg"
              alt="Publishing Collectives event with books and community"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right - Text */}
          <div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-dark">
              Where Voices Rise
              <br />
              and Stories Shine.
            </h1>
            <p className="mt-6 text-lg font-bold text-dark leading-relaxed">
              At <em>Publishing Collectives</em>, We Believe Every Story Has The
              Power To Change Hearts, Open Minds, And Light The Way For Others.
            </p>
            <p className="mt-2 text-base font-semibold text-dark">
              If YOU also wish to Inspire, Empower, and Illuminate...
            </p>
            <p className="mt-1 text-base text-gray-700 leading-relaxed">
              Join us as we build a movement of storytellers who dare to dream,
              create, and share their light with the world.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-block bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Shop now
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Join The Collective
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED BOOK: AUGUST ===================== */}
      <section className="bg-light">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-black text-center text-dark mb-2">
            🎶 Sing Along and &ldquo;Shine Like August&rdquo;
          </h2>

          <div className="mt-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Book Image */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
              <Image
                src="/images/august-book.jpg"
                alt="August: The Boy Who Spoke to the Sun - Book Cover"
                fill
                className="object-cover"
              />
            </div>

            {/* Book Info */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-dark">
                August: The Boy Who Spoke to the Sun
              </h3>
              <p className="text-lg text-gray-600 mt-1">By Ecko Steadman</p>

              <p className="mt-4 text-base text-gray-700 leading-relaxed">
                A heartfelt debut children&apos;s story about curiosity, courage,
                and the unspoken language of love. Inspired by the author&apos;s
                autistic nephew, this beautifully illustrated book celebrates the
                power of connection beyond words.
              </p>

              <ul className="mt-6 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✦</span>
                  Perfect for family storytime and classroom libraries
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✦</span>
                  Sparks conversations about empathy, diversity, and
                  self-expression
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✦</span>
                  Ages 3–8
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✦</span>
                  Available in hardcover and eBook
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-block bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Purchase – August: The Boy Who Spoke to the Sun
                </Link>
                <Link
                  href="/shop"
                  className="inline-block border-2 border-dark text-dark font-semibold px-6 py-3 rounded-full hover:bg-dark hover:text-white transition-colors"
                >
                  View All Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== UPCOMING RELEASE ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="inline-block bg-accent text-dark text-sm font-bold px-4 py-1 rounded-full mb-4">
                Upcoming Release
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-dark">
                The Amazing Dancing Kaylee
              </h3>
              <p className="text-lg text-gray-600 mt-1">By Ecko Steadman</p>

              <p className="mt-4 text-base text-gray-700 leading-relaxed">
                A vibrant story about rhythm, confidence, and the light that
                lives in every child&apos;s movement. This joyful book celebrates
                self-expression through music and the power of family
                encouragement.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-block bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Notify Me
              </Link>
            </div>

            {/* Image placeholder */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
              <Image
                src="/images/kaylee-book.jpg"
                alt="The Amazing Dancing Kaylee - Upcoming Book"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
