import { twMerge } from "tailwind-merge";
import PerfectScrollbar from "react-perfect-scrollbar";

import signInBackground from "../assets/sign-in-background.jpg";

type AuthLayoutProps = {
  children?: React.ReactNode;
};

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={twMerge("h-screen w-screen flex", "bg-gray-100")}>
      <div
        className={twMerge(
          "flex-1 flex flex-col mx-auto justify-between w-1/2"
        )}
      >
        <PerfectScrollbar className="w-full overflow-visible">
          <main className="h-max min-h-full flex justify-center items-center sm:px-0 px-10">
            {children}
          </main>
        </PerfectScrollbar>
      </div>

      <div className={twMerge("flex-1 relative w-0 hidden", "lg:block")}>
        <img
          src={signInBackground}
          alt="background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export { AuthLayout };
