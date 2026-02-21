import { FunctionComponent } from "react";

interface AboutPageProps {}

const AboutPage: FunctionComponent<AboutPageProps> = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/RecipesWallpaper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          minHeight: "100vh",
        }}
      >
        <div className="container py-5">
          <h2
            className="text-center mb-5 fw-bold"
            style={{ color: "#1D546D", letterSpacing: "1px" }}
          >
            About Recipes
          </h2>

          {/* Profile Card */}
          <div
            className="card shadow mx-auto"
            style={{
              maxWidth: "720px",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Top banner */}
            <div style={{ backgroundColor: "#bd6428", height: "100px" }} />

            {/* Avatar */}
            <div className="text-center" style={{ marginTop: "-60px" }}>
              <img
                src="/profile.jpg"
                alt="Developer profile"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).src =
                    "https://media.licdn.com/dms/image/v2/D4D03AQG4XZU08rl3WQ/profile-displayphoto-scale_200_200/B4DZqTSKH4JEAY-/0/1763407604247?e=2147483647&v=beta&t=dkkHPgz6AMdlPKBLZjA8pnKLa0yHraxUF47EWKgDnfA")
                }
                className="rounded-circle border border-4 border-white shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>

            {/* Info */}
            <div className="card-body text-center px-5 pb-4">
              <h4 className="fw-bold mt-2" style={{ color: "#061E29" }}>
                Guy Even-Chen
              </h4>
              <p className="text-muted mb-3" style={{ fontSize: "0.95rem" }}>
                Full Stack Web Developer
              </p>

              <hr style={{ borderColor: "#5F9598", opacity: 0.4 }} />

              <p
                className="text-start mt-3"
                style={{ color: "#061E29", lineHeight: "1.8" }}
              >
                Hi! I'm Guy, a passionate full stack developer and Cyber
                Security enthusiast who loves building clean, user-friendly web
                applications. This Recipes app is my final project — a place to
                discover, share, and save the meals you love. I enjoy working
                with React, Node.js, and MongoDB to bring ideas to life.
              </p>

              <hr style={{ borderColor: "#5F9598", opacity: 0.4 }} />

              {/* Social Media Links */}
              <div className="d-flex justify-content-center gap-4 mt-4">
                <a
                  href="https://github.com/Evenchen21"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub"
                  style={{ color: "#061E29", fontSize: "1.8rem" }}
                >
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://il.linkedin.com/in/guy-evenchen"
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn"
                  style={{ color: "#0A66C2", fontSize: "1.8rem" }}
                >
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a
                  href="https://www.facebook.com/guyevenchen1248/"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  style={{ color: "#1877F2", fontSize: "1.8rem" }}
                >
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a
                  href="https://www.instagram.com/guyeven25/"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  style={{ color: "#E1306C", fontSize: "1.8rem" }}
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </div>

              {/* CTA */}
              <a
                href="mailto:cybersec25@icloud.com"
                className="btn mt-4"
                style={{
                  backgroundColor: "#1D546D",
                  color: "#F3F4F4",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 28px",
                }}
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
