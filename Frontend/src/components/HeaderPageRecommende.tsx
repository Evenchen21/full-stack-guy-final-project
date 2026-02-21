import { FunctionComponent } from "react";

interface HeaderPageRecommendedProps {}

const HeaderPageRecommended: FunctionComponent<
  HeaderPageRecommendedProps
> = () => {
  return (
    <>
      <div id="carouselExampleDark" className="carousel carousel-dark slide">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="10000">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              alt="Mediterranean plate"
              style={{ height: "360px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block text-white">
              <h5>Mediterranean Plate</h5>
              <p>Fresh herbs, roasted veggies, and a bright lemon finish.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              alt="Salmon bowl"
              style={{ height: "360px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block text-white">
              <h5>Salmon Power Bowl</h5>
              <p>Protein-packed bowl with greens and citrus glaze.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              alt="Zucchini rollatini"
              style={{ height: "360px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block text-white">
              <h5>Zucchini Rollatini</h5>
              <p>Cheesy, baked, and light with a tomato basil sauce.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1600&q=80"
              className="d-block w-100"
              alt="Vegan curry"
              style={{ height: "360px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block text-white">
              <h5>Vegan Curry</h5>
              <p>Warm spices, coconut richness, and a soft rice bed.</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
};

export default HeaderPageRecommended;
