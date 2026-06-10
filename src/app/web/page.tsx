'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function WebLandingPage() {
  useEffect(() => {
    console.log("%c🥷 Built with ❤️ | June 2026 Rewrite", "color: #0cf293; font-size: 16px;");
  }, []);

  return (
    <>
      {/* banner-area start */}
      <section className="banner_area" id="particles-js">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="banner_content">
                <h1 className="wow fadeInLeft animated">
                  IPstress <span>Best</span><br />
                  Stresser on the market L7 / L4
                </h1>
                <p className="wow fadeInLeft" data-wow-delay="0.2s">
                  The cheapest price, the best service guarantee.
                </p>
                <ul className="btn_list">
                  <li>
                    <a className="theme_btn wow fadeInUp animated" href="/web/register">
                      <i className="flaticon-user"></i> Register
                    </a>
                  </li>
                  <li>
                    <a className="theme_btn b-btn wow fadeInUp animated" data-wow-delay="0.3s" href="/web/login">
                      <i className="flaticon-lock"></i> Log in
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 wow zoomIn animated">
              <div className="right-ilustrat">
                <img className="up_animat" src="/web/images/banner/banner_ilustration1.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* banner-area end */}

      {/* our_mission_area start */}
      <section id="about" className="our_mission_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="title">
                <h2>
                  Why to choose<br /><span>IPstress</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 wow fadeInUp animated">
              <div className="mission_text">
                <h5>Security</h5>
                <p>The tests you initiate are never shared with a 3rd party and 100% safe system.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp animated" data-wow-delay="0.3s">
              <div className="mission_text mt_1">
                <h5>Best power</h5>
                <p>
                  If you want to get the best service at very affordable prices, make the right choice here, register
                  and buy now.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp animated" data-wow-delay="0.6s">
              <div className="mission_text mt_01">
                <h5>Easy to use interface</h5>
                <p>
                  A panel welcomes you, which you can use in the best way our developers have done.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp animated" data-wow-delay="0.9s">
              <div className="mission_text">
                <h5>Support</h5>
                <p>All plans have a 7/24 support, easily contact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* our_mission_area end */}

      {/* make_bitcoin_area start */}
      <section className="mining_invest_area make_bitcoin">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-6">
              <div className="mining_text">
                <div className="title ti_2">
                  <h2>
                    How to use <span>Cyberstress</span>
                  </h2>
                  <p>Watch the video and learn to use with ease.</p>
                </div>
                <ul className="btn_list">
                  <a className="btn btn-primary" href="https://www.youtube.com/watch?v=" role="button">
                    Watch Video
                  </a>
                </ul>
              </div>
            </div>
            <div className="col-lg-7 col-md-6">
              <img src="/web/images/invest/mac1.png" alt="" className="right_img up_animat" />
            </div>
          </div>
        </div>
      </section>
      {/* make_bitcoin_area end */}

      {/* faq_area start */}
      <section id="faq" className="faq_area">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="title">
                <h2>
                  What stress<br /><span>FAQ</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="col-lg-8 offset-lg-2">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <a
                  className="nav-item nav-link active"
                  id="nav-home-tab"
                  data-toggle="tab"
                  href="#nav-home"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  <h6>Regular questions</h6>
                </a>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active wow fadeInLeft animated"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <div className="faq_desc">
                  <h5>How does it work ?</h5>
                  <p>You buy a membership and get access to a special area.</p>
                  <h5>How can i pay ?</h5>
                  <p>
                    You can pay with automatic delivery via Sellix or you can reach us via telegram from the
                    description of the @MeleGet channel.
                  </p>
                  <h5>I had a problem, how long do you support ?</h5>
                  <p>Our support is unlimited and free, you can reach us 24/7.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* faq_area end */}

      {/* Scroll Top Button */}
      <button className="scroll-top">
        <i className="fa fa-angle-double-up"></i>
      </button>

      {/* Vendor & Theme Scripts */}
      <Script src="/web/js/jquery-3.4.1.min.js" strategy="afterInteractive" />
      <Script src="/web/js/popper.min.js" strategy="afterInteractive" />
      <Script src="/web/js/bootstrap.min.js" strategy="afterInteractive" />
      <Script src="/web/vendors/animate-css/wow.min.js" strategy="afterInteractive" />
      <Script src="/web/vendors/magnify-popup/jquery.magnific-popup.min.js" strategy="afterInteractive" />
      <Script src="/web/vendors/particle-js/particles.js" strategy="afterInteractive" />
      <Script src="/web/vendors/particle-js/app.js" strategy="afterInteractive" />
      <Script src="/web/vendors/onePageNav/one-page-nav-min.js" strategy="afterInteractive" />
      <Script src="/web/vendors/meanMenu/jquery.meanmenu.min.js" strategy="afterInteractive" />
      <Script src="/web/vendors/counterup/jquery.waypoints.min.js" strategy="afterInteractive" />
      <Script src="/web/vendors/counterup/jquery.counterup.min.js" strategy="afterInteractive" />
      <Script src="/web/vendors/owl-carousel/owl.carousel.min.js" strategy="afterInteractive" />
      <Script src="/web/vendors/bootstrap-selector/jquery.nice-select.min.js" strategy="afterInteractive" />
      <Script src="/web/js/theme.js" strategy="afterInteractive" />
    </>
  );
}