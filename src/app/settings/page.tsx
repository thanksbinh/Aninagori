'use client'

import { AiFillSetting } from "@react-icons/all-files/ai/AiFillSetting";
import { BsFillShieldLockFill } from "@react-icons/all-files/bs/BsFillShieldLockFill";
import { FaLock } from "@react-icons/all-files/fa/FaLock";
import { GiWireframeGlobe } from "@react-icons/all-files/gi/GiWireframeGlobe";
import { AiFillBell } from "@react-icons/all-files/ai/AiFillBell";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Settings() {
  const params = useSearchParams();

  useEffect(() => {
    console.log(params?.get('tab'));
  }, [])

  return (
    <div className="flex">
      <div className="w-[360px] h-screen py-20 px-2 bg-ani-gray border-r-[1px] border-ani-light-gray">
        <h2 className="text-ani-text-white font-bold text-2xl mb-4 px-4">Settings</h2>

        <div className="space-y-4">
          <div>
            <button className="w-full bg-ani-gray text-ani-text-white font-semibold py-2 px-4 rounded-md hover:bg-ani-light-gray text-left flex items-center">
              <AiFillSetting className="w-7 h-7" />
              <span className="px-4">General</span>
            </button>
          </div>

          <div>
            <button className="w-full bg-ani-gray text-ani-text-white font-semibold py-2 px-4 rounded-md hover:bg-ani-light-gray text-left flex items-center">
              <BsFillShieldLockFill className="w-7 h-7" />
              <span className="px-4">Security and login</span>
            </button>
          </div>

          <div>
            <button className="w-full bg-ani-gray text-ani-text-white font-semibold py-2 px-4 rounded-md hover:bg-ani-light-gray text-left flex items-center">
              <FaLock className="w-7 h-7" />
              <span className="px-4">Privacy</span>
            </button>
          </div>

          <div>
            <button className="w-full bg-ani-gray text-ani-text-white font-semibold py-2 px-4 rounded-md hover:bg-ani-light-gray text-left flex items-center">
              <GiWireframeGlobe className="w-7 h-7" />
              <span className="px-4">Language and Region</span>
            </button>
          </div>

          <div>
            <button className="w-full bg-ani-gray text-ani-text-white font-semibold py-2 px-4 rounded-md hover:bg-ani-light-gray text-left flex items-center">
              <AiFillBell className="w-7 h-7" />
              <span className="px-4">Notifications</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20 pl-6">
        Hello
      </div>
    </div>
  )
}