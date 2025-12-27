import styles from './TabNavigation.module.scss';

interface Tab<T extends string> {
  value: T;
  label: string;
}

interface TabNavigationProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export const TabNavigation = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps<T>) => {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`${styles.tab} ${activeTab === tab.value ? styles.active : ''}`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
