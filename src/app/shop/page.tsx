import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    title: "August, The Boy Who Spoke to the Sun",
    price: 11.99,
    image: "/images/august-book.jpg",
    description:
      "A beautifully illustrated children's book about courage, love, and finding your inner light. Inspired by author Ecko Steadman's nephew, this story teaches that communication comes from the heart. Ages 3–8, suitable for classrooms and family reading.",
    category: "Children's Book",
  },
];

export default function Shop() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dark font-medium">Shop</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight mb-10">
          Shop
        </h1>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold text-dark mb-4">
                Product Categories
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <button className="hover:text-primary transition-colors text-left">
                    Children&apos;s Book
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Products */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full aspect-square bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-dark text-base">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-dark mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                    <button className="mt-3 w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-2.5 rounded-full transition-colors">
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
