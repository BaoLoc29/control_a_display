import Link from "next/link";

export default function Home() {
  return (
    <div className="px-32 h-full">
      <ul>
        <li>
          <Link href={"/facebook"}>Facebook</Link>
        </li>
        <li>
          <a href="/youtube">Youtube</a>
        </li>
        <li>
          <a href="/tiktok">Tiktok</a>
        </li>
      </ul>
    </div>
  );
}
