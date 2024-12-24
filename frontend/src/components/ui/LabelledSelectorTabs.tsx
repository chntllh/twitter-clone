const LabelledSelectorTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: LabelledSelectorTabsProps) => {
  return (
    <div className="flex border-b border-gray-600">
      {tabs.map((tab) => (
        <button
          key={tab.tab}
          className={`flex-1 py-4 text-center relative hover:bg-gray-300 hover:bg-opacity-30  overflow-hidden ${
            activeTab === tab.tab ? "font-bold" : ""
          }`}
          onClick={() => setActiveTab(tab.tab)}
        >
          <span className="inline-block">{tab.tabName}</span>
          {activeTab === tab.tab && (
            <div className="absolute h-1 text-transparent pt-1 bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-500 rounded-full">
              {tab.tabName}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default LabelledSelectorTabs;
