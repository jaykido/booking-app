import { useEffect } from "react";

type ToastProp = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProp) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onclose]);
  const styles =
    type === "SUCCESS"
      ? "fixed top-5 right-16 z-60 p-2 rounded-md bg-green-600 text-white max-w-md"
      : "fixed top-5 right-16 z-60 p-2 rounded-md bg-red-600 text-white max-w-md";
  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
