import { useState } from "react";
import KeyValue from "./KeyValue";
import { Address } from "./scaffold-eth";
import { format } from "date-fns";

export default function Invest({ project }: any) {
  console.log("🚀 ~ file: Invest.tsx:6 ~ Invest ~ project:", project);
  const [amountToInvest, setAmountToInvest] = useState(0);

  const onChange = (e: any) => {
    setAmountToInvest(e.target.value);
  };
  return (
    <>
      <KeyValue
        data={{
          "Amount To Raise": project.amountToRaise,
          "Start Date": format(new Date(project?.startDate), "PPpp"),
          "End Date": format(new Date(project?.endDate), "PPpp"),
          "Created By": <Address address={project?.createdBy} format={"short"} />,
        }}
      />
      <div className="flex flex-row items-center">
        <div className="form-control w-3/5 my-4">
          <label className="label">
            <span className="label-text text-lg">What is the amount you plan to invest?</span>
          </label>
          <input
            type="number"
            placeholder="Amount to invest"
            className="input input-md input-bordered w-full max-w-xs"
            value={amountToInvest}
            onChange={onChange}
          />
        </div>
        <button className="btn btn-primary w-1/5 mx-2 my-4 mt-14">Approve</button>
        <button className="btn btn-primary w-1/5 mx-2 my-4 mt-14">Deposit</button>
      </div>
    </>
  );
}
