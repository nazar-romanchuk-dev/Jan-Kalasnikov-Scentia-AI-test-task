import { LessonPlanner } from '@components/LessonPlanner';

import Image from 'next/image';
import Link from 'next/link';

import arrowLeft from '../public/assets/icons/arrow-left.svg';

const Home = () => {
  return (
    <section className="flex-center flex-col w-[662px]">
      <div className="border bg-white w-full rounded-3xl mb-2 py-2 px-4 flex align-center items-center gap-2">
        <div>
          <Link href="/">
            <Image src={arrowLeft} alt="Go back" className="cursor-pointer" />
          </Link>
        </div>
        <div className="bg-black rounded-xl text-white px-5 py-2.5 cursor-default">
          Lesson planner
        </div>
      </div>
      <LessonPlanner />
    </section>
  );
};

export default Home;
