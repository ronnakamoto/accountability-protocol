import { useEffect, useState } from "react";
import ChartPanel from "./ChartPanel";
import OngoingInvestments from "./OngoingInvestments";
import VerticalStatistics from "./VerticalStatistics";

export default function InvestmentSummary() {
  const [investments, setInvestments] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);

  const getInvestments = async () => {
    return new Promise(resolve => {
      resolve([
        {
          id: 1,
          projectId: 1,
          project: {
            name,
          },
          amount: 1000,
          date: new Date(),
        },
        {
          id: 2,
          projectId: 2,
          project: {
            name,
          },
          amount: 2000,
          date: new Date(),
        },
      ]);
    });
  };

  const getProjects = () => {
    return fetch("/api/project").then(res => res.json());
  };

  useEffect(() => {
    getProjects().then((data: any) => {
      console.log(data);
      const ongoingProjects = data
        ?.filter((project: any) => project.status === "Pending")
        .map((project: any) => ({
          name: project.name,
          remainingAllocation: parseFloat(project.amountToRaise || 0) - parseFloat(project.amountRaised || 0) || 0,
          ...project,
        }));
      console.log("🚀 ~ file: InvestmentSummary.tsx:50 ~ getProjects ~ ongoingProjects:", ongoingProjects);
      setProjects(ongoingProjects);
    });
  }, []);

  useEffect(() => {
    getInvestments().then((investments: any) => {
      setInvestments(investments);
    });
  }, []);

  return (
    <>
      <div className="row-start-1 row-span-1 grid grid-cols-9 m-4">
        <div className="col-start-1 col-span-1 p-2 h-full">
          <VerticalStatistics
            data={[
              {
                title: "Total Projects",
                value: investments.length,
                change: 0,
                changeType: "up",
                changePercentage: 0,
              },
              {
                title: "Total Invested",
                value: investments.reduce((acc: any, investment: any) => acc + (investment.amount || 0), 0),
                change: 0,
                changeType: "down",
                changePercentage: 0,
              },
              {
                title: "Average ROI",
                value: "8%",
                change: 0,
                changeType: "up",
                changePercentage: 0,
              },
            ]}
          />
        </div>
        <div className="col-start-2 col-span-5 p-2 flex h-full">
          <ChartPanel />
        </div>
        <div className="col-start-7 col-span-3 p-2 flex h-[49vh]">
          <OngoingInvestments projects={projects} />
        </div>
      </div>
    </>
  );
}
