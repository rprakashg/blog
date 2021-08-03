import React from "react"
import "./sidebar.css"
import { StaticImage } from "gatsby-plugin-image"

const Bio = ({ author, tagline }) => {
    return (
        <div className="bio-main w-75">
            <StaticImage src="../../images/ram.jpg" className="profile-img" alt="" />
            <h3 className="mt-2 author-bio">{author}</h3>
            <small className="text-muted">{tagline}</small>
        </div>
    )
}

export default Bio