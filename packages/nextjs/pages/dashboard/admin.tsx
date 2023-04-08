import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import AdminStatistics from "~~/components/AdminStatistics";
import ChartPanel from "~~/components/ChartPanel";
import ManageMilestone from "~~/components/ManageMilestone";
import ProjectSummary from "~~/components/ProjectSummary";
import SidePanel from "~~/components/SidePanel";
import Table from "~~/components/Table";
import CreateProject from "~~/components/admin/CreateProject";
import { Address } from "~~/components/scaffold-eth/Address";
import { useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

interface ShowSidePanelState {
  type: string;
  show: boolean;
  context: any;
}

const AdminDashboard: NextPage = () => {
  const getProjects = () => {
    return fetch("/api/project").then(res => res.json());
  };

  const [projects, setProjects] = useState<any>([]);

  useEffect(() => {
    getProjects().then((data: any) => {
      console.log(data);
      setProjects(data);
    });
  }, []);

  const [showSidePanel, setShowSidePanel] = useState<ShowSidePanelState>({
    type: "",
    show: false,
    context: null,
  });

  const [selectedRow, setSelectedRow] = useState(null);
  const [updateQueue, setUpdateQueue] = useState<Record<string, any>>({});

  const onReceiveProjectCreatedEvent = async (...args: unknown[]) => {
    console.log("onReceiveProjectCreatedEvent: ", args);
    const [projectId, name, , , , , payee, , , createdBy, transactionDetails] = args;
    const projectDetailsToUpdate = {
      projectId: Number((projectId as bigint).toString(10)),
      name,
      payee,
      createdBy,
      transactionHash: (transactionDetails as any)?.transactionHash,
      id: updateQueue[name as string],
    };

    const response = await fetch("/api/project", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectDetailsToUpdate),
    });

    if (response.ok) {
      const addedProject = await response.json();
      setProjects([...projects, addedProject]);
    } else {
      console.error("Error:", response.statusText);
    }
  };

  useScaffoldEventSubscriber({
    contractName: "AccountabilityProtocol",
    eventName: "ProjectCreated",
    listener: onReceiveProjectCreatedEvent,
  });

  const onViewRowDetailsClicked = (row: any) => {
    console.log("View details clicked for row: ", row);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rowWithoutId } = row;
    setSelectedRow(rowWithoutId);
    setShowSidePanel({
      type: "VIEW",
      show: true,
      context: row,
    });
  };

  const onSidepanelClosed = () => {
    setShowSidePanel({
      type: "",
      show: false,
      context: null,
    });
    setSelectedRow(null);
  };

  const onProjectCreatedOnchain = async (data: any) => {
    console.log("Project created onchain: ", data);
    setShowSidePanel({
      type: "",
      show: false,
      context: null,
    });
    setSelectedRow(null);
    setUpdateQueue({ ...updateQueue, [data?.projectName]: data?.id });
  };

  const onProjectDraftSaved = (data: any) => {
    console.log("Project draft created: ", data);
    setShowSidePanel({
      type: "",
      show: false,
      context: null,
    });
    setSelectedRow(null);
  };

  const onManageMilestoneClicked = (row: any) => {
    console.log("Manage milestones clicked for row: ", row);

    setShowSidePanel({
      type: "MANAGE",
      show: true,
      context: row,
    });
  };

  const sidePanelTitle: string | undefined = {
    CREATE: "Add New Project",
    VIEW: "View Project",
    MANAGE: `Manage Milestones For ${showSidePanel?.context?.name}`,
    DEFAULT: "",
  }[showSidePanel?.type || "DEFAULT"];

  const sidePanelWidth = {
    CREATE: "w-1/4",
    VIEW: "w-1/2",
    MANAGE: "w-2/3",
  }[showSidePanel?.type || "CREATE"];

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
        title={sidePanelTitle}
        position="right"
        isOpen={showSidePanel.show}
        widthClasses={`${sidePanelWidth} bg-zinc-100 border-l border-zinc-200 shadow`}
        onClose={onSidepanelClosed}
      >
        {showSidePanel.type === "VIEW" && <ProjectSummary project={selectedRow} />}
        {showSidePanel.type === "CREATE" && (
          <CreateProject onProjectCreatedOnchain={onProjectCreatedOnchain} onProjectDraftSaved={onProjectDraftSaved} />
        )}
        {showSidePanel.type === "MANAGE" && <ManageMilestone project={showSidePanel.context} />}
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
                context: null,
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
                key: "amountRaised",
                title: "Amount Raised",
                isSortable: false,
                isSearchable: true,
              },
              {
                key: "payee",
                title: "Project Admin",
                isSortable: false,
                isSearchable: true,
                render(row) {
                  return <Address address={row.payee} />;
                },
              },
              {
                key: "status",
                title: "Status",
                isSortable: false,
                isSearchable: true,
                render(row) {
                  return (
                    <span className={`badge ${row.status === "Draft" ? "bg-sky-600" : "bg-emerald-600"}`}>
                      {row.status}
                    </span>
                  );
                },
              },
            ]}
            onViewRowDetailsClicked={onViewRowDetailsClicked}
            onManageMilestoneClicked={onManageMilestoneClicked}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
