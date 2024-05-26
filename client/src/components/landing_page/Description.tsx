import Link from "next/link";
import NoImage from "../placeholder/NoImage";
import Image from "next/image";
import DescriptionImage from "../../../public/images/10173124_8432.svg";

export default function Description() {
  return (
    <div className="grid grid-row-2 md:grid-cols-5 gap-x-8">
      <div className="rounded-xl min-h-48 mb-8 md:mb-0 md:order-last md:col-span-2">
        <Image priority src={DescriptionImage} alt="image"/>
      </div>
      <div className="flex flex-col justify-around md:col-span-3">
        <p className="text-lg text-center md:text-left">
          Wondering which companies to invest in? Unsure how much to put in each? Take the guesswork out of investing
          with our innovative AI tool. It analyzes complex financial reports to identify promising companies, then
          recommends how to distribute your investments for a personalized strategy.
        </p>
        <Link href="/upload">
          <button className="text-black bg-secondary-300 w-full py-2 rounded-lg hover:bg-yellow-400">Start</button>
        </Link>
      </div>
    </div>
  );
}
