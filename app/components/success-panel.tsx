"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Button from "./button";
import hexCheck from "@/public/assets/images/icon-hex-check.svg";

interface SuccessPanelProps {
  callsign: string;
}

export default function SuccessPanel({ callsign }: SuccessPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-start gap-8 py-4 md:py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Image src={hexCheck} alt="" width={64} height={64} aria-hidden />
      </motion.div>

      <div className="flex flex-col gap-4">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-orbitron text-2xl font-extrabold uppercase tracking-[0.04em] leading-8 text-neutral-50 outline-none"
        >
          <span className="text-lime-500">//</span> Handshake complete
        </h2>
        <p className="font-jetbrains-mono text-sm leading-6 text-neutral-400">
          Operator{" "}
          <span className="text-lime-500">{callsign}</span> provisioned.
          Your account is ready.
        </p>
      </div>

      <Button
        label="Continue to log in"
        type="button"
        onClick={() => {
          /* decorative for this challenge */
        }}
      />
    </div>
  );
}
