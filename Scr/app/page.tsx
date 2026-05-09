import { HomeHero } from "@/components/home/HomeHero";
import { DailyVerse } from "@/components/home/DailyVerse";
import { QuickStats } from "@/components/home/QuickStats";
import { TafsirHighlight } from "@/components/home/TafsirHighlight";
import { RecitersHighlight } from "@/components/home/RecitersHighlight";
import { ContinueReading } from "@/components/home/ContinueReading";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <DailyVerse />
      <QuickStats />
      <ContinueReading />
      <TafsirHighlight />
      <RecitersHighlight />
    </>
  );
}
