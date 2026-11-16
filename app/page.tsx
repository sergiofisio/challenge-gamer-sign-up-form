import SignUpForm from "./components/sign-up-form";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[url('/assets/images/pattern-backdrop.svg')] bg-right bg-no-repeat opacity-70 lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(77_90%_59%/0.08),transparent_50%)]"
      />
      <SignUpForm />
    </main>
  );
}
