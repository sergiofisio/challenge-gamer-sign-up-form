import SignUpForm from "./components/sign-up-form";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-5 py-10 md:px-10 lg:px-16 xl:px-20">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 hidden h-[960px] w-[960px] -translate-y-1/2 translate-x-[18%] bg-contain bg-center bg-no-repeat opacity-80 lg:block"
        style={{
          backgroundImage: `url('${basePath}/assets/images/pattern-backdrop.svg')`,
        }}
      />
      <SignUpForm />
    </main>
  );
}
