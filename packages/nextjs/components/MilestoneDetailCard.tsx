import KeyValue from "./KeyValue";

interface MilestoneDetailCardProps {
  name: string;
  description?: string;
  status?: string;
  amountToUnlock?: number;
  unlockTime?: string;
  quorumThreshold?: number;
  quorumType?: string;
}

export default function MilestoneDetailCard({
  name,
  description,
  status,
  amountToUnlock,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unlockTime,
  quorumThreshold,
  quorumType,
}: MilestoneDetailCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-full">
        <div className="w-full p-1">
          <KeyValue data={{ Name: name }} />
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-full p-1">
          <KeyValue data={{ "Amount To Unlock": amountToUnlock }} />
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-full p-1">
          <KeyValue data={{ "Quorum Type": quorumType }} />
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-full p-1">
          <KeyValue data={{ "Quorum Threshold": quorumThreshold }} />
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-full p-1">
          <KeyValue data={{ Status: <span className="badge badge-sm bg-emerald-600">{status}</span> }} />
        </div>
      </div>
      <div className="w-full">{description}</div>
    </div>
  );
}
