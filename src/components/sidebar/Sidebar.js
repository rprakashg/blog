import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import Bio from "./Bio"
import "./sidebar.css"

const Sidebar = () => {
    return (
        <StaticQuery
            query={graphql`
                query SiteBioQuery {
                    site {
                        siteMetadata {
                            tagline
                            author
                            links {
                                to
                                text
                                css
                            }
                        }
                    }
                    allMarkdownRemark(
                        limit: 10
                        sort: { fields: [frontmatter___date], order: DESC }
                        filter: { frontmatter: { published: { eq: true } } }
                    ) {
                        edges {
                            node {
                                frontmatter {
                                    tags
                                }
                            }
                        }
                    }
                }
            `}
            render={data => (
                <>
                    <div className="sidebar-main border-right">
                        <Bio author={data.site.siteMetadata.author} tagline={data.site.siteMetadata.tagline} />
                        <div className="page-links">
                            {data.site.siteMetadata.links.map((link) => {
                                return(
                                   <Link to={link.to}>
                                       <span className={link.css}>
                                           {link.text}
                                       </span>
                                   </Link>
                                )        
                            })}
                        </div>
                    </div>
                </>
            )}
        />
    )
}

export default Sidebar