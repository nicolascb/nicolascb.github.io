import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://nicolascb.blog",
  author: "Nicolas Barbosa",
  desc: "tech notes",
  title: "Nicolas Barbosa",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOCALE = ["pt-BR"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/nicolascb",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nicolascb/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:ndevbarbosa@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
];
