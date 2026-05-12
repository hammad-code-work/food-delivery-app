// ============================================
// FILE: frontend/src/components/Footer.jsx
// PURPOSE: Bottom footer shown on all customer pages
// Shows logo, links, contact info, and copyright
// ============================================

import React from "react";
import { Zap, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">

        {/* ---- Top Section: 3 columns ---- */}
        <div className="footer-grid">

          {/* Column 1: Brand & Description */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Zap size={18} />
              </div>
              <span className="footer-logo-text">FoodRush</span>
            </div>
            <p className="footer-desc">
              Fresh, hot, and delicious food delivered straight to your door.
              Order in minutes, enjoy in no time.
            </p>
            {/* Social Media Icons */}
            <div className="footer-socials">
              <a href="#" className="social-icon" title="Facebook"><Facebook size={18} /></a>
              <a href="#" className="social-icon" title="Instagram"><Instagram size={18} /></a>
              <a href="#" className="social-icon" title="Twitter"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/?category=Burgers">Burgers</Link></li>
              <li><Link to="/?category=Pizza">Pizza</Link></li>
              <li><Link to="/?category=Biryani">Biryani</Link></li>
              <li><Link to="/?category=Drinks">Drinks</Link></li>
              <li><Link to="/?category=Desserts">Desserts</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-contact-col">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <Phone size={15} />
                <span>+92 300 1234567</span>
              </li>
              <li>
                <Mail size={15} />
                <span>hello@foodrush.pk</span>
              </li>
              <li>
                <MapPin size={15} />
                <span>Sialkot, Punjab, Pakistan</span>
              </li>
            </ul>

            {/* Opening Hours */}
            <div className="footer-hours">
              <h5>Opening Hours</h5>
              <p>Mon – Sun: 10:00 AM – 11:00 PM</p>
            </div>
          </div>
        </div>

        {/* ---- Bottom Bar: copyright ---- */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FoodRush. All rights reserved.</p>
          <p className="footer-admin-link">
            <Link to="/admin/login">Admin Panel</Link>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;