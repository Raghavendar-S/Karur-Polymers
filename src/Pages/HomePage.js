import "./HomePage.css";
import React, { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import Layout from "../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const scrollRevealOption = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };

    ScrollReveal().reveal(".header__container h1", {
      ...scrollRevealOption,
    });

    ScrollReveal().reveal(".header__container p", {
      ...scrollRevealOption,
      delay: 500,
    });

    ScrollReveal().reveal(".header__container button", {
      ...scrollRevealOption,
      delay: 1000,
    });

    ScrollReveal().reveal(".header__container a", {
      ...scrollRevealOption,
      delay: 1500,
    });
  }, []);

  return (
    <Layout>
      <header className="header">
        <div className="section__container header__container" id="home">
          <h1>Wrap It, Seal It, Love It</h1>
          <p>
            {" "}
            Find the perfect cello tape for all your packaging needs at Karur
            Polymers - your online store for quality adhesive solutions.{" "}
          </p>
          <button onClick={() => navigate("/products")}>Shop Now</button>
          <div className="arrow-down">
            <a href="#choose">
              <i className="ri-arrow-down-double-line"></i>
            </a>
          </div>
        </div>
      </header>

      <section className="section__container choose__container" id="choose">
        <div className="choose__content">
          <h2 className="section__header">About Us</h2>
          <p>
            Karur Polymers is a leading cello tape online store situated in
            Karur, Tamil Nadu. We specialize in providing high-quality cello
            tapes that are perfect for all your packaging needs. Our goal is to
            provide our customers with the best possible experience when it
            comes to purchasing cello tapes online.
          </p>
          <br />
          <p>
            At Karur Polymers, we believe in delivering exceptional customer
            service, and we strive to exceed our customers' expectations at
            every turn. Whether you're a small business owner or an individual
            looking to purchase cello tapes for personal use, we have you
            covered. We take pride in offering a wide range of products at
            competitive prices, and we are committed to helping our customers
            find the perfect cello tape for their needs.
          </p>
        </div>
        <div className="choose__image">
          <img src="../assets/about.png" alt="about" />
        </div>
      </section>

      <section className="section__container choose__container">
        <img
          className="choose__bg"
          src="assets/dot-bg.png"
          id="dot-img"
          alt="bg"
        />
        <div className="choose__content">
          <h2 className="section__header">Why Choose Our Cello Tapes</h2>
          <p className="section__subheader">
            Experience the Best Cello Tape Quality and Reliability. Discover Why
            We're Your Top Choice for Packaging.
          </p>
          <div className="choose__grid">
            <div className="choose__card">
              <span>
                <i className="ri-customer-service-2-line"></i>
              </span>
              <h4>Customer Support</h4>
              <p>
                Our dedicated support team is available round the clock to
                assist you.
              </p>
            </div>
            <div className="choose__card">
              <span>
                <i className="ri-shopping-bag-3-line"></i>
              </span>
              <h4>Easy Ordering</h4>
              <p>
                Ordering cello tapes from us is a breeze. Explore our simple
                ordering process.
              </p>
            </div>
            <div className="choose__card">
              <span>
                <i className="ri-truck-line"></i>
              </span>
              <h4>Fast Shipping</h4>
              <p>
                Get your cello tapes quickly with our Fast Shipping service.
              </p>
            </div>
            <div className="choose__card">
              <span>
                <i className="ri-loop-right-line"></i>
              </span>
              <h4>Satisfaction Guaranteed</h4>
              <p>
                We stand by the quality of our cello tapes. Your satisfaction is
                our priority.
              </p>
            </div>
          </div>
        </div>
        <div className="choose__image">
          <img src="../assets/home-page.png" alt="choose" />
        </div>
      </section>

      <section className="section__container contact__container" id="contact">
        <div className="contact__content">
          <h2 className="section__header">Contact Us</h2>
          <p>
            {" "}
            If you have any questions or inquiries, please feel free to contact
            us using the information below:{" "}
          </p>
          <br />
          <ul className="contact__info">
            <li>
              <strong>Email:</strong> karurpolymerspvtltd@gmail.com
            </li>
            <li>
              <strong>Phone:</strong> 9786640015
            </li>
            <li>
              <strong>Address:</strong> 26 A, Ramakrishna Puram, near VRL
              Transports, Karur, Tamil Nadu-639002, India
            </li>
          </ul>
        </div>
        <div className="contact__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.9931902845233!2d78.07159809678956!3d10.963886100000025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa2fac2291a2b9%3A0xb5a79d821e42d96c!2sKarur%20Polymers%20Private%20Limited!5e0!3m2!1sen!2sin!4v1696235275636!5m2!1sen!2sin"
            width="100%"
            height="450px"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            title="Karur Polymers Location"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </Layout>
  );
}
