import React from "react"
import { StaticQuery, graphql } from "gatsby"
import "bootstrap/dist/css/bootstrap.css"
import Header from "./header/header"
import "./layout.css"

const Layout = ({ children }) => {

  return (
    <StaticQuery
      query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            url
            tagline
            author
          }
        }
        allProfile {
          nodes {
            contact {
              twitter
              instagram
              facebook
              github
              linkedin
              stackoverflow
            }
          }
        }
      }
    `}
      render={data => (
        <>
          <Header
            siteTitle={data.site.siteMetadata.title}
            tagline={data.site.siteMetadata.tagline}
            author={data.site.siteMetadata.author}
            contacts={data.allProfile.nodes[0].contact} />
          <div
            style={{
              margin: `0 auto`,
              padding: `0px 1.0875rem 1.45rem`,
              paddingTop: 0,
            }}>
            <main className="p-4">{children}</main>
            <footer className="text-center">
              <hr/>
              <p className="d-inline">© {new Date().getFullYear()} <a className="text-info" href={data.site.siteMetadata.url}>{data.site.siteMetadata.author}</a>, All Rights Reserved.</p>
              <p className="mt-5 text-muted d-inline">
                <i>
                  Built with {` `} 
                  <a className="text-info" href="https://www.gatsbyjs.org">Gatsby</a> and {` `}
                  <a className="text-info" href="https://reactjs.org">React</a>
                </i>
              </p>
            </footer>
          </div>
        </>
      )}
    />
  )
}

export default Layout
