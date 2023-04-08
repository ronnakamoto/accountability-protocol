type VerticalStat = {
  title: string;
  value: string;
  change?: string | React.ReactNode;
  changePercentage?: string | React.ReactNode;
  changeType?: "up" | "down" | "neutral";
};

interface VerticalStatisticsProps {
  data: VerticalStat[];
}

const changeTypeIcon: Record<string, string> = {
  up: "↗︎",
  down: "↘︎",
  neutral: "↔︎",
};

export default function VerticalStatistics({ data }: VerticalStatisticsProps) {
  return (
    <div className="stats stats-vertical shadow">
      {data.map((stat, index) => (
        <div className="stat" key={index}>
          <div className="stat-title font-light">{stat.title}</div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-desc">
            {stat?.changeType && changeTypeIcon[stat?.changeType]} {stat?.change}{" "}
            {stat?.changePercentage && `(${stat?.changePercentage}%)`}
          </div>
        </div>
      ))}
    </div>
  );
}
