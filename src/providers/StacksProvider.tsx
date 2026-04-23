"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { StacksTestnet, StacksMainnet } from "@stacks/network";

interface StacksContextType {
  userSession: UserSession;
  userData: any | null;
  isConnected: boolean;
  address: string | null;
  network: StacksTestnet | StacksMainnet;
  connect: () => void;
  disconnect: () => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const network = new StacksTestnet(); // Change to StacksMainnet() for production

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      setUserData(data);
      setIsConnected(true);
      setAddress(data.profile.stxAddress.testnet); // Use mainnet for production
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: "StackAds",
        icon: "/logo.png",
      },
      redirectTo: "/",
      onFinish: () => {
        const data = userSession.loadUserData();
        setUserData(data);
        setIsConnected(true);
        setAddress(data.profile.stxAddress.testnet);
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setUserData(null);
    setIsConnected(false);
    setAddress(null);
  };

  return (
    <StacksContext.Provider
      value={{
        userSession,
        userData,
        isConnected,
        address,
        network,
        connect,
        disconnect,
      }}
    >
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error("useStacks must be used within a StacksProvider");
  }
  return context;
}
