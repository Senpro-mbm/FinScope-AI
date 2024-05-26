import Description from "@/components/landing_page/Description";
import Teams from "@/components/landing_page/Teams";
import Splash from "@/components/landing_page/Splash";
import Disclaimer from "@/components/landing_page/Disclaimer";
import FAQ from "@/components/landing_page/FAQ";

export default function Home() {
  function generateSeparator(isTopSide = true) {
    return isTopSide ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
        <path fill="#0199FE" d="M0,50C480,100,960,0,1440,50L1440,100L0,100Z" />
        <path fill="#017DD0" d="M0,50C480,0,960,100,1440,50L1440,100L0,100Z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
        <path fill="#0199FE" d="M0,50C480,0,960,100,1440,50L1440,0L0,0Z" />
        <path fill="#017DD0" d="M0,50C480,100,960,0,1440,50L1440,0L0,0Z" />
      </svg>
    );
  }
  return (
    <>
      <Splash />
      <div className="flex flex-col my-16 gap-y-8">
        <div className="px-12">
          <Description />
        </div>
        <div>
          <div className="translate-y-px">{generateSeparator(true)}</div>
          <div className="flex flex-col gap-y-16 bg-primary-600 p-12">
            <Teams />
            <FAQ />
          </div>
          <div className="-translate-y-px">{generateSeparator(false)}</div>
        </div>
        <div className="p-12">
          <Disclaimer />
        </div>
      </div>
    </>
  );
}
