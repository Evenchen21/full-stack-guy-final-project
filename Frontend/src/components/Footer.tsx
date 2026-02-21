import { FunctionComponent } from "react";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  return (
    <footer
      className="mt-5"
      style={{ backgroundColor: "#1D546D", color: "#F3F4F4" }}
    >
      <div className="container py-4">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <h5 className="mb-2" style={{ color: "#bd6428" }}>
              Recipes
            </h5>
            <p className="mb-0" style={{ color: "#DCE7EA" }}>
              Cook, share, and discover meals you love.
            </p>
          </div>
        </div>
        <hr style={{ borderColor: "#5F9598", opacity: 0.6 }} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <small style={{ color: "#DCE7EA" }}>
            © 2026 Recipes. All rights reserved.
          </small>
          <a
            href="https://github.com/Evenchen21"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
            style={{ color: "#DCE7EA" }}
          >
            <small>Built by Guy Even-Chen.</small>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
