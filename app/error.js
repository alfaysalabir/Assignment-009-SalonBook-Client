"use client";

export default function GlobalError({ reset }) {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center text-center">
      <div>
        <h1 className="text-5xl font-bold text-sage-900">Something went wrong</h1>
        <p className="mt-2 text-muted">An unexpected error happened. Please try again.</p>
        <button onClick={reset} className="btn-dark mt-6">Try Again</button>
      </div>
    </section>
  );
}
