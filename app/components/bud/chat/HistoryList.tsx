import ChatContext, { Endpoint } from "@/app/context/ChatContext";
import RootContext from "@/app/context/RootContext";
import { Image } from "antd";
import React, { useContext, useEffect, useState } from "react";

export type ChatSettings = {
  id: string;
  name: string;
  system_prompt: string;
  temperature: number;
  limit_response_length: boolean;
  sequence_length: number;
  context_overflow_policy: string;
  stop_strings: string[];
  top_k_sampling: number;
  repeat_penalty: number;
  top_p_sampling: number;
  min_p_sampling: number;
  structured_json_schema: string;
  created_at: string;
  modified_at: string;
};

export type Session = {
  id: string;
  name: string;
  total_tokens: number;
  created_at: string;
  modified_at: string;
  chat_setting?: ChatSettings;
  chat_setting_id?: string;
  active?: boolean;
};

export type ActiveSession = Session & {
  selectedDeployment?: Endpoint;
};

function HistoryListItem({ data }: { data: Session }) {
  const { chats } = useContext(RootContext);
  return (
    <div
      onClick={() => {
        // check if chat already exists
        if (chats.find((chat) => chat.id === data.id)) {
          return;
        }
        // createChat(data.id, chat?.id);
      }}
      className="flex flex-row items-center gap-[1rem] p-[.45rem] px-[.65rem] justify-between border-[1px] border-[#1F1F1F00] hover:border-[#1F1F1F] rounded-[8px] backdrop-blur-[10px] hover:bg-[#FFFFFF08] cursor-pointer"
    >
      <div className="flex flex-row items-center gap-[.6rem] px-[.27rem]">
        <Image
          src="icons/list-item.svg"
          preview={false}
          alt="bud"
          width={".875rem"}
          height={".875rem"}
        />
        <span className="Lato-Regular text-[#EEE] text-[.875rem] font-[400]">
          {data.name}
        </span>
      </div>

      <span className="Open-Sans text-[#757575] text-[.625rem] font-[400] pr-[.15rem]">
        {data.total_tokens} tokens
      </span>
    </div>
  );
}

function HistoryList() {
  const { chats } = useContext(RootContext);

  const [chatHistory, setChatHistory] = useState<Session[]>([]);

  useEffect(() => {
    console.log("chats", chats);
    setChatHistory(chats);
  }, [chats]);

  return (
    <div className="flex flex-col w-full h-[41%] bg-[#101010] px-[.9rem] py-[.95rem] gap-y-[.6rem]">
      {chatHistory?.map((item, index) => (
        <HistoryListItem key={index} data={item} />
      ))}
      {chatHistory?.length === 0 && (
        <div className="flex flex-row items-center justify-center w-full h-[2.5rem] bg-[#101010] rounded-[8px] border-[1px] border-[#1F1F1F] backdrop-blur-[10px]">
          <span className="Open-Sans text-[#757575] text-[.625rem] font-[400]">
            No chat history
          </span>
        </div>
      )}
    </div>
  );
}

export default HistoryList;
