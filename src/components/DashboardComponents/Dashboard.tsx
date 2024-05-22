import DashboardLeft from "./DashboardLeft";
import DashboardRight from "./DashboardRight";

const Dashboard = () => {
  return (
    <div className="flex">
      <DashboardLeft />
      <DashboardRight />
    </div>
  );
};

export default Dashboard;
