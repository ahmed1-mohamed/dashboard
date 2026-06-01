"use client";

export default function ErrorPage() {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center mx-auto max-w-container px-4 md:px-banner-padding mt-24 mb-20 text-center relative overflow-hidden">
      <div className="relative z-10 mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight max-w-2xl">
          Something went wrong
        </h1>

        <p className="text-gray-700 text-xl mb-12 max-w-xl mx-auto leading-relaxed">
          We’re sorry, but something unexpected happened. Please try again later.
        </p>

        <p className="text-gray-500 text-sm mt-8">If the problem persists, feel free to contact support.</p>
      </div>
    </div>
  );
}
