import React from "react";

type Step = {
  title: string;
};

type HeaderProps = {
  step?: number; // current active step
  steps?: Step[]; // list of steps
};

export default function Header({
  step = 1,
  steps = [
    { title: "Program Information" },
    { title: "Curriculum" },
    { title: "Roadmap" },
    { title: "Additional Information" },
  ],
}: HeaderProps) {
  return (
    <div className="flex flex-row items-center gap-5">
      {steps.map((s, index) => {
        const isActive = step === index + 1;
        return (
          <React.Fragment key={index}>
            <div className="flex flex-col gap-2 items-center justify-center">
              <p className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold ${isActive? "bg-primary text-white border border-primary-hover": "border border-primary-hover text-primary-hover" }`} > {index + 1} </p>
              <p className={`text-sm font-normal text-center ${ isActive ? "text-primary-hover" : "text-foreground"  }`}>  {s.title} </p>
            </div>
            {index !== steps.length - 1 && (
              <div className="border-foreground border w-[50px] h-0 rounded-full"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
