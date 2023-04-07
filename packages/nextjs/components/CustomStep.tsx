import { useState } from "react";

interface StepItem {
  id: number;
  title?: string;
  description: string | React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
}

interface StepProps {
  items: StepItem[];
}

export default function CustomStep({ items }: StepProps) {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="w-full flex">
      <ul className="steps steps-vertical">
        {items.map(item => (
          <li
            key={item.id}
            className={`step ${item.isCompleted ? "step-primary" : ""} cursor-pointer`}
            onClick={() => setActiveStep(item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>
      <div className="ml-2 flex-1">
        {items.map(item => (
          <div
            key={item.id}
            className={`card bg-base-100 shadow-xl p-2 mb-1 w-full ${item.id === activeStep ? "block" : "hidden"}`}
          >
            <div className="card-body">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
