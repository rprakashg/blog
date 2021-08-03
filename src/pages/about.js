import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import "./index.css"
import Sidebar from "../components/sidebar/Sidebar"

const AboutPage = (props) => {
    return (
        <Layout>
            <div className="post-page-main">
                <div className="sidebar px-4 py-2">
                    <Sidebar />
                </div>
                <div className="post-main">
                    <div className="mt-3">
                        <h2 className="heading">About</h2>
                        
                    </div>
                </div>
            </div>
        </Layout>
    )
}


export default AboutPage

