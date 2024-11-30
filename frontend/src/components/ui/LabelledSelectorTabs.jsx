const LabelledSelectorTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-600">
      {tabs.map((tab) => (
        <button
          key={tab.tab}
          className={`flex-1 py-4 text-center relative hover:bg-neutral-900 ${
            activeTab === tab.tab ? "font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab(tab.tab)}
        >
          <span className="inline-block">{tab.tabName}</span>
          {activeTab === tab.tab && (
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-blue-500 rounded-full"
              style={{ width: `${tab.tabName.length}ch` }}
            ></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default LabelledSelectorTabs;
