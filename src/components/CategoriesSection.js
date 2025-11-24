import React from "react";
import { Link } from "react-router-dom";
import kits from "../images/kits.webp";
import training from "../images/training.jpg";
import memorabilia from "../images/memorabilia.webp";

const categories = [
  { title: "Kits", imageUrl: kits },
  { title: "Training", imageUrl: training },
  { title: "Memorabilia", imageUrl: memorabilia },
];

function CategoriesSection() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {categories.map((category, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <div className="card shadow-lg h-100">
              <img src={category.imageUrl} className="card-img-top img-fluid h-100" alt={category.title} />
              <div className="card-body text-center">
                <h5 className="card-title">{category.title}</h5>
                <Link to={`/category/${category.title}`} className="btn btn-danger">
                  View More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesSection;
