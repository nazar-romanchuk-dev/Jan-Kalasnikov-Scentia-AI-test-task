'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import chartBar from '../public/assets/icons/chartbar.svg';
import mainLogo from '../public/assets/icons/logo.svg';
import userImage from '../public/assets/icons/user.svg';
import viewGrid from '../public/assets/icons/view-grid.svg';

export const Sidebar = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pathname = usePathname();

  if (!isClient) return null;

  return (
    <div className="rounded-3xl absolute bg-white top-0 bottom-0 left-0 my-6 border flex flex-col justify-between items-center py-6 px-3 ml-5">
      <div className="flex flex-col items-center gap-7 cursor-pointer">
        <div>
          <Link href="/">
            <Image src={mainLogo} alt="logo" />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/">
            <div className="p-2 w-full gap-2 flex flex-col items-center rounded-xl cursor-pointer">
              <Image src={chartBar} alt="Overview" />
              Overview
            </div>
          </Link>

          <Link href="/">
            <div
              className={`p-2 w-full flex gap-2 flex-col items-center rounded-xl cursor-pointer ${
                pathname === '/'
                  ? 'bg-black text-white'
                  : 'hover:bg-black hover:text-white'
              }`}
            >
              <Image src={viewGrid} alt="AI Tools" />
              AI Tools
            </div>
          </Link>
        </div>
      </div>
      <div>
        <Link href="/">
          <Image src={userImage} alt="user" />
        </Link>
      </div>
    </div>
  );
};
