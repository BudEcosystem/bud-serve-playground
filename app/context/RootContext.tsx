import { createContext } from "react";
import { Endpoint } from "./ChatContext";
import { ActiveSession, Session } from "../components/bud/chat/HistoryList";

type RootContextType = {
  chats: ActiveSession[];
  setChats: (chats: ActiveSession[]) => void;
  createChat: (sessionId?: string) => void;
  handleDeploymentSelect: (chat: ActiveSession, endpoint: Endpoint) => void;
  handleSettingsChange: (chat: ActiveSession, prop: string, value: any) => void;
  token: string;
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  // endpoints
  endpoints: Endpoint[];
  // set endpoints
  setEndpoints: (endpoints: Endpoint[]) => void;
};

const RootContext = createContext<RootContextType>({
  chats: [],
  setChats: () => {},
  createChat: (sessionId?: string) => {},
  handleDeploymentSelect: (chat: ActiveSession, endpoint: Endpoint) => {},
  handleSettingsChange: (chat: ActiveSession, prop: string, value: any) => {},
  token: "",
  sessions: [],
  setSessions: (_: Session[]) => {},
  endpoints: [],
  setEndpoints: (_: Endpoint[]) => {},
});

export default RootContext;
