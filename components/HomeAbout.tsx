import Link from "next/link";
import Eyebrow from "./Eyebrow";
import { site } from "@/content/site";
import { 
  FaUniversity, 
  FaLightbulb, 
  FaRocket, 
  FaAward, 
  FaTrophy, 
  FaServer,
  FaGraduationCap,
  FaFileAlt,
  FaChartBar,
  FaFreeCodeCamp
} from "react-icons/fa";

export default function HomeAbout() {
  return (
    <section className="about-section">
      <div className="wrap">
        <div className="about-grid">
          {/* ---- Left Column: Who We Are + Vision + Mission ---- */}
          <div className="about-left">
            <Eyebrow>KNOW WHO WE ARE</Eyebrow>
            <h2>About {site.name}</h2>
            <p className="about-lead">
              {site.about.lead}
            </p>

            <div className="about-vision-mission">
              <div className="about-vision">
                <div className="about-icon-wrapper">
                  <FaLightbulb className="about-icon" />
                </div>
                <h3>Vision</h3>
                <p>{site.about.vision}</p>
              </div>

              <div className="about-mission">
                <div className="about-icon-wrapper">
                  <FaRocket className="about-icon" />
                </div>
                <h3>Mission</h3>
                <p>{site.about.mission}</p>
              </div>
            </div>
          </div>

          {/* ---- Right Column: Recognition + Success + Info System ---- */}
          <div className="about-right">
            <div className="about-recognition">
              <div className="about-icon-wrapper">
                <FaAward className="about-icon" />
              </div>
              <h3>Recognition</h3>
              <p>{site.about.recognition}</p>
            </div>

            <div className="about-success">
              <div className="about-icon-wrapper">
                <FaTrophy className="about-icon" />
              </div>
              <h3>Success</h3>
              <p>{site.about.success}</p>
              <div className="about-success-logos">
                {site.about.successBadges.map((badge, index) => (
                  <span key={index} className="success-badge">
                    <FaUniversity className="badge-icon" /> {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="about-info-system">
              <div className="about-icon-wrapper">
                <FaServer className="about-icon" />
              </div>
              <h3>Information Systems</h3>
              <p>
                {site.name} has developed a range of software applications 
                including:
              </p>
              <ul className="about-info-list">
                {site.about.infoSystems.map((system, index) => {
                  const icons = [
                    <FaUniversity key="uni" className="info-icon" />,
                    <FaChartBar key="chart" className="info-icon" />,
                    <FaFreeCodeCamp key="free" className="info-icon" />
                  ];
                  const isFree = system.type === "Free";
                  return (
                    <li key={index} className={isFree ? "free-item" : ""}>
                      <span className="info-icon-wrapper">
                        {icons[index % icons.length]}
                      </span>
                      <span className="info-text">
                        {system.name}
                        {isFree && (
                          <span className="free-badge">FREE</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}