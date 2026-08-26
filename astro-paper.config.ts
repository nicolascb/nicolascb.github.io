import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://nicolascb.github.io/",
    title: "nicolascb",
    description: "Notas e aprendizados de um desenvolvedor de software.",
    author: "Nicolas Barbosa",
    profile: "https://nicolascb.github.io/about/",
    ogImage: "default-og.jpg",
    lang: "pt-BR",
    timezone: "America/Sao_Paulo",
    dir: "ltr",
    googleAnalyticsId: "G-G9KMR7G27C",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/nicolascb/nicolascb.github.io/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/nicolascb" },
    { name: "linkedin", url: "https://linkedin.com/in/nicolascb/" },
    { name: "mail", url: "mailto:ndevbarbosa@gmail.com" },
  ],
  shareLinks: [
    {
      name: "linkedin",
      url: "https://www.linkedin.com/sharing/share-offsite/?url=",
    },
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
