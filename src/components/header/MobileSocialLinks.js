import React from "react";
import {
    FaLinkedin,
    FaGithubSquare,
    FaStackOverflow,
    FaTwitter,
    FaFacebook,
    FaInstagram
} from "react-icons/fa"

import "../layout.css"

const MobileSocialLinks = ({ contacts }) => {
    return (
        <div className="bottom-bar py-1">
            <a className="text-primary"
                href={contacts.twitter}>
                <span title="Twitter">
                    <FaTwitter size={26} style={{ color: "primary" }} />
                </span>
            </a>
            <a className="text-primary"
                href={contacts.facebook}>
                <span title="Facebook">
                    <FaFacebook size={26} style={{ color: "primary" }} />
                </span>
            </a>
            <a className="text-primary"
                href={contacts.instagram}>
                <span title="Instagram">
                    <FaInstagram size={26} style={{ color: "primary" }} />
                </span>
            </a>
            <a className="text-primary"
                href={contacts.linkedin}>
                <span title="Linked In">
                    <FaLinkedin size={26} style={{ color: "primary" }} />
                </span>
            </a>
            <a className="text-light"
                href={contacts.github}>
                <span title="GitHub">
                    <FaGithubSquare size={26} style={{ color: "light" }} />
                </span>
            </a>
            <a className="text-warning"
                href={contacts.stackoverflow}>
                <span title="Stack Overflow">
                    <FaStackOverflow size={26} style={{ color: "warning" }} />
                </span>
            </a>
        </div>
    )
}

export default MobileSocialLinks;