/**
 * Every word and image on the site lives here. Edit this file, not the components.
 *
 * In titles, wrap a single word in *asterisks* to set it in the serif italic.
 */

export type Shot = {
  src: string;
  alt: string;
  /** width / height */
  ratio: number;
  /** CSS object-position, for keeping the subject in frame when cropped */
  focus?: string;
};

export const site = {
  name: "Rithwik Nair",
  tagline: "I build robots",
  description:
    "I build robots. Director and Design Lead for FRC 2583 Orange Dynamite and Product Engineering Intern at Syrma SGS.",
  url: "https://rithwiknair.com",
  email: "mail@rithwiknair.com",
  links: [
    { label: "Email", href: "mailto:mail@rithwiknair.com", icon: "mail" as const },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" as const },
  ],
};

export const hero = {
  marquee: "Rithwik Nair",
  hint: "Drag to reveal",
  scroll: "Scroll",
};

export const about = {
  index: "01",
  label: "About",
  title: "I design and build *robots*.",
  statement:
    "I love building things, especially robots, and I've been doing it since I was six. It started with Lego, which is how I first qualified for the FIRST World Championship. Today my passion is mechanical design, and the applied physics and math behind engineering.",
  photo: {
    src: "/gallery/first-worlds.jpg",
    alt: "As a kid at the FIRST Championship, holding a Lego trophy",
    ratio: 3 / 4,
    caption: "First time qualifying for Worlds.",
  },
  focus: ["Mechanical design", "Control theory", "ROS & Kinematics"],
};

export const disciplines = [
  "Mechanism design",
  "Autonomy",
  "Controls",
  "CAD",
  "Humanoids",
  "Manufacturing",
  "Computer vision",
  "Drivetrains",
];

export const interests = {
  index: "02",
  label: "Interests",
  title: "What I *love*.",
  items: [
    {
      no: "01",
      title: "Humanoids",
      body: "Humanoid and legged robots are what got me into this. Atlas and Optimus are the clearest examples of the problem I find most interesting: machines that work in spaces built for people.",
      shot: {
        src: "/gallery/optimus.jpg",
        alt: "Standing next to a Tesla Optimus humanoid robot",
        ratio: 4 / 3,
        focus: "58% 45%",
      },
    },
    {
      no: "02",
      title: "Mechanism design",
      body: "Gear ratios, belt tension, tolerances. Most of my time goes into CAD, and then into actually making the parts.",
      shot: {
        src: "/gallery/robot-topdown.jpg",
        alt: "Overhead view of a competition robot chassis",
        ratio: 3 / 4,
        focus: "50% 38%",
      },
    },
    {
      no: "03",
      title: "Control theory",
      body: "PID loops, feedforward, and motion profiles. Getting a lift or an arm to move fast and stop exactly where it should is mostly a math problem.",
      shot: {
        src: "/gallery/ftc-robot-tall.jpg",
        alt: "Competition robot with its lift extended",
        ratio: 3 / 4,
        focus: "50% 50%",
      },
    },
    {
      no: "04",
      title: "Building it",
      body: "I'd rather be able to build what I design. Machining, printing, soldering, and wiring are part of the job.",
      shot: {
        src: "/gallery/shop-ppe.jpg",
        alt: "In safety goggles, respirator, and headlamp in the shop",
        ratio: 3 / 4,
        focus: "50% 32%",
      },
    },
  ],
};

export type WorkEntry = {
  no: string;
  /** team number or organisation, also used in the hero and the About facts */
  short: string;
  team: string;
  program: string;
  /** leave empty when there's no role to name */
  role: string;
  /** lists the role under "Currently" in the hero and the About facts */
  current?: boolean;
  body: string;
  highlights: string[];
  media: Shot[];
  /** "row" puts the images in a band above the details; "split" sets one image beside them */
  layout: "row" | "split";
};

