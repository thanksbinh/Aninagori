'use client'

import { BiBell } from "@react-icons/all-files/bi/BiBell";
import { AiFillSetting } from "@react-icons/all-files/ai/AiFillSetting";
import { BsFillShieldLockFill } from "@react-icons/all-files/bs/BsFillShieldLockFill";
import { BiLock } from "@react-icons/all-files/bi/BiLock";
import { GiWireframeGlobe } from "@react-icons/all-files/gi/GiWireframeGlobe";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { settings } from "../constants/settingTabNames";
import { createQueryString } from "./createQueryString";
import { AiOutlineAppstore } from "@react-icons/all-files/ai/AiOutlineAppstore";

type TabBtnProps = {
  tab: string;
  children: React.ReactNode;
};

export default function TabSelector() {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (!searchParams?.has('tab') || !settings.includes(searchParams.get('tab')!)) {
      router.push('/settings?' + createQueryString(searchParams, 'tab', 'account'));
      return;
    }

    setActiveTab(searchParams.get('tab')!);
  }, [searchParams])

  function TabBtn({ tab, children }: TabBtnProps) {
    return (
      <div>
        <button
          onClick={() => {
            router.push('/settings?' + createQueryString(searchParams, 'tab', tab));
          }}
          className={`w-full bg-ani-gray text-ani-text-white font-semibold p-4 rounded-md hover:bg-ani-light-gray text-left flex items-center ${(activeTab === tab) ? 'bg-ani-light-gray' : ''}`}
        >
          {children}
        </button>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-ani-text-white font-bold text-2xl mb-4 px-4">Settings</h2>

      <div>
        <TabBtn tab="account">
          <AiFillSetting className="w-7 h-7" />
          <span className="px-4">General</span>
        </TabBtn>

        <TabBtn tab="security">
          <BsFillShieldLockFill className="w-7 h-7" />
          <span className="px-4">Security and login</span>
        </TabBtn>

        <TabBtn tab="privacy">
          <BiLock className="w-7 h-7" />
          <span className="px-4">Privacy</span>
        </TabBtn>

        <TabBtn tab="language">
          <GiWireframeGlobe className="w-7 h-7" />
          <span className="px-4">Language</span>
        </TabBtn>

        <TabBtn tab="notifications">
          <BiBell className="w-7 h-7" />
          <span className="px-4">Notifications</span>
        </TabBtn>

        <TabBtn tab="applications">
          <AiOutlineAppstore className="w-7 h-7" />
          <span className="px-4">Applications</span>
        </TabBtn>
      </div>
    </>
  )
}

