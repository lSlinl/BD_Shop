import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2026 BDO Shop. All rights reserved.</p>
        <nav>
          <a href="/about">О нас</a> | <a href="/contact">Контакты</a> | <a href="/privacy">Политика конфиденциальности</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;