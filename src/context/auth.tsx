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

type AuthState = {
  loggedInAddress: string | null;
};

const useAuthController = () => {
  const [authState, setAuthState] = useState<AuthState>({
    loggedInAddress: null,
  });
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

  const doSiwe = async () => {
    try {
      const {
        data: { nonce },
      } = await axios.post<{ nonce: string }>("/api/auth/nonce", {
        accountAddress: address,
      });

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "God Forgives",
        uri: window.location.origin,
        version: "1",
        chainId: chain ? chain.id : 0,
        nonce,
      });

      return message;
    } catch (error) {
      return false;
    }
  };

  const signIn = async (signature: string, message: SiweMessage) => {
    try {
      await axios.post("/api/auth/verify", {
        signature,
        message,
        accountAddress: address,
      });
      if (address)
        setAuthState((old) => ({
          ...old,
          loggedInAddress: address.toString(),
        }));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      setAuthState((old) => ({ ...old, loggedInAddress: null }));
    } catch (error) {
      console.log("zap error", error);
    }
  };

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data } = await axios.get<{ auth: { id: string } }>(
          "/api/auth/me"
        );
        setAuthState((old) => ({ ...old, loggedInAddress: data.auth.id }));
      } catch (error) {}
    };
    handleAuth();
  }, []);

  return {
    authState,
    signOut,
    doSiwe,
    signIn,
    refreshNonce,
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
