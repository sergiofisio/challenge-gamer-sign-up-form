import Image from "next/image";
import alertIcon from "@/public/assets/images/icon-alert.svg";

interface FieldErrorProps {
  id: string;
  message: string;
}

export default function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-jetbrains-mono text-xs leading-4 text-red-400"
    >
      <Image
        src={alertIcon}
        alt=""
        width={12}
        height={12}
        className="mt-0.5"
        aria-hidden
      />
      <span>{message}</span>
    </p>
  );
}
