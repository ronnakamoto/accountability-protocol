import { ReactNode, useState } from "react";

interface TabItem {
  id: number;
  title: string;
  content: ReactNode;
}

interface TabProps {
  items: TabItem[];
  defaultActive?: number;
}

export default function Tab({ items, defaultActive = 0 }: TabProps) {
  const [activeTab, setActiveTab] = useState(defaultActive);

  return (
    <div className="w-full">
      <div className="tabs">
        <div className="tab-nav">
          {items.map((item, index) => (
            <span
              key={item.id}
              className={`tab tab-lifted ${activeTab === index ? "tab-active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {item.title}
            </span>
          ))}
        </div>
      </div>
      <div className="tab-content mt-4 overflow-y-auto">
        {items.map((item, index) => (
          <div key={item.id} className={`tab-pane ${activeTab === index ? "block" : "hidden"}`}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
