import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 p-5 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-20 p-4 bottom-0 left-0 pointer-events-none">
          <SwitchTheme className="pointer-events-auto" />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <span>·</span>
            <div>
              Built with <HeartIcon className="inline-block h-4 w-4" /> by{" "}
              <a
                href="https://twitter.com/ronnakamoto"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                ronnakamoto.eth
              </a>
            </div>
            <span>·</span>
          </div>
        </ul>
      </div>
    </div>
  );
};
