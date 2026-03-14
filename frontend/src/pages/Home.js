import React from "react";
import Carousel from "./Carousel";

function Home() {
  return (
    <div className="container mx-auto p-4">
      <Carousel />
      <h2 className="mt-4 text-xl font-bold">Featured Products</h2>
      {/* Здесь можно вывести несколько ProductCard */}
    </div>
  );
}

export default Home;
