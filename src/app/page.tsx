import Image from "next/image";
import Link from "next/link";
import LeadCapture from "@/components/LeadCapture";

export default function Home() {
  return (
    <>
      <LeadCapture />

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
              <a
                href="https://www.amazon.com/August-Boy-Who-Spoke-Sun/dp/B0FZRJ3JP9/ref=sr_1_1?crid=1MYA1YI331BNR&dib=eyJ2IjoiMSJ9.ysZhkZQ5sZHG4EavUxNrOMiz0bFn4YYnBcicMt-9IRDGjHj071QN20LucGBJIEps.QUBbgHj1m5x3yHe5O-H555nBQVv8itFw6CqS7ZqVNdk&dib_tag=se&keywords=august+the+boy+who+spoke+to+the+sun&nsdOptOutParam=true&qid=1769632402&sprefix=august+the+b%2Caps%2C161&sr=8-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Shop now
              </a>
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

          {/* Read-Along Video */}
          <div className="mt-8 max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/HpSqxgL_0CM"
              title="August: The Boy Who Spoke to the Sun - Read Along"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

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
                <a
                  href="https://www.amazon.com/August-Boy-Who-Spoke-Sun/dp/B0FZRJ3JP9/ref=sr_1_1?crid=1MYA1YI331BNR&dib=eyJ2IjoiMSJ9.ysZhkZQ5sZHG4EavUxNrOMiz0bFn4YYnBcicMt-9IRDGjHj071QN20LucGBJIEps.QUBbgHj1m5x3yHe5O-H555nBQVv8itFw6CqS7ZqVNdk&dib_tag=se&keywords=august+the+boy+who+spoke+to+the+sun&nsdOptOutParam=true&qid=1769632402&sprefix=august+the+b%2Caps%2C161&sr=8-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Purchase – August: The Boy Who Spoke to the Sun
                </a>
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

      {/* ===================== STAY CONNECTED ===================== */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary uppercase leading-tight tracking-tight">
            Stay Connected
            <br />
            To Stories That
            <br />
            Heal And Inspire
          </h2>

          {/* Social Icons */}
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="https://www.facebook.com/people/Publishing-Collectives/61583699193418/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a
              href="https://www.instagram.com/publishingcollectives/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a
              href="https://www.tiktok.com/@publishingcollectives"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              aria-label="TikTok"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.33-6.33V9.17a8.16 8.16 0 0 0 4.8 1.58v-3.4a4.85 4.85 0 0 1-.91-.66Z"/></svg>
            </a>
            <a
              href="https://www.youtube.com/@PublishingCollectives"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              aria-label="YouTube"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>

          {/* Logo */}
          <div className="mt-12 flex justify-center">
            <div className="w-36 h-36 relative rounded-full overflow-hidden border-2 border-gray-300 bg-white">
              <Image
                src="/images/logo.png"
                alt="Publishing Collectives Logo"
                fill
                className="object-contain p-2"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="border-2 border-dark text-dark font-bold px-8 py-4 rounded-full hover:bg-dark hover:text-white transition-colors text-lg"
            >
              Follow Publishing Collectives
            </a>
            <Link
              href="/contact"
              className="border-2 border-dark text-dark font-bold px-8 py-4 rounded-full hover:bg-dark hover:text-white transition-colors text-lg"
            >
              Connect with Ecko
            </Link>
            <Link
              href="/august-updates"
              className="border-2 border-dark text-dark font-bold px-8 py-4 rounded-full hover:bg-dark hover:text-white transition-colors text-lg"
            >
              See August&apos;s Updates
            </Link>
            <Link
              href="/contact"
              className="border-2 border-dark text-dark font-bold px-8 py-4 rounded-full hover:bg-dark hover:text-white transition-colors text-lg"
            >
              Publish Your Book with Publishing Collectives
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
