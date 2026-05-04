
import "./footer.css";

function Footer({ text }) {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h3>ArchiPlus</h3>
          <p>Modern design solutions</p>
        </div>

        {/* COPYRIGHT */}
        <div className="footer-bottom">
          <p>{text || "© 2026 ArchiPlus. All rights reserved."}</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;