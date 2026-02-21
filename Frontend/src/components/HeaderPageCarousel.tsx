import { FunctionComponent } from "react";

interface HeaderPageCarouselProps {}

const HeaderPageCarousel: FunctionComponent<HeaderPageCarouselProps> = () => {
  return (
    <>
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/RecipesWallpaper.png"
              className="d-block w-100"
              style={{ height: "420px", objectFit: "cover" }}
              alt="Recipes wallpaper"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              style={{ height: "420px", objectFit: "cover" }}
              alt="Fresh pasta dish"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              style={{ height: "420px", objectFit: "cover" }}
              alt="Colorful healthy salad"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              style={{ height: "420px", objectFit: "cover" }}
              alt="Sushi assortment"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              style={{ height: "420px", objectFit: "cover" }}
              alt="Hearty pasta bowl"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              style={{ height: "420px", objectFit: "cover" }}
              alt="Grilled skewers"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
};

export default HeaderPageCarousel;
