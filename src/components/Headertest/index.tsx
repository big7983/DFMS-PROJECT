import Link from "next/link";
import Image from "next/image";
import DropdownUser from "./DropdownUser";

const Header = () => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-2">
          {/* <!-- Hamburger Toggle BTN --> */}
          <Link
            href="/"
            className=" text-white bg-primary hover:bg-opacity-70 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>

            <span className="sr-only">Icon description</span>
          </Link>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="flex flex-row gap-2 lg:hidden" href="/">
            <Image
              width={40}
              height={40}
              src={"/images/KMITL.png"}
              alt="Logo"
            />
            <Image
              width={40}
              height={40}
              src={"/images/logo-ssi-clear-01.png"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4"></ul>

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
