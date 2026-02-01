import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h1 className="footer-title">
          Snapwall where moments live forever
        </h1>
        <p className="footer-subtitle">
            Designed and Developed{" "}
        <a
            href="https://www.instagram.com/uicoderz"
            target="_blank"
            rel="noopener noreferrer"
            className="insta-link"
            >
            @UIcoderz
        </a>
        </p>
      </div>

      <div className="footer-bottom">
        <span>© 2026. All rights reserved</span>
        <div className="footer-links">
          <a href="/feedback">Feedback</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
