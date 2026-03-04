"use client";
import "./navigation-component.css";
import Link from "next/link";

export function NavigationWebsite() {
  return (
    <div className="navigation-website">
      <Link className="navigation-website-logo-home" href="#">
        curamedica
      </Link>
      <div className="navigation-website-wrapper">
        <Link className="navigation-website-wrapper-link" href="#">
          reseach paper
        </Link>
        <Link className="navigation-website-wrapper-link" href="#">
          machine learning models
        </Link>
        <Link className="navigation-website-wrapper-link" href="#">
          agents
        </Link>
        <Link className="navigation-website-wrapper-link" href="#">
          partners
        </Link>
        <Link className="navigation-website-wrapper-link" href="#">
          about us
        </Link>
        <Link className="navigation-website-wrapper-cta" href="#">
          <span className="navigation-website-wrapper-cta-span">log in</span>
          <img src="/icons/arrow-up-right.svg" alt="" />
        </Link>
      </div>
    </div>
  );
}
