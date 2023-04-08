import KeyValue from "./KeyValue";
import { useAppStore } from "~~/services/store/store";

export default function OngoingInvestments({ projects, onInvestClicked }: any) {
  const setProjectToInvestIn = useAppStore((state: any) => state.setProjectToInvestIn);

  const handleInvestClicked = (project: any) => {
    setProjectToInvestIn(project);
    if (onInvestClicked) {
      onInvestClicked(project);
    }
  };
  return (
    <div className="flex flex-col ml-2 p-2 shadow shadow-slate-600">
      <h2 className="flex-none text-lg font-bold m-2">Ongoing Investments</h2>
      <div className="divider m-0"></div>
      <div className="flex-1 overflow-y-auto pr-2">
        {projects?.length ? (
          projects?.map((project: any) => (
            <div className="card w-96 bg-base-100 shadow h-fit my-2" key={project.id}>
              <div className="card-body p-2">
                <KeyValue
                  data={{
                    "Project Name": project.name,
                    "Remaining Allocation": project.remainingAllocation,
                  }}
                />
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-xs" onClick={() => handleInvestClicked(project)}>
                    Invest
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="font-light">No ongoing investments</div>
        )}
      </div>
    </div>
  );
}
