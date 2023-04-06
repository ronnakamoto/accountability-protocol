import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import AdminStatistics from "~~/components/AdminStatistics";
import ChartPanel from "~~/components/ChartPanel";
import SidePanel from "~~/components/SidePanel";
import Table from "~~/components/Table";
import CreateProject from "~~/components/admin/CreateProject";

const AdminDashboard: NextPage = () => {
  const getProjects = () => {
    return new Promise(resolve => {
      resolve([
        {
          id: 1,
          name: "Partisia",
          description: "1234 College Street, Palo Alto, USA",
          investors: "20",
        },
        {
          id: 2,
          name: "Layer Zero",
          description: "500 College Street, California, USA",
          investors: "43",
        },
      ]);
    });
  };

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then((data: any) => {
      console.log(data);
      setProjects(data);
    });
  }, []);

  const [showSidePanel, setShowSidePanel] = useState({
    type: "",
    show: false,
  });

  const [selectedRow, setSelectedRow] = useState(null);

  const onViewRowDetailsClicked = (row: any) => {
    console.log("View details clicked for row: ", row);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rowWithoutId } = row;
    setSelectedRow(rowWithoutId);
    setShowSidePanel({
      type: "VIEW",
      show: true,
    });
  };

  const onSidepanelClosed = () => {
    setShowSidePanel({
      type: "",
      show: false,
    });
    setSelectedRow(null);
  };

  const onProjectCreatedOnchain = (data: any) => {
    console.log("Project created onchain: ", data);
    setShowSidePanel({
      type: "",
      show: false,
    });
    setSelectedRow(null);
  };

  const onProjectDraftSaved = (data: any) => {
    console.log("Project draft created: ", data);
    setShowSidePanel({
      type: "",
      show: false,
    });
    setSelectedRow(null);
  };

  return (
    <>
      <Head>
        <title>Accountability Protocol</title>
        <meta
          name="description"
          content="Revolutionizing decentralized investments with transparency and accountability"
        />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <SidePanel
        title={showSidePanel.type === "CREATE" ? "Add New Project" : "View Project"}
        position="right"
        isOpen={showSidePanel.show}
        widthClasses="w-1/4 bg-zinc-100 border-l border-zinc-200 shadow"
        onClose={onSidepanelClosed}
      >
        {selectedRow ? (
          JSON.stringify(selectedRow, null, 2)
        ) : (
          <CreateProject onProjectCreatedOnchain={onProjectCreatedOnchain} onProjectDraftSaved={onProjectDraftSaved} />
        )}
      </SidePanel>
      <div className="grid grid-cols-6 gap-4 grid-flow-row">
        <div className="col-start-2 col-span-4 flex flex-row grow m-4">
          <AdminStatistics />
          <ChartPanel />
        </div>
        <div className="col-start-5 col-span-1 flex justify-end">
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              setShowSidePanel({
                type: "CREATE",
                show: true,
              })
            }
          >
            Add New Project
          </button>
        </div>
        <div className="col-start-2 col-span-4 flex flex-row grow">
          <Table
            data={projects}
            columns={[
              {
                key: "name",
                title: "Project Name",
                isSortable: true,
                isSearchable: true,
              },
              {
                key: "description",
                title: "Description",
                isSortable: false,
                isSearchable: true,
              },
              {
                key: "investors",
                title: "Investor Count",
                isSortable: true,
                isSearchable: true,
              },
            ]}
            onViewRowDetailsClicked={onViewRowDetailsClicked}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
