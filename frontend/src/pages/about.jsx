import "./about.css";

export default function About() {
  return (
    <div className="about">

      {/* HERO */}
      <section className="about-hero">
        <h1>About ArchiPlus</h1>
        <p>Where creativity meets modern design</p>
      </section>

      {/* STORY */}
      <section className="about-section">
        <h2 className="about-title">Our Story</h2>
        <p>
          ArchiPlus was created as a student-driven project with a passion for
          art, architecture, and modern digital design.
          <br />
          The goal is simple:
          <br />
        
          provide a platform where creativity can be explored through unique
          products and innovative ideas.
        </p>
        <p>
          From 3D-printed objects to digital artwork, ArchiPlus represents a
          fusion of technology and artistic expression.
        </p>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <h2 className="about-title">Our Mission</h2>
        <p>
          We aim to make modern art and design accessible to everyone. Whether
          you're a student, designer, or art lover, ArchiPlus offers inspiration
          and high-quality creative products.
        </p>
      </section>

      {/* VALUES */}
      <section className="about-section about-values">
        <h2 className="about-title">Our Values</h2>

        <div className="values-grid">
          <div className="value-card">
            <h3>Creativity</h3>
            <p>Encouraging original ideas and artistic innovation.</p>
          </div>

          <div className="value-card">
            <h3>Quality</h3>
            <p>Delivering carefully crafted and meaningful designs.</p>
          </div>

          <div className="value-card">
            <h3>Innovation</h3>
            <p>Combining modern technology with artistic expression.</p>
          </div>

          <div className="value-card">
            <h3>Accessibility</h3>
            <p>Making art and design available to a wider audience.</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="about-section">
        <h2 className="about-title">Who We Are</h2>
        <p>
          ArchiPlus is built by a student who are passionate about web
          development, UI/UX design, and digital creativity. This project
          represents learning, growth, and the ambition to build something
          meaningful.
        </p>
      </section>

    </div>
  );
}