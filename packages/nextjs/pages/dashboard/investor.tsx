import { useEffect, useState } from "react";
import Head from "next/head";
import Invest from "~~/components/Invest";
import InvestmentSummary from "~~/components/InvestmentSummary";
import SidePanel from "~~/components/SidePanel";
import { useAppStore } from "~~/services/store/store";

export default function InvestorDashboard() {
  const projectToInvestIn: any = useAppStore((state: any) => state.projectToInvestIn);
  const setProjectToInvestIn: any = useAppStore((state: any) => state.setProjectToInvestIn);
  const [showSidePanel, setShowSidePanel] = useState({
    type: "",
    show: false,
  });

  useEffect(() => {
    if (projectToInvestIn) {
      setShowSidePanel({
        type: "INVEST",
        show: true,
      });
    }
  }, [projectToInvestIn]);

  const onSidepanelClosed = () => {
    setShowSidePanel({
      type: "",
      show: false,
    });
    setProjectToInvestIn(null);
  };

  return (
    <>
      <Head>
        <title>Accountability Protocol | Investor Dashboard</title>
        <meta
          name="description"
          content="Revolutionizing decentralized investments with transparency and accountability"
        />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <SidePanel
        title={`Invest in ${projectToInvestIn?.name}`}
        position="right"
        isOpen={showSidePanel.show}
        widthClasses={`w-1/2 bg-zinc-100 border-l border-zinc-200 shadow`}
        onClose={onSidepanelClosed}
      >
        {projectToInvestIn && <Invest project={projectToInvestIn} />}
      </SidePanel>
      <div className="grid-rows-3 h-screen">
        <InvestmentSummary />
      </div>
    </>
  );
}
