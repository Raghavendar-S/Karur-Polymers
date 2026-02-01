import "./NavbarFooter.css";

export default function Footer() {
  return (
    <>
      <footer className="footer print-hidden">
        <div className="section__container footer__container">
          <div className="footer__logo">
            <h4>
              <a href="#home">Karur Polymers</a>
            </h4>
            <p>Copyright © 2023 Cello Tape Sales. All rights reserved.</p>
          </div>
          <ul className="footer__nav">
            <li className="footer__link">
              <a href="/#choose">About</a>
            </li>
            <li className="footer__link">
              <a href="/#contact">Contact</a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
