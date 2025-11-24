import React from "react"; 
import {Link} from "react-router-dom"
import {FaFacebook,FaTwitter,FaGithub,FaLinkedin} from "react-icons/fa"
function Footer (){
    return(
        <div>
            <div className="container-fluid bg-dark text-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
  <div className="container py-5">
    <div className="row g-5">
      {/* Address Section */}
      <div className="col-lg-4 col-md-6">
        <h5 className="text-light mb-4">Address</h5>
        <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Spotify Camp Nou, Barcelona, Spain</p>
        <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+961 81 069377</p>
        <p className="mb-2"><i className="fa fa-envelope me-3"></i>72330422@students.liu.edu.lb</p>
        <div className="d-flex pt-2">
          <a className="btn btn-outline-light btn-social rounded-circle" href=""><FaFacebook /></a>
          <a className="btn btn-outline-light btn-social rounded-circle" href=""><FaTwitter /></a>
          <a className="btn btn-outline-light btn-social rounded-circle" href=""><FaGithub /></a>
          <a className="btn btn-outline-light btn-social rounded-circle" href=""><FaLinkedin /></a>
        </div>
      </div>


      {/* Quick Links Section */}
      <div className="col-lg-4 col-md-6">
        <h5 className="text-light mb-4">Quick Links</h5>
        <Link className="btn btn-link text-decoration-none fw-bold text-danger" href="">About Us</Link><br />
        <Link className="btn btn-link text-decoration-none fw-bold text-danger" href="">Contact Us</Link><br />
        <Link className="btn btn-link text-decoration-none fw-bold text-danger" href="">Our Services</Link><br />
        <Link className="btn btn-lin text-decoration-none fw-bold text-danger" href="">Support</Link><br />
      </div>

      {/* Newsletter Section */}
      <div className="col-lg-4 col-md-6">
        <h5 className="text-light mb-4">Newsletter</h5>
        <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
        <div className="position-relative mx-auto" style={{ maxWidth: "400px" }}>
          <input className="form-control border-0 w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
          <button type="button" className="btn btn-danger py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
        </div>
      </div>
    </div>
  </div>

  {/* Copyright Section */}
  <div className="container">
    <div className="copyright">
      <div className="row">
        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
          &copy; <a className="border-bottom text-decoration-none fw-bold text-danger" href="#">Barca Shop</a>, All Right Reserved.
        </div>
        <div className="col-md-6 text-center text-md-end">
          Designed By <a className="border-bottom text-decoration-none fw-bold text-danger" href="https://htmlcodex.com">Mohammad Abdallah</a>
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
    )

}
export default Footer;