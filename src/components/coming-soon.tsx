import Image from "next/image";

export default function ComingSoon() {
  return (
    <div className="h-content flex items-center justify-center p-16">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-primary rounded-full">
              <span className="text-md font-medium text-secondary">
                Coming soon
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-7xl leading-[120%] font-medium">
              We&apos;re cooking something special! 🍳
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our developers are currently in the kitchen, mixing the perfect
              blend of code and creativity. We promise it&apos;ll be worth the
              wait - no burnt features here!
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="relative overflow-hidden rounded-lg shadow-xl">
            <Image
              unoptimized
              src="/team.jpg"
              alt="Our team cooking up something special"
              width={600}
              height={400}
              className="w-full h-auto transform hover:scale-105 transition-transform duration-700 ease-out"
              style={{
                aspectRatio: "4/3",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
