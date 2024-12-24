import { useState } from "react";
import LabelledSelectorTabs from "../components/ui/LabelledSelectorTabs";
import InfoUpdate from "../components/ui/Settings/InfoUpdate";
import SecurityUpdate from "../components/ui/Settings/SecurityUpdate";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("");

  const tabs: LabelledSelectorTab[] = [
    {
      tab: "info",
      tabName: "Account Information",
    },
    {
      tab: "security",
      tabName: "Change your password",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl px-8 pt-8 pb-4">Settings</h1>

      <div className="">
        <LabelledSelectorTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {activeTab === "info" && <InfoUpdate />}
      {activeTab === "security" && <SecurityUpdate />}
    </div>
  );
};

export default Settings;
