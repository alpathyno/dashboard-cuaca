import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PrakiraanPerJam({ data }) {
  return (
    <div className="kartu lebar">
      <h3>24 jam ke depan</h3>
      <div className="grafik">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradSuhu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7a1a" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#ff7a1a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#3a3a3e" vertical={false} />
            <XAxis dataKey="jam" stroke="#888" tick={{ fontSize: 12 }} interval={3} />
            <YAxis
              stroke="#888"
              tick={{ fontSize: 12 }}
              unit="°"
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <Tooltip
              contentStyle={{
                background: "#1c1c1e",
                border: "1px solid #3a3a3e",
                borderRadius: 10,
              }}
              labelStyle={{ color: "#aaa" }}
              formatter={(nilai) => [`${nilai}°C`, "Suhu"]}
            />
            <Area
              type="monotone"
              dataKey="suhu"
              stroke="#ff7a1a"
              strokeWidth={2.5}
              fill="url(#gradSuhu)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}