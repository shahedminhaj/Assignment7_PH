import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-green-50 py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium mb-3">
            বাজার দর, ৮ অক্টোবর, ২০২৬
          </span>
          <h1 className="text-3xl md:text-5xl font-bold my-4 text-gray-800">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <a
            href="#all-products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition"
          >
            সব পণ্য দেখুন
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/bazar-hero.png"
            alt="Bazar Hero"
            width={400}
            height={300}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}