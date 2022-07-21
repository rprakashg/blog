import React from "react"
import {
    FaLinkedin,
    FaGithubSquare,
    FaStackOverflow,
    FaTwitter,
    FaFacebook,
    FaInstagram
} from "react-icons/fa"


const SocialLinks = ({ contacts }) => {
    return (
        <div className="social-links float-right mr-4">
            <a className="text-primary ml-4"
                href={contacts.twitter}>
                <span title="Twitter">
                    <FaTwitter size={40} style={{color: "#1DA1F2"}} />
                </span>
            </a>
            <a className="text-primary ml-4"
                href={contacts.facebook}>
                <span title="Facebook">
                    <FaFacebook size={40} style={{color: "#4267B2"}} />
                </span>
            </a>
            <a className="text-primary ml-4"
                href={contacts.instagram}>
                <span title="Instagram">
                    <FaInstagram size={40} style={{color: "#C13584"}} />
                </span>
            </a>
            <a className="text-primary ml-4"
                href={contacts.linkedin}>
                <span title="Linked In">
                    <FaLinkedin size={40} style={{ color: "#0e76a8" }} />
                </span>
            </a>
            <a className="text-light ml-4"
                href={contacts.github}>
                <span title="GitHub">
                    <FaGithubSquare size={40} style={{ color: "#6e5494" }} />
                </span>
            </a>
            <a className="text-warning ml-4"
                href={contacts.stackoverflow}>
                <span title="Stack Overflow">
                    <FaStackOverflow size={40} style={{ color: "#EF8236" }} />
                </span>
            </a>
        </div>
    )
}

export default SocialLinks