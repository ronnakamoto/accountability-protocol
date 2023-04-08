import { useEffect, useReducer, useState } from "react";
import Collapse from "./Collapse";
import DatetimePicker from "./DateTimePicker";
import KeyValue from "./KeyValue";
import { format } from "date-fns";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

enum FieldType {
  Number = 1,
  String = 2,
  Date = 3,
}

export default function ManageMilestone({ project, onMilestoneCreatedOnchain }: any) {
  const [milestones, setMilestones] = useState<any>([]);
  const [isAddMilestoneLoading, setIsAddMilestoneLoading] = useState(false);
  const [addedMilestoneId, setAddedMilestoneId] = useState("");
  const [addMilestoneArgs, setAddMilestoneArgs] = useState<any>([]);
  const [isMilestoneHistoryLoading, setIsMilestoneHistoryLoading] = useState(false);
  const {
    writeAsync,
    isLoading: isAddMilestoneOnChainLoading,
    isSuccess,
  } = useScaffoldContractWrite({
    contractName: "AccountabilityProtocol",
    functionName: "addMilestone",
    args: [...(addMilestoneArgs as any)] as any,
  });

  const getMilestones = async () => {
    const response = await fetch(`/api/milestone?projectId=${project.id}`);
    if (response.ok) {
      const milestones: any = await response.json();
      setMilestones(milestones);
      setIsMilestoneHistoryLoading(false);
    } else {
      console.error("Error:", response.statusText);
    }
  };

  useEffect(() => {
    setIsMilestoneHistoryLoading(true);
    getMilestones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialState = {
    name: "",
    description: "",
    amountToUnlock: 0,
    deadline: new Date(),
    quorumType: "",
    quorumThreshold: 0,
  };

  const reducer = (state: any, action: any) => {
    const { payload } = action;
    switch (action.type) {
      case "SET_FIELD": {
        return {
          ...state,
          [payload.field]: payload.value,
        };
      }
      case "RESET_FORM": {
        return initialState;
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = (field: string, value: any, type: FieldType = FieldType.String) => {
    let formattedValue: any = value;
    switch (type) {
      case FieldType.Number:
        formattedValue = parseInt(value);
        break;
      case FieldType.Date:
        formattedValue = Math.floor(value.getTime() / 1000);
        break;
      default:
    }
    dispatch({
      type: "SET_FIELD",
      payload: {
        field,
        value: formattedValue,
      },
    });
  };

  const saveMilestoneOffchain = async (milestone: any) => {
    milestone.deadline = new Date(milestone.deadline * 1000);
    const response = await fetch("/api/milestone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(milestone),
    });

    if (response.ok) {
      const milestone: any = await response.json();
      setAddedMilestoneId(milestone.id);
      setMilestones([...milestones, milestone]);
    } else {
      console.error("Error:", response.statusText);
    }
  };

  useEffect(() => {
    const saveDetailsOnchain = async () => {
      try {
        if (!addMilestoneArgs.length) {
          throw new Error("No data to save on chain");
        }
        await writeAsync();
      } catch (e) {
        console.log(e);
      }
    };

    if (!addMilestoneArgs.length) {
      return;
    }
    saveDetailsOnchain().then(() => {
      setIsAddMilestoneLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMilestoneArgs]);

  useEffect(() => {
    if (!isAddMilestoneOnChainLoading) {
      dispatch({ type: "RESET_FORM" });
    }
  }, [isAddMilestoneOnChainLoading]);

  useEffect(() => {
    if (isSuccess) {
      if (onMilestoneCreatedOnchain) {
        onMilestoneCreatedOnchain({ ...state, id: addedMilestoneId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, state]);

  const quorumTypeOnchainMap: Record<string, number> = {
    FixedValue: 0,
    Percentage: 1,
    AdminOverride: 2,
  };

  const onAddMilestoneClicked = async (e: any) => {
    e.preventDefault();
    setIsAddMilestoneLoading(true);
    console.log(state);
    await saveMilestoneOffchain({ ...state, status: "NotStarted", projectId: project.id });
    setAddMilestoneArgs([
      project.projectId,
      state.name,
      state.description,
      state.amountToUnlock,
      state.deadline,
      state.quorumThreshold,
      quorumTypeOnchainMap[state.quorumType],
    ]);
  };

  const milestoneStatus: Record<string, string> = {
    NotStarted: "Not Started",
    InProgress: "In Progress",
    onHold: "On Hold",
    Completed: "Completed",
    Cancelled: "Cancelled",
    Claimed: "Claimed",
  };

  const addNewMilestone = (
    <>
      <div className="flex row text-lg font-extrabold mb-0">Add New Milestone</div>
      <div className="divider m-0 mb-1"></div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the name of the milestone?</span>
        </label>
        <input
          type="text"
          placeholder="Milestone name"
          className="input input-sm input-bordered w-full max-w-xs"
          value={state.name}
          onChange={e => onChange("name", e.target.value)}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Provide the description for the milestone</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Milestone details"
          value={state.description}
          onChange={e => onChange("description", e.target.value)}
        ></textarea>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the amount to unlock?</span>
        </label>
        <input
          type="number"
          placeholder="Amount to unlock"
          className="input input-sm input-bordered w-full max-w-xs"
          value={state.amountToUnlock}
          onChange={e => onChange("amountToUnlock", e.target.value, FieldType.Number)}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the deadline date & time for milestone?</span>
        </label>

        <DatetimePicker onChange={date => onChange("deadline", date, FieldType.Date)} />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Choose the quorum type</span>
        </label>
        <select
          className="select select-sm select-bordered"
          value={state.quorumType}
          onChange={e => onChange("quorumType", e.target.value)}
        >
          <option disabled selected value="">
            Pick one
          </option>
          <option value="FixedValue">Minimum Fixed Value Voting</option>
          <option value="Percentage">Percentage(Majority) Voting</option>
          <option value="AdminOverride">No Voting(Admin Override)</option>
        </select>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the quorum threshold?</span>
        </label>
        <input
          type="number"
          placeholder="Quorum threshold value"
          className="input input-sm input-bordered w-full max-w-xs"
          value={state.quorumThreshold}
          onChange={e => onChange("quorumThreshold", e.target.value, FieldType.Number)}
        />
      </div>
      <div className="flex row">
        <button className={`btn btn-sm btn-primary my-4`} onClick={onAddMilestoneClicked}>
          {isAddMilestoneLoading ? "Adding Milestone..." : "Add Milestone"}
        </button>
      </div>
    </>
  );

  const milestoneHistory = (
    <>
      <div className="flex row text-lg font-extrabold mb-0">Milestone History</div>
      <div className="divider m-0 mb-2"></div>
      <div className="flex mt-2 flex-col">
        {milestones.length ? (
          milestones.map((milestone: any, index: number) => {
            return (
              <Collapse
                key={index}
                title={`#${index + 1} ${milestone.name}`}
                content={
                  <div className="flex flex-col">
                    <KeyValue
                      data={{
                        Name: milestone.name,
                        "Unlock Amount": milestone.amountToUnlock,
                        "Deadline Date": format(new Date(milestone.deadline), "PPpp"),
                        "Quorum Type": milestone.quorumType,
                        "Quorum Threshold": milestone.quorumThreshold,
                      }}
                    />
                    <p className="font-light">{milestone.description}</p>
                  </div>
                }
                badgeContent={milestoneStatus[milestone.status]}
              />
            );
          })
        ) : (
          <div className="text-gray-500 font-light">
            {isMilestoneHistoryLoading
              ? "Loading milestones..."
              : "No milestones added yet. Please add one from the &quot;Add New Milestone&quot; panel on the left side of this panel"}
          </div>
        )}
      </div>
    </>
  );
  return (
    <div className="grid grid-cols-3">
      <div className="w-full pr-2 col-span-1">{addNewMilestone}</div>
      <div className="w-full pl-2 col-span-2">{milestoneHistory}</div>
    </div>
  );
}
