import LabelledSelectorTabs from "../components/ui/LabelledSelectorTabs";
import { useState } from "react";
import AllNotifications from "../components/ui/Notifications/AllNotifications";
import MentionNotifications from "../components/ui/Notifications/MentionNotifications";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("mentions");

  const tabs: LabelledSelectorTab[] = [
    { tab: "all", tabName: "All" },
    { tab: "mentions", tabName: "Mentions" },
  ];

  return (
    <div className="">
      <div className="p-4 text-2xl font-bold">Notifications</div>

      <LabelledSelectorTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "all" && <AllNotifications />}
      {activeTab === "mentions" && <MentionNotifications />}
    </div>
  );
};

export default Notifications;
