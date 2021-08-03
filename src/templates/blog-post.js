import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import "./blog-post.css"

import Sidebar from "../components/sidebar/Sidebar"

const BlogPost = (props) => {
  const post = props.data.markdownRemark
  const siteName = props.data.site.siteMetadata.title 
  const siteUrl = props.data.site.siteMetadata.url
  const url = `${siteUrl}${props.pageContext.slug}`
  const tags = post.frontmatter.tags

  return (
    <Layout>
      <div className="post-page-main">
        <div className="sidebar px-4 py-2">
          <Sidebar />
        </div>

        <div className="post-main">
          <div className="mt-3">
            <h2 className="heading">{post.frontmatter.title}</h2>
            <div className="d-block">
              
            </div>
            <br />
            <small><i>Published on </i> {post.frontmatter.date}</small>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
      site {
        siteMetadata {
          url
          title
        }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`

export default BlogPost
