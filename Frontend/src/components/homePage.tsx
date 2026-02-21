import { FunctionComponent, useState } from "react";
import RecipesCard from "./RecipesCard";
import HeaderPageCarousel from "./HeaderPageCarousel";
import HeaderPageRecommended from "./HeaderPageRecommende";
import Footer from "./Footer";
import HomeAddDishSection from "./HomeAddDishSection";
import HeaderPageDeserts from "./HeaderPageDeserts";

interface HomePageProps {}

const HomePage: FunctionComponent<HomePageProps> = () => {
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleDishAdded = () => {
    setRefreshSignal((prev) => prev + 1);
  };

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <HeaderPageCarousel />
      <HomeAddDishSection onDishAdded={handleDishAdded} />
      <RecipesCard key={refreshSignal} />
      <HeaderPageDeserts />
      <HeaderPageRecommended />
      <Footer />
    </div>
  );
};

export default HomePage;