export const work: {
  index: string;
  label: string;
  title: string;
  intro: string;
  stats: { value: string; label: string }[];
  entries: WorkEntry[];
} = {
  index: "03",
  label: "Work",
  title: "What I've *built*.",
  intro:
    "Competitive robotics is where my passion was born, two FIRST programs and several build seasons.",
  stats: [
    { value: "2", label: "FIRST programs" },
    { value: "4", label: "Inspire Awards" },
    { value: "1", label: "District event win" },
  ],
  entries: [
    {
      no: "01",
      short: "FRC 2583",
      team: "Orange Dynamite",
      program: "FIRST Robotics Competition",
      role: "Director and Design Lead",
      current: true,
      body: "A 125-pound robot on a six-week build season. I represent 2583 as the Technical Director and work on the robot through the season.",
      highlights: [
        "Winner - 2026 FIT District McAllen Event",
        "Impact Award Winner - 2026 FIT District Manor Event",
        "FIRST Championship Playoffs Competitor",
      ],
      media: [
        {
          src: "/gallery/render-2583-moon.jpg",
          alt: "Render of the 2583 competition robot",
          ratio: 1800 / 1012,
          focus: "50% 58%",
        },
        {
          src: "/gallery/champs-badge.jpg",
          alt: "FIRST Championship credential for Team 2583",
          ratio: 3 / 4,
          focus: "50% 45%",
        },
        {
          src: "/gallery/frc-mcallen-winner.jpg",
          alt: "Team 2583 robot beside the 2026 FIT District McAllen Event winner banner",
          ratio: 420 / 955,
          // only matters where it's cropped (phones): keep the banner in view
          focus: "50% 64%",
        },
      ],
      layout: "row",
    },
    {
      no: "02",
      short: "FTC 24133",
      team: "CHAI GPT Robotics",
      program: "FIRST Tech Challenge",
      role: "Captain and Design Lead",
      body: "A smaller team, so I worked across build, CAD, and autonomous. CHAI GPT won the Inspire Award, the top award in FTC, at both league and state level.",
      highlights: [
        "Inspire Award 1st - FIT Central GEMS League Tournament",
        "Inspire Award 1st - Texas State Cup, Mockingbird Division",
        "Inspire Award 3rd - FIT Central Regional Championship",
        "Inspire Award 2nd - FIT Central GEMS League Tournament, 2024-25",
        "FIRST Leadership Award Finalist",
      ],
      media: [
        {
          src: "/gallery/chaigpt-banner.jpg",
          alt: "CHAI GPT 24133 team banner with two robots and Inspire Award trophies",
          ratio: 1800 / 1012,
        },
        {
          src: "/gallery/fit-trophies.jpg",
          alt: "Competition robot with a row of FIRST trophies",
          ratio: 3 / 4,
          focus: "50% 70%",
        },
        {
          src: "/gallery/ftc-two-robots.jpg",
          alt: "Two FTC robots on the practice field",
          ratio: 4 / 3,
        },
      ],
      layout: "row",
    },
    {
      no: "03",
      short: "SMU · NYU",
      team: "Drones & autonomy research",
      program: "Outside the season",
      role: "",
      body: "Outside the competition season I've been working on small autonomous aircraft, including the airframe, onboard compute, and flight software.",
      highlights: ["Custom quadcopter airframe", "Onboard compute & sensing"],
      media: [
        {
          src: "/gallery/drone.jpg",
          alt: "Custom quadcopter with onboard compute",
          ratio: 3 / 4,
          focus: "50% 40%",
        },
      ],
      layout: "split",
    },
    {
      no: "04",
      short: "Syrma SGS",
      team: "Electronics design",
      program: "Internship",
      role: "Product Engineering Intern",
      current: true,
      body: "Syrma SGS is an electronics design and manufacturing company. As a product engineering intern, I work on circuit boards from schematic to layout.",
      highlights: ["Schematic capture in KiCad", "PCB layout and 3D review"],
      media: [
        {
          src: "/gallery/syrma-kicad.jpg",
          alt: "A circuit board open in KiCad on a curved monitor, with the layout, a 3D view, and the schematic side by side",
          ratio: 1460 / 1168,
        },
      ],
      layout: "split",
    },
  ],
};

export const personal = {
  index: "04",
  label: "Outside work",
  title: "Outside of *robotics*.",
  body: "Outside of the shop, I love to explore, travel, and find new questions to solve.",
  gallery: [
    {
      src: "/gallery/chai-munnar.jpg",
      alt: "A cup of chai on a wall overlooking the tea hills of Munnar",
      ratio: 3 / 4,
      caption: "Munnar, Kerala.",
      /** frame height as a share of the pinned stage, for a staggered skyline */
      height: 1,
    },
    {
      src: "/gallery/water-dusk.jpg",
      alt: "By the water in New York",
      ratio: 4 / 3,
      caption: "New York.",
      height: 0.74,
      focus: "45% 60%",
    },
    {
      src: "/gallery/dubai.jpg",
      alt: "In a bucket hat below a glass tower in Dubai",
      ratio: 4 / 3,
      caption: "Dubai.",
      height: 0.88,
    },
    {
      src: "/gallery/young.jpg",
      alt: "A younger portrait",
      // a touch wider than the square source, cropped low to drop a phone
      // screenshot's timestamp along the top edge
      ratio: 5 / 4,
      caption: "Where it started.",
      height: 0.6,
      focus: "50% 80%",
    },
  ],
};

export const contact = {
  index: "05",
  label: "Contact",
  title: "If you're building something, get in *touch*.",
};

/** The current roles, as shown in the hero and the About facts. */
export const currentRoles = work.entries
  .filter((e) => e.current)
  .map((e) => ({ role: e.role, team: e.short }));
