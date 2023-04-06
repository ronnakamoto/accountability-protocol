import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = [
  {
    name: "10/2022",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "11/2022",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "12/2022",
    uv: 2000,
    pv: 9800,
  },
  {
    name: "01/2023",
    uv: 2780,
    pv: 3908,
  },
  {
    name: "02/2023",
    uv: 1890,
    pv: 4800,
  },
  {
    name: "03/2023",
    uv: 2390,
    pv: 3800,
  },
  {
    name: "04/2023",
    uv: 3490,
    pv: 4300,
  },
];

export default function ChartPanel() {
  return (
    <div className="card w-96 bg-base-100 flex grow ml-4">
      <div className="card-body">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
