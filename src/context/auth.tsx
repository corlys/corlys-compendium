import {
  useContext,
  createContext,
  useState,
  FC,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useAccount, useNetwork } from "wagmi";
import { SiweMessage } from "siwe";

const useAuthController = () => {
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated" | null
  >(null);
  const { address, status, isConnected } = useAccount();
  const { chain } = useNetwork();

  const refreshNonce = async () => {
    try {
      const {
        data: { nonce },
      } = await axios.post<{ nonce: string }>("/api/auth/regen_nonce", {
        accountAddress: address,
      });
      return nonce;
    } catch (error) {
      return false;
    }
  };

  const signIn = async () => {
    try {
      const {
        data: { nonce },
      } = await axios.post<{ nonce: string }>("/api/auth/nonce", {
        accountAddress: address,
      });

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "SiwE HOHOHO",
        version: "1",
        chainId: chain ? chain.id : 0,
        nonce,
      });

      return message;
    } catch (error) {
      return false;
    }
  };

  const signOut = async (token: string) => {
    await axios.post("/api/auth/signout", { token });
  };

  useEffect(() => {
    if (isConnected) {
      // should mean changing account
      // sign them out
    }
  }, [address]);

  return {
    authState,
    signOut,
    signIn,
    refreshNonce
  };
};

const AuthContext = createContext({} as ReturnType<typeof useAuthController>);

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={useAuthController()}>
      {children}
    </AuthContext.Provider>
  );
};
