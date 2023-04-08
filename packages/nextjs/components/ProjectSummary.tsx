import CustomStep from "./CustomStep";
import KeyValue from "./KeyValue";
import MilestoneDetailCard from "./MilestoneDetailCard";
import Tab from "./Tab";
import { Address } from "./scaffold-eth";
import { format } from "date-fns";

export default function ProjectSummary({ project }: any) {
  const ProjectDetails = (
    <>
      <h1 className="text-lg font-extrabold mb-0">{project?.name}</h1>
      <div className="divider m-0 mb-2"></div>
      <KeyValue
        data={{
          "Project Admin": <Address address={project?.payee} format={"short"} />,
          "Start Date": format(new Date(project?.startDate), "PPpp"),
          "End Date": format(new Date(project?.endDate), "PPpp"),
          "Created By": <Address address={project?.createdBy} format={"short"} />,
          "Progress(USDT)": `${Math.floor((project?.amountRaised / project?.amountToRaise) * 100)}%`,
        }}
      />
    </>
  );

  const ProjectStats = (
    <>
      <div className="stats stats-vertical shadow">
        <div className="stat text-center py-1">
          <div className="stat-title">Amount To Raise</div>
          <div className="stat-value text-lg">{project?.amountToRaise || 0}</div>
        </div>

        <div className="stat text-center py-1">
          <div className="stat-title">Amount Raised</div>
          <div className="stat-value text-lg">{project?.amountRaised || 0}</div>
        </div>

        <div className="stat text-center py-1">
          <div className="stat-title">Minimum Investment</div>
          <div className="stat-value text-lg">{project?.minInvestment || 0}</div>
        </div>

        <div className="stat text-center py-1">
          <div className="stat-title">Maximum Investment</div>
          <div className="stat-value text-lg">{project?.maxInvestment || 0}</div>
        </div>
      </div>
    </>
  );

  const milestones = [
    {
      id: 1,
      name: "Milestone 1",
      description: "This is the first milestone",
      isActive: false,
      isCompleted: true,
    },
    {
      id: 2,
      name: "Milestone 2",
      description: "This is the second milestone",
      isActive: false,
      isCompleted: true,
    },
    {
      id: 3,
      description: (
        <MilestoneDetailCard
          name="Milestone 3"
          description="This is milestone #3"
          amountToUnlock={2000}
          quorumType="Percentage"
          quorumThreshold={50}
          status="Pending"
        />
      ),
      isActive: true,
      isCompleted: false,
    },
  ];

  const tabItems = [
    {
      id: 1,
      title: "Project Description",
      content: <div>{project?.description}</div>,
    },
    {
      id: 2,
      title: "Milestones",
      content: (
        <div>
          <CustomStep items={milestones} />
        </div>
      ),
    },
    {
      id: 3,
      title: "Investors",
      content: <div>Content for Tab 3</div>,
    },
  ];

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 place-content-between" style={{ gridTemplateRows: "auto auto" }}>
      <div className="col-span-2">{ProjectDetails}</div>
      <div className="col-span-1">{ProjectStats}</div>
      <div className="col-span-3">
        <Tab items={tabItems} />
      </div>
    </div>
  );
}
