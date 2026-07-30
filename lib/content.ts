/**
 * Every word on the site lives here. Edit this file, not the components.
 */

export const site = {
  name: "Rithwik",
  tagline: "I build robots",
  email: "mail@rithwiknair.com",
  links: [
    { label: "Email", href: "mailto:mail@rithwiknair.com", icon: "mail" as const },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" as const },
  ],
};

export const hero = {
  eyebrow: "Robotics · Autonomy",
  wordmark: "Rithwik",
  hint: "Drag",
  scroll: "Scroll",
};

export const intro = {
  index: "00",
  label: "About",
  headline: "I design and build robots.",
  body: [
    "Most of what I know came from competitive robotics: designing mechanisms, machining parts, and debugging autonomous code between matches.",
    "I'm most interested in where mechanical design meets software, and in humanoid and autonomous systems in particular.",
  ],
  marquee: [
    "Mechanism design",
    "Autonomy",
    "Controls",
    "CAD",
    "Humanoids",
    "Manufacturing",
    "Computer vision",
    "Drivetrains",
  ],
};

export const passions = {
  index: "01",
  label: "Interests",
  headline: "What I love.",
  items: [
    {
      no: "01",
      title: "Humanoids",
      body: "Humanoid and legged robots are what got me into this. Atlas and Optimus are the clearest examples of the problem I find most interesting: machines that work in spaces built for people.",
      image: "/gallery/optimus.jpg",
      alt: "Standing next to a Tesla Optimus humanoid robot",
      ratio: "4/3",
    },
    {
      no: "02",
      title: "Mechanism design",
      body: "Gear ratios, belt tension, tolerances. Most of my time goes into CAD, and then into actually making the parts.",
      image: "/gallery/robot-topdown.jpg",
      alt: "Overhead view of a competition robot chassis",
      ratio: "3/4",
    },
    {
      no: "03",
      title: "Autonomy",
      body: "Odometry, path following, and vision. Getting a robot to repeat the same routine reliably is harder than it looks.",
      image: "/gallery/ftc-robot-tall.jpg",
      alt: "Competition robot with its lift extended",
      ratio: "3/4",
    },
    {
      no: "04",
      title: "Building it",
      body: "I'd rather be able to build what I design. Machining, printing, soldering, and wiring are part of the job.",
      image: "/gallery/shop-ppe.jpg",
      alt: "In safety goggles, respirator, and headlamp in the shop",
      ratio: "3/4",
    },
  ],
};

export const work = {
  index: "02",
  label: "Work",
  headline: "What I've built.",
  intro:
    "Competitive robotics is where my passion was born, two FIRST programs and several build seasons.",
  entries: [
    {
      no: "01",
      team: "FRC 2583 · Orange Dynamite",
      role: "Student Ambassador",
      years: "FIRST Robotics Competition",
      body: "A 125-pound robot on a six-week build season. I represent 2583 as a Student Ambassador and work on the robot through the season.",
      highlights: [
        "Winner - 2026 FIT District McAllen Event",
        "Impact Award Winner - 2026 FIT District Manor Event",
        "FIRST Championship Playoffs Competitor",
      ],
      image: "/gallery/frc-mcallen-winner.jpg",
      alt: "Team 2583 robot beside the 2026 FIT District McAllen Event winner banner",
      ratio: "3/4",
    },
    {
      no: "02",
      team: "FTC 24133 · CHAI GPT Robotics",
      role: "Build & autonomy",
      years: "FIRST Tech Challenge",
      body: "A smaller team, so I worked across build, CAD, and autonomous. CHAI GPT won the Inspire Award, the top award in FTC, at both league and state level.",
      highlights: [
        "Inspire Award 1st - FIT Central GEMS League Tournament",
        "Inspire Award 1st - Texas State Cup, Mockingbird Division",
        "Inspire Award 3rd - FIT Central Regional Championship",
        "Inspire Award 2nd - FIT Central GEMS League Tournament, 2024-25",
        "FIRST Leadership Award nominee",
      ],
      image: "/gallery/chaigpt-banner.jpg",
      alt: "CHAI GPT 24133 team banner with two robots and Inspire Award trophies",
      ratio: "16/9",
    },
    {
      no: "03",
      team: "Drones & autonomy research",
      role: "SMU",
      years: "Outside the season",
      body: "Outside the competition season I've been working on small autonomous aircraft, including the airframe, onboard compute, and flight software.",
      highlights: ["Custom quadcopter airframe", "Onboard compute & sensing"],
      image: "/gallery/drone.jpg",
      alt: "Custom quadcopter with onboard compute",
      ratio: "3/4",
    },
  ],
  stats: [
    { value: "2", label: "FIRST programs" },
    { value: "4", label: "Inspire Awards" },
    { value: "1", label: "District event win" },
  ],
};

export const personal = {
  index: "03",
  label: "Outside work",
  headline: "Outside of robotics.",
  body: [
    "Outside of the shop, I love to explore, travel, and find new questions to solve.",
  ],
  gallery: [
    {
      image: "/gallery/chai-munnar.jpg",
      alt: "A cup of chai on a wall overlooking the tea hills of Munnar",
      caption: "Munnar, Kerala.",
      span: "tall",
    },
    {
      image: "/gallery/water-dusk.jpg",
      alt: "By the water in New York",
      caption: "New York.",
      span: "wide",
    },
    {
      image: "/gallery/young.jpg",
      alt: "A younger portrait",
      caption: "Where it started.",
      span: "small",
    },
    {
      image: "/gallery/fit-trophies.jpg",
      alt: "Competition robot with a row of FIRST trophies",
      caption: "End of a season.",
      span: "tall",
    },
    {
      image: "/gallery/ftc-two-robots.jpg",
      alt: "Two FTC robots on the practice field",
      caption: "Practice field.",
      span: "wide",
    },
    {
      image: "/gallery/champs-badge.jpg",
      alt: "Championship credential and Student Ambassador ribbon",
      caption: "FIRST Championship.",
      span: "small",
    },
  ],
};

export const outro = {
  index: "04",
  label: "Contact",
  headline: "If you're building something, get in touch.",
};
