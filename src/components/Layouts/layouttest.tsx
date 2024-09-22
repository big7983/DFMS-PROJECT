"use client";
import Headertest from "@/components/Headertest";

export default function Layouttest({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="w-full">

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col">
          {/* <!-- ===== Header Start ===== --> */}
          <Headertest  />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="flex items-center justify-center p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
