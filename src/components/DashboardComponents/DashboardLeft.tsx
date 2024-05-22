const DashboardLeft = () => {
  return (
    <div className="hidden flex-[0.2] p-2 bg-gray-200 h-screen sm:flex flex-col gap-4">
      <p className="bg-purple-400 p-2 rounded-md cursor-pointer hover:bg-purple-300 transition-colors">
        Dashboard
      </p>
      <p className="bg-gray-400 p-2 rounded-md cursor-pointer hover:bg-gray-300 transition-colors">
        Analytics
      </p>
    </div>
  );
};

export default DashboardLeft;
