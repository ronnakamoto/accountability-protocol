import { useRouter } from "next/router";
import Dropdown from "../Dropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import shallow from "zustand/shallow";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Balance, BlockieAvatar } from "~~/components/scaffold-eth";
import { useAutoConnect, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useAppStore } from "~~/services/store/store";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const router = useRouter();
  useAutoConnect();

  const networkColor = useNetworkColor();
  const configuredNetwork = getTargetNetwork();
  const [role, setRole] = useAppStore(state => [state.userRole, state.setUserRole], shallow);

  const handleOnRoleSelected = (role: string) => {
    setRole(role);
    console.log("Role selected:", role);
    if (role === "Investor") {
      router.push("/dashboard/investor");
    } else if (role === "Venture Capital") {
      router.push("/dashboard/admin");
    }
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, openChainModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                      Connect Wallet
                    </button>
                  </>
                );
              }

              if (chain.unsupported || chain.id !== configuredNetwork.id) {
                return (
                  <>
                    <span className="text-xs" style={{ color: networkColor }}>
                      {configuredNetwork.name}
                    </span>
                    <button className="btn btn-sm btn-error ml-2" onClick={openChainModal} type="button">
                      <span>Wrong network</span>
                      <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
                    </button>
                  </>
                );
              }

              return (
                <div className="px-2 flex justify-end items-center">
                  <div className="flex justify-center items-center border-1 rounded-lg">
                    <div className="mx-2">
                      <Dropdown
                        title={`${role ? "Switch Role" : "Choose Your Role"}`}
                        options={["Investor", "Venture Capital"]}
                        onSelect={handleOnRoleSelected}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Balance address={account.address} className="min-h-0 h-auto" />
                      <span className="text-xs" style={{ color: networkColor }}>
                        {chain.name}
                      </span>
                    </div>
                    <button onClick={openAccountModal} type="button" className="btn btn-primary btn-sm pl-0 pr-2">
                      <BlockieAvatar address={account.address} size={24} ensImage={account.ensAvatar} />
                      <span className="ml-2 mr-1">{account.displayName}</span>
                      <span>
                        <ChevronDownIcon className="h-6 w-4" />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
