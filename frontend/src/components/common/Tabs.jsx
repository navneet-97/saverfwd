import './Tabs.css';

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tabs">
      <div className="tabs__list">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`tabs__tab ${activeTab === tab.value ? 'tabs__tab--active' : ''}`}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="tabs__count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
