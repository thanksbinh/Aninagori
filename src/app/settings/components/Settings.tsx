'use client'

import { UserInfo } from "@/global/UserInfo.types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { settings } from "../constants/settingTabNames";
import AccountSettings from "./settingTabs/AccountSettings";
import ApplicationsSettings from "./settingTabs/ApplicationsSettings";
import LanguageSettings from "./settingTabs/LanguageSettings";
import NotificationsSettings from "./settingTabs/NotificationsSettings";
import PrivacySettings from "./settingTabs/PrivacySettings";
import SecuritySettings from "./settingTabs/SecuritySettings";

export default function Settings({ myUserInfo }: { myUserInfo: UserInfo }) {
  const searchParams = useSearchParams()!;
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (!searchParams?.has('tab') || !settings.includes(searchParams.get('tab')!)) {
      setActiveTab('account');
      return;
    }

    setActiveTab(searchParams.get('tab')!);
  }, [searchParams])

  return activeTab === 'account' ? (
    <AccountSettings id={myUserInfo.id} name={myUserInfo.name || ""} username={myUserInfo.username} email={myUserInfo.email || ""} />
  ) : activeTab === 'security' ? (
    <SecuritySettings />
  ) : activeTab === 'privacy' ? (
    <PrivacySettings />
  ) : activeTab === 'language' ? (
    <LanguageSettings />
  ) : activeTab === 'notifications' ? (
    <NotificationsSettings />
  ) : activeTab === 'applications' ? (
    <ApplicationsSettings id={myUserInfo.id} username={myUserInfo.username} mal_connect={myUserInfo.mal_connect} />
  ) : (
    null
  )
}