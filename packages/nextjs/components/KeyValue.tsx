const KeyValue = ({ data }: any) => {
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]: any) => (
        <div key={key} className="flex items-center justify-between">
          <span className="font-semibold">{key}</span>
          <span className="flex-grow mx-4 border-b border-dotted border-gray-500"></span>
          <span className="font-light">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default KeyValue;
