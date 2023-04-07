import { useEffect, useReducer, useState } from "react";
import DatetimePicker from "../DateTimePicker";
import { AddressInput } from "../scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const dateTomorrow = new Date();
dateTomorrow.setDate(dateTomorrow.getDate() + 1);

enum FieldType {
  Number = 1,
  String = 2,
  Date = 3,
}

export default function CreateProject({
  onProjectCreatedOnchain,
  onProjectDraftSaved,
}: {
  onProjectCreatedOnchain: (data: any) => void;
  onProjectDraftSaved: (data: any) => void;
}) {
  const initialState = {
    projectName: "",
    projectDescription: "",
    amountToRaise: 0,
    minInvestment: 0,
    maxInvestment: 0,
    walletAddress: "",
    startDate: new Date(),
    endDate: dateTomorrow,
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

  const [isSaveDraftButtonLoading, setIsSaveDraftButtonLoading] = useState(false);
  const [isSubmitButtonLoading, setIsSubmitButtonLoading] = useState(false);
  const [createNewProjectArgs, setCreateNewProjectArgs] = useState([]);

  const {
    writeAsync,
    isLoading: isCreateProjectOnChainLoading,
    isSuccess,
  } = useScaffoldContractWrite({
    contractName: "AcccountabilityProtocol",
    functionName: "createNewProject",
    args: [...(createNewProjectArgs as any)] as any,
  });

  useEffect(() => {
    if (!isCreateProjectOnChainLoading) {
      dispatch({ type: "RESET_FORM" });
    }
  }, [isCreateProjectOnChainLoading]);

  useEffect(() => {
    if (isSuccess) {
      onProjectCreatedOnchain(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, state]);

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

  const saveDetailsOffChain = async (payload: any) => {
    try {
      const { name } = payload;
      if (!name) {
        throw new Error("Project name is required");
      }
      const response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await response.json();
        setCreateNewProjectArgs(Object.values(state));
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const saveDetailsOnchain = async () => {
    try {
      await writeAsync();
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmitClicked = async (e: any) => {
    setIsSubmitButtonLoading(true);
    e.preventDefault();
    const dataToSaveOffchain = {
      name: state.projectName,
      description: state.projectDescription,
      amountToRaise: state.amountToRaise,
      minInvestment: state.minInvestment,
      maxInvestment: state.maxInvestment,
      payee: state.walletAddress,
      startDate: new Date(state.startDate * 1000),
      endDate: new Date(state.endDate * 1000),
      status: "Pending",
    };
    await saveDetailsOffChain(dataToSaveOffchain);
    await saveDetailsOnchain();
    setIsSubmitButtonLoading(false);
  };

  const onSaveDraftClicked = async (e: any) => {
    setIsSaveDraftButtonLoading(true);
    e.preventDefault();
    const dataToSaveOffchain = {
      name: state.projectName,
      description: state.projectDescription,
      amountToRaise: state.amountToRaise,
      minInvestment: state.minInvestment,
      maxInvestment: state.maxInvestment,
      payee: state.walletAddress,
      startDate: new Date(state.startDate * 1000),
      endDate: new Date(state.endDate * 1000),
      status: "Draft",
    };
    await saveDetailsOffChain(dataToSaveOffchain);
    setIsSaveDraftButtonLoading(false);
    onProjectDraftSaved(state);
  };

  const CreateProjectForm = (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the name of the project?</span>
        </label>
        <input
          type="text"
          placeholder="Project name"
          className="input input-sm input-bordered w-full max-w-xs"
          value={state.projectName}
          onChange={e => onChange("projectName", e.target.value)}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Provide the description of the project raise?</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Project raise details"
          value={state.projectDescription}
          onChange={e => onChange("projectDescription", e.target.value)}
        ></textarea>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the amount you plan to raise?</span>
        </label>
        <input
          type="number"
          placeholder="Amount to raise"
          className="input input-sm input-bordered w-full max-w-xs"
          value={state.amountToRaise}
          onChange={e => onChange("amountToRaise", e.target.value, FieldType.Number)}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the minimum an investor can invest?</span>
        </label>
        <input
          type="number"
          placeholder="Minimum investment required"
          className="input input-sm input-bordered w-full max-w-xs"
          value={state.minInvestment}
          onChange={e => onChange("minInvestment", e.target.value, FieldType.Number)}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the maximum an investor can invest?</span>
        </label>
        <input
          type="number"
          placeholder="Maximum investment"
          className="input input-sm input-bordered w-full max-w-xs"
          value={state.maxInvestment}
          onChange={e => onChange("maxInvestment", e.target.value, FieldType.Number)}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the wallet address of the Project/Payee?</span>
        </label>

        <AddressInput
          value={state.walletAddress}
          onChange={payeeWalletAddress => {
            console.log("payeeWalletAddress: ", payeeWalletAddress);
            onChange("walletAddress", payeeWalletAddress);
          }}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the start date & time for the raise?</span>
        </label>

        <DatetimePicker onChange={date => onChange("startDate", date, FieldType.Date)} />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the end date & time for the raise?</span>
        </label>

        <DatetimePicker value={dateTomorrow} onChange={date => onChange("endDate", date, FieldType.Date)} />
      </div>
      <div className="flex row justify-end">
        <button
          className={`btn btn-sm btn-primary my-4 mr-2 ${isSaveDraftButtonLoading ? "loading" : ""}`}
          onClick={onSaveDraftClicked}
        >
          {isSaveDraftButtonLoading ? "Saving..." : "Save Draft"}
        </button>
        <button
          className={`btn btn-sm btn-primary my-4 mr-2 ${isSubmitButtonLoading ? "loading" : ""}`}
          onClick={onSubmitClicked}
        >
          {isSubmitButtonLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );

  return <>{CreateProjectForm}</>;
}
