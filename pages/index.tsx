// import localFont from "next/font/local";
import OverviewPage from "@/components/OverviewPage";
import DefaultLayout from "@/layouts/default";

export default function Home() {
  return (
    <DefaultLayout>
      <div>
        <OverviewPage />
      </div>
    </DefaultLayout>
  );
}
