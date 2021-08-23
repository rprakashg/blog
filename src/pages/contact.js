import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Sidebar from "../components/sidebar/Sidebar"
import {
    FaHome,
    FaEnvelope,
    FaPhone
} from "react-icons/fa"

import "./index.css"

export default class ContactPage extends React.Component {
    constructor({data}) {
        super(data);
        this.data = data
    }

    state = {
        name: "",
        email: "",
        subject: "",
        message: "",
    }

    handleSubmit = event => {
        event.preventDefault()
        alert(this.state.subject)
        //validate all required values are entered before submitting the form

        //submit the form
        
    }

    handleInputChange = event => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value,
        })
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
                            <h2 className="heading">Contact</h2>
                            <div className="container">
                                <div className="row animated animated-done" data-animate="fadeIn" data-animate-delay="0.1">
                                    <div className="col-md-6">
                                        <form id="contact-form" onSubmit={this.handleSubmit}>
                                            <div className="form-group form-group-sm">
                                                <label className="sr-only" for="contact-name">Name</label>
                                                <input type="text" className="form-control input-sm" id="contact-name" 
                                                    placeholder="Name"
                                                    name="name"
                                                    value={this.state.name} 
                                                    onChange={this.handleInputChange}/>
                                            </div>
                                            <div className="form-group form-group-sm">
                                                <label className="sr-only" for="contact-email">Email</label>
                                                <input type="email" className="form-control input-sm" id="contact-email" 
                                                    placeholder="Email"
                                                    name="email"
                                                    value={this.state.email} 
                                                    onChange={this.handleInputChange} />
                                            </div>
                                            <div className="form-group form-group-sm">
                                                <label className="sr-only" for="subject">Subject</label>
                                                <input type="text" className="form-control input-sm" id="subject"
                                                    placeholder="Subject"
                                                    name="subject"
                                                    value={this.state.subject}
                                                    onChange={this.handleInputChange} />
                                            </div>
                                            <div className="form-group form-group-sm">
                                                <label className="sr-only" for="contact-message">Message</label>
                                                <textarea rows="10" className="form-control input-sm" id="contact-message" 
                                                    placeholder="Message"
                                                    name="message"
                                                    onChange={this.handleInputChange}>
                                                        {this.state.message}
                                                    </textarea>
                                                    
                                            </div>
                                            <input type="submit" className="btn btn-outline-primary btn-sm btn-block border-w-2" value="Send Message" />
                                        </form>
                                    </div>
                                    <div className="col-md-5 offset-md-1 mt-4 mt-md-0 animated animated-done">
                                        <p className="mb-1">
                                            <abbr title="Address">
                                                <FaHome />
                                                {` `} {this.data.allProfile.nodes[0].contact.address.line1}
                                                {` `} {this.data.allProfile.nodes[0].contact.address.line2}<br />
                                                {this.data.allProfile.nodes[0].contact.address.city}{`, `}
                                                {this.data.allProfile.nodes[0].contact.address.state}{` `}
                                                {this.data.allProfile.nodes[0].contact.address.zip}{` `}<br />
                                                {this.data.allProfile.nodes[0].contact.address.country}
                                            </abbr>
                                            
                                        </p>
                                        <p className="mb-1">
                                            <abbr title="email">
                                                <FaEnvelope />
                                                {` `} {this.data.allProfile.nodes[0].contact.email}
                                            </abbr>
                                            
                                        </p>
                                        <p className="mb-1">
                                            <abbr title="email">
                                                <FaPhone />
                                                {` `} {this.data.allProfile.nodes[0].contact.phone}
                                            </abbr>
                                            
                                        </p>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export const PageQuery = graphql`
    query contactQuery {
        allProfile {
            nodes {
                contact{
                    address {
                        line1
                        line2
                        city
                        zip
                        state
                        country
                    }
                    email
                    phone
                }
            }
        }
    }
`

