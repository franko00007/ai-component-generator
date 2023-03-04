import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
            <span style={{ color: '#7AAC9F'}}>AI</span> 2 <span style={{ color: '#7AAC9F'}}>UI </span>generator
        </h1>
      </Link>
      <a
        href="https://js2ts.com/"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          alt="ChatGPT Icon"
          src="/ChatGPT_logo.svg"
          className="sm:w-10 sm:h-[40px] w-10 h-[40px] rounded-full"
          width={32}
          height={28}
        />
      </a>
    </header>
  );
}