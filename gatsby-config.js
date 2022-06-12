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
        to: "/about",
        text: "About",
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
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/posts`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
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
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
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
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Open Sans`,
          `source sans pro\:300,400,400i,700` // you can also specify font weights and styles
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-pdf',
      options: {
        path: "/resume",
        outputPath: "/public/pdf",
      },
    }
  ],
}
