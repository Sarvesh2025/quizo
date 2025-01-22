import React from "react";
import { Card } from "./Card";
export const StatCard = React.memo(({ icon: Icon, value, label, color }) => (
  <Card>
    <div className="flex flex-col items-center justify-center">
      <Icon className={`w-8 h-8 mb-2 ${color}`} />
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </Card>
));
