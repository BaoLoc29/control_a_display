"use client";
import { useRouter } from "next/navigation";
const Facebook = () => {
  const router = useRouter();
  const handleBtn = () => {
    router.push("/");
  };
  return (
    <div>
      Facebook page
      <div>
        <div className="text-red-500">dwao</div>
        <button onClick={() => handleBtn()}>Back home</button>
      </div>
    </div>
  );
};

export default Facebook;
