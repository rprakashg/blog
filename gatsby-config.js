'use strict'

module.exports = {
  siteMetadata: {
    url: `https://rprakashg.github.io`,
    title: `rprakashg.github.io`,
    tagline: `Writing about my journey in the world of kubernetes, 
      servicemesh and distributed systems in general`,
    description: `This is a personal website of RAM GOPINATHAN. This site is built with
    Gatsby and React and is hosted on github pages.`,
    author: `RAM GOPINATHAN`,
    links: [
      {
        to: "/",
        text: "Home",
        css: "text-dark d-block py-1",
      },
      {
        to: "/resume",
        text: "Resume",
        css: "text-dark d-block py-1",
      },
      {
        to: "/archive",
        text: "Archive",
        css: "text-dark d-block py-1",
      },
      {
        to: "/contact",
        text: "Contact",
        css: "text-dark d-block py-1",
      },
    ],
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            }
          }
        ]
      }   
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: `images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/posts`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data`
      },
    },
    {
      resolve: `gatsby-transformer-yaml`,
      options: {
        typeName: `Profile`
      }
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Open Sans`,
          `source sans pro\:300,400,400i,700` // you can also specify font weights and styles
        ]
      }
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
          shortname: `rprakashg-github-io`
      }
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "G-FCCC4Z87JP"
        ],
        pluginConfig: {
          head: true,
          respectDHT: true,
          exclude: ["/preview/**", "/do-not-track/me/too/"],
          delayOnRouteUpdate: 0,
        }
      },
    },
  ],
}
