import React from "react";
import "./Landingpage.css";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  { name: "Aarav Mehta", review: "Borganics' honey is my daily ritual. So fresh and pure!", location: "Pune" },
  { name: "Sanya Reddy", review: "The veggies are ultra fresh, even better than the market.", location: "Hyderabad" },
  { name: "Rohit Sharma", review: "Coffee that actually makes me look forward to mornings!", location: "Bangalore" },
  { name: "Neha K.", review: "Affordable and organic—what else do you need?", location: "Vizag" },
  { name: "Manoj B.", review: "Quick delivery and packaging is premium.", location: "Chennai" },
  { name: "Pranavi G.", review: "My toddler loves the fruits. That’s a win!", location: "Warangal" },
  { name: "Ritesh M.", review: "Their cold-pressed oil changed my cooking game.", location: "Delhi" },
  { name: "Tanvi S.", review: "It actually smells like fresh farm produce!", location: "Mumbai" },
  { name: "Harsha J.", review: "Perfect blend of modern delivery & traditional values.", location: "Kolkata" },
];

const Testimonials = () => {
  return (
    <section className="Testimonials-section">
      <div className="Testimonials-header">
        <h2 className="Testimonials-title">Loved by Our Customers</h2>
        <p className="Testimonials-subtitle">See what our community has to say about their Borganics experience.</p>
      </div>

      <div className="Testimonials-carousel">
        <div className="Testimonials-track">
          {/* Duplicate list for infinite scroll effect */}
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div className="Testimonials-card" key={idx}>
              <FaQuoteLeft className="Testimonials-quoteIcon" />
              <p className="Testimonials-text">"{item.review}"</p>

              <div className="Testimonials-author">
                <div className="Testimonials-avatar">
                  {item.name.charAt(0)}
                </div>
                <div className="Testimonials-details">
                  <div className="Testimonials-name">{item.name}</div>
                  <div className="Testimonials-location">{item.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
