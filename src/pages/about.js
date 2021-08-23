import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import "./index.css"
import Sidebar from "../components/sidebar/Sidebar"
import Skills from "../components/about/skills"
import Experience from "../components/about/experience"

export default class AboutPage extends React.Component {

    constructor({data}) {
        super(data)
        this.data = data
    }

    render() {
        return (
            <Layout>
                <div className="post-page-main">
                    <div className="sidebar px-4 py-2">
                        <Sidebar />
                    </div>
                    <div className="post-main">
                        <div className="mt-3">
                            <h2 className="heading">About</h2>
                            <p>
                                {this.data.allProfile.nodes[0].bio}
                            </p>
                            <h2 className="heading">Career Summary</h2>
                            <ul>
                                {
                                    this.data.allProfile.nodes[0].career_summary.map((item) => {
                                        return(
                                            <li>{item.item}</li>
                                        )
                                    })
                                }
                            </ul>
                            <Skills data={this.data.allProfile.nodes[0].skills} />
                            <Experience data={this.data.allProfile.nodes[0].experiences} />
                            <h2 className="heading">Hobbies</h2>
                            <p>
                                {this.data.allProfile.nodes[0].hobbies}
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export const pageQuery = graphql`
    query ProfileQuery {
        allProfile {
            nodes {
                bio
                career_summary{
                    item
                }
                skills{
                    name
                    category
                }
                experiences{
                    company
                    title
                    from
                    to
                    description
                }
                hobbies                
            }    
        }
    }`

