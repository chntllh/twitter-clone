type LabelledSelectorTab = {
  tab: string;
  tabName: string;
};

type LabelledSelectorTabsProps = {
  tabs: LabelledSelectorTab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};
