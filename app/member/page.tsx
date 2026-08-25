import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Member",
  description: `The people behind ${site.name} and the disciplines the company covers across its products.`,
  alternates: { canonical: "/member" },
};


// Default avatar image URL (online placeholder)
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%230e7a57'/%3E%3Ccircle cx='50' cy='35' r='20' fill='%23fff' opacity='0.8'/%3E%3Ccircle cx='50' cy='75' r='25' fill='%23fff' opacity='0.8'/%3E%3C/svg%3E";

// Team data with profile images, names, and roles
const teamData = {
  ceo: {
    name: "Hafiz Ahmed",
    title: "CEO & Founder",
    img: "/img/team-hafiz.webp",
  },
  coFounders: [
    {
      name: "Marzia Mahorin Khan Momo",
      title: "Co-Founder & Product Lead",
      img: "/img/team-momo.webp",
    },
    {
      name: "Co-Founder",
      title: "Co-Founder & Business Lead",
      img: "",
    },
  ],
  cto: {
    name: "Hafiz Ahmed",
    title: "CTO",
    img: "/img/team-hafiz.webp",
  },
  management: [
    {
      name: "Product Manager",
      title: "Product Management",
      img: "",
    },
    {
      name: "Business Analyst",
      title: "Business Analysis",
      img: "",
    },
  ],
  developers: [
    {
      name: "Developer",
      title: "Full Stack Developer",
      img: "",
    },
    {
      name: "Developer",
      title: "Backend Developer",
      img: "",
    },
    {
      name: "Developer",
      title: "Frontend Developer",
      img: "",
    },
    {
      name: "Developer",
      title: "Full Stack Developer",
      img: "",
    },
  ],
  otherRoles: [
    {
      name: "UI/UX Designer",
      title: "User Interface Design",
      img: "",
    },
    {
      name: "QA Engineer",
      title: "Quality Assurance",
      img: "",
    },
    {
      name: "Network Engineer",
      title: "Network Infrastructure",
      img: "",
    },
    {
      name: "Development & Support",
      title: "Technical Support",
      img: "",
    },
  ],
};

// Helper function to get image source with fallback
const getImageSrc = (img: string) => {
  return img || DEFAULT_AVATAR;
};

export default function MemberPage() {
  return (
    <>
      {/* ---- Header Section - Big centered with background ---- */}
      <section className="member-header-full">
        <div className="wrap">
          <div className="member-header-content">
            <h1>Meet Our SolvicoSoft Member</h1>
          </div>
        </div>
      </section>

      {/* ---- Team Structure / Tree ---- */}
      <section className="band team-tree-section">
        <div className="wrap">
          <div className="team-tree-container">
            
            {/* LEVEL 1: CEO */}
            <div className="tree-level tree-level-1">
              <div className="tree-node tree-node-ceo">
                <div className="tree-avatar">
                  <Image
                    src={getImageSrc(teamData.ceo.img)}
                    alt={teamData.ceo.name}
                    width={120}
                    height={120}
                    className="tree-avatar-img"
                  />
                </div>
                <div className="tree-node-info">
                  <span className="tree-name">{teamData.ceo.name}</span>
                  <span className="tree-title">{teamData.ceo.title}</span>
                </div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="tree-connector-line"></div>

            {/* LEVEL 2: Co-Founders */}
            <div className="tree-level tree-level-2">
              {teamData.coFounders.map((coFounder, index) => (
                <div key={index} className="tree-node tree-node-cofounder">
                  <div className="tree-avatar">
                    <Image
                      src={getImageSrc(coFounder.img)}
                      alt={coFounder.name}
                      width={90}
                      height={90}
                      className="tree-avatar-img"
                    />
                  </div>
                  <div className="tree-node-info">
                    <span className="tree-name">{coFounder.name}</span>
                    <span className="tree-title">{coFounder.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Connector Line */}
            <div className="tree-connector-line"></div>

            {/* LEVEL 3: CTO */}
            <div className="tree-level tree-level-3">
              <div className="tree-node tree-node-cto">
                <div className="tree-avatar">
                  <Image
                    src={getImageSrc(teamData.cto.img)}
                    alt={teamData.cto.name}
                    width={90}
                    height={90}
                    className="tree-avatar-img"
                  />
                </div>
                <div className="tree-node-info">
                  <span className="tree-name">{teamData.cto.name}</span>
                  <span className="tree-title">{teamData.cto.title}</span>
                </div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="tree-connector-line"></div>

            {/* LEVEL 4: Management */}
            <div className="tree-level tree-level-4">
              {teamData.management.map((role, index) => (
                <div key={index} className="tree-node tree-node-management">
                  <div className="tree-avatar">
                    <Image
                      src={getImageSrc(role.img)}
                      alt={role.name}
                      width={75}
                      height={75}
                      className="tree-avatar-img"
                    />
                  </div>
                  <div className="tree-node-info">
                    <span className="tree-name">{role.name}</span>
                    <span className="tree-title">{role.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Connector Line */}
            <div className="tree-connector-line"></div>

            {/* LEVEL 5: Developers */}
            <div className="tree-level tree-level-5">
              {teamData.developers.map((role, index) => (
                <div key={index} className="tree-node tree-node-developer">
                  <div className="tree-avatar">
                    <Image
                      src={getImageSrc(role.img)}
                      alt={role.name}
                      width={75}
                      height={75}
                      className="tree-avatar-img"
                    />
                  </div>
                  <div className="tree-node-info">
                    <span className="tree-name">{role.name}</span>
                    <span className="tree-title">{role.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Connector Line */}
            <div className="tree-connector-line"></div>

            {/* LEVEL 6: Other Roles */}
            <div className="tree-level tree-level-6">
              {teamData.otherRoles.map((role, index) => (
                <div key={index} className="tree-node tree-node-other">
                  <div className="tree-avatar">
                    <Image
                      src={getImageSrc(role.img)}
                      alt={role.name}
                      width={75}
                      height={75}
                      className="tree-avatar-img"
                    />
                  </div>
                  <div className="tree-node-info">
                    <span className="tree-name">{role.name}</span>
                    <span className="tree-title">{role.title}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ---- Disciplines Section ---- */}
      <section className="band band-sunken">
        <div className="wrap">
          <div className="head-split">
            <h2>The work the company covers</h2>
            <p className="lead">
              These are functions, not vacancies and not a staff list. Each one describes work
              that has to happen for a product to reach an institution and keep running there.
            </p>
          </div>

          <div className="caps">
            {site.roles.map((role) => (
              <div className="cap" key={role.title}>
                <h3>{role.title}</h3>
                <p>{role.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}