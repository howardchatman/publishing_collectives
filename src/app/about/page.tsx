import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <>
      {/* ===================== ABOUT THE FOUNDER ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-200">
            <Image
              src="/images/ecko-steadman.jpg"
              alt="Ecko Steadman - Founder of Publishing Collectives"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight">
              About the Founder: Ecko Steadman
            </h1>

            <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
              <p>
                Ecko Steadman is an English teacher, lifelong poet, and
                storyteller focused on illuminating the beauty of human
                connection. With over a decade of experience teaching language
                and expression, she has dedicated herself to helping others find
                their voice and embrace their truth.
              </p>
              <p>
                Her debut children&apos;s book,{" "}
                <em>August: The Boy Who Spoke to the Sun</em>, was inspired by
                her nephew August—a bright, autistic child whose spirit and
                imagination demonstrate that communication transcends words
                through energy, love, and light.
              </p>
              <p>
                Her work weaves creativity and compassion, merging her passion
                for healing, storytelling, and education. Through her writing,
                she aims to uplift children and families by demonstrating that
                every child has a voice worth hearing and a light worth
                honoring.
              </p>
              <p>
                When not writing, she teaches, creates holistic wellness
                content, or explores the integration of art, heart, and healing
                through her brand{" "}
                <strong>Echoing Holistic Health</strong>.
              </p>
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-block bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Connect with Ecko
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== MISSION ===================== */}
      <section className="bg-light">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-dark tracking-tight">
            Our Mission at Publishing Collectives
          </h2>

          <div className="mt-6 space-y-4 text-gray-700 leading-relaxed text-left md:text-center">
            <p>
              Publishing Collectives believes in the power of story to heal,
              connect, and inspire. Founded by Ecko Steadman, our mission is to
              create space for voices that illuminate truth, celebrate diversity,
              and nurture authenticity in readers of all ages.
            </p>
            <p>
              We are more than a publishing house—we are a movement of
              storytellers, dreamers, and educators who believe that words can
              change the world. Our goal is to uplift underrepresented voices,
              empower creators to tell their stories fearlessly, and bring
              heart-centered books into homes, schools, and communities
              everywhere.
            </p>
          </div>

          <p className="mt-8 text-xl font-bold text-dark italic">
            &ldquo;Every voice matters. Every story shines.&rdquo;
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-block bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Join Publishing Collectives
          </Link>
        </div>
      </section>
    </>
  );
}
