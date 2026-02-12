// components/ProductFlow/ProductFlow.jsx
import React, { useEffect } from "react";
import "./ProductFlow.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaSeedling, FaCheckCircle, FaBoxOpen, FaTruck } from "react-icons/fa";

const steps = [
  {
    icon: <FaSeedling />,
    title: "Sourcing",
    description: "We partner directly with certified organic farmers to source the purest ingredients."
  },
  {
    icon: <FaCheckCircle />,
    title: "Quality Check",
    description: "Every batch undergoes rigorous lab testing to ensure zero chemicals or impurities."
  },
  {
    icon: <FaBoxOpen />,
    title: "Eco Packaging",
    description: "Packed hygienically in sustainable, eco-friendly materials to preserve freshness."
  },
  {
    icon: <FaTruck />,
    title: "Fast Delivery",
    description: "Dispatched within 24 hours to reach your doorstep while still fresh."
  },
];

const ProductFlow = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="ProductFlow-container">
      <div className="ProductFlow-header" data-aos="fade-up">
        <h2 className="ProductFlow-title">From Farm to Table</h2>
        <p className="ProductFlow-subtitle">
          Experience total transparency. We believe you have the right to know exactly where your food comes from and how it reaches you.
        </p>
      </div>

      <div className="ProductFlow-steps">
        {steps.map((step, index) => (
          <div
            className="ProductFlow-step"
            data-aos="fade-up"
            data-aos-delay={index * 150}
            key={index}
          >
            <div className="ProductFlow-iconWrapper">
              {step.icon}
              <div className="ProductFlow-number">{index + 1}</div>
            </div>
            <div className="ProductFlow-content">
              <h3 className="ProductFlow-stepTitle">{step.title}</h3>
              <p className="ProductFlow-stepDesc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFlow;
