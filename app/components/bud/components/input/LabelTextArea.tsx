import React from "react";
import CustomPopover from "../customPopover";
import { Image, Input, Slider } from "antd";

interface LabelTextAreaProps {
  title: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export default function LabelTextArea(props: LabelTextAreaProps) {
  return (
    <div
      className={`flex items-start rounded-[6px] relative !bg-[transparent]  w-full mb-[0] ${props.className}`}
    >
      <div className="w-full">
        <div className="absolute !bg-[#101010] px-[.25rem] rounded -top-2 left-[.5rem] tracking-[.035rem] z-10 flex items-center gap-1 text-[.75rem] text-[#EEEEEE] font-[300] text-nowrap">
          {props.title}
          <CustomPopover
            title={props.description}
            classNames="flex items-center"
          >
            <Image
              preview={false}
              src="/icons/info.svg"
              alt="info"
              style={{ width: ".75rem", height: ".75rem" }}
            />
          </CustomPopover>
        </div>
        <Input.TextArea
          onBlur={props.onBlur}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          style={{
            backgroundColor: "transparent",
            color: "#EEEEEE",
            border: "0.5px solid #757575",
          }}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          size="large"
          className="drawerInp py-[.65rem] bg-transparent text-[#EEEEEE] font-[300] border-[0.5px] border-[#757575] rounded-[6px] hover:border-[#EEEEEE] focus:border-[#EEEEEE] active:border-[#EEEEEE] text-[.75rem] shadow-none w-full indent-[.4rem]"
        />
      </div>
    </div>
  );
}
