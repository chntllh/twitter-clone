import { useState } from "react";
import { useSelector } from "react-redux";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import FloatingLabelTextArea from "../components/ui/FloatingLabelTextArea";
import LabelledSelectorTabs from "../components/ui/LabelledSelectorTabs";

const Settings = () => {
  const { currentUser } = useSelector((state: RootState) => state.user) || {};

  const [activeTab, setActiveTab] = useState<string>("");

  const [username, setUsername] = useState<string>(currentUser.username);
  const [displayName, setDisplayName] = useState<string>(
    currentUser.displayName
  );
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

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

  const resetStates = () => {
    setUsername(currentUser.username);
    setDisplayName(currentUser.displayName);
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleTab = (tab: string) => {
    resetStates();
    setActiveTab(tab);
  };

  console.log(username, displayName);

  return (
    <div>
      <h1 className="text-4xl px-8 pt-8 pb-4">Settings</h1>

      <div className="">
        <LabelledSelectorTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={handleTab}
        />
      </div>

      {activeTab === "info" && (
        <div className="p-4">
          <div className="pb-4">
            <FloatingLabelInput
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="pb-4">
            <FloatingLabelInput
              id="displayName"
              label="Display Name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        </div>
      )}
      {activeTab === "security" && (
        <div className="p-4">
          <div className="pb-4">
            <FloatingLabelInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error=""
            />
          </div>
          <div className="pb-4">
            <FloatingLabelInput
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="pb-4">
            <FloatingLabelInput
              id="confirnNewPassword"
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          <button className="bg-blue-500 px-5 py-1 rounded-full">Save</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
