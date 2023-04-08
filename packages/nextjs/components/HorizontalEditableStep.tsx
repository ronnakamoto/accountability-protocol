import React, { useState } from "react";

function HorizontalEditableStep({
  data = [],
  noDataText = "No data available. Click Here to add new step",
  addNewStepText = "Add New Step",
  onCreate,
  onCancel,
  onSave,
  onEdit,
}: any) {
  const [activeStep, setActiveStep] = useState(0);

  const handleAddNewStep = () => {
    if (onCreate) {
      onCreate();
    }
  };

  const handleSave = (index: any) => {
    if (onSave) {
      onSave(index);
    }
  };

  const handleCancel = (index: any) => {
    if (onCancel) {
      onCancel(index);
    }
  };

  const handleEdit = (index: any) => {
    if (onEdit) {
      onEdit(index);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <button className="text-blue-600" onClick={handleAddNewStep}>
          {noDataText}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <div className="flex overflow-x-auto">
          <ul className="steps">
            {data.map(
              (
                item: {
                  id: React.Key | null | undefined;
                  stepNumber:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                    | React.ReactFragment
                    | React.ReactPortal
                    | null
                    | undefined;
                },
                index: React.SetStateAction<number>,
              ) => (
                <li
                  key={item.id}
                  className={`step ${index <= activeStep ? "step-primary" : ""}`}
                  onClick={() => setActiveStep(index)}
                >
                  {item.stepNumber}
                </li>
              ),
            )}
          </ul>
          {activeStep === data.length - 1 && (
            <button className="text-blue-600 ml-4" onClick={handleAddNewStep}>
              {addNewStepText}
            </button>
          )}
        </div>
      </div>
      <div className="relative mt-8">
        {data.map(
          (
            item: { id: React.Key | null | undefined; isEditing: any; editContent: any; content: any },
            index: number,
          ) => (
            <div
              key={item.id}
              className={`card shadow-xl p-4 ${index === activeStep ? "block" : "hidden"}`}
              style={{
                top: 0,
                left: 0,
                position: "absolute",
              }}
            >
              <div className="card-body">
                {item.isEditing ? (
                  <>
                    {item.editContent}
                    <div className="mt-4">
                      <button className="btn btn-primary mr-2" onClick={() => handleSave(index)}>
                        Save
                      </button>
                      <button className="btn btn-error" onClick={() => handleCancel(index)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {item.content}
                    <button className="btn btn-accent mt-4" onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default HorizontalEditableStep;
