import React from "react"


export default class Experience extends React.Component {
    constructor({data}) {
        super(data)
        this.data = data
    }

    render() {
        return (
            <div className="mt-3">
                <h2 className="heading">Professional Experience</h2>
                { 
                    this.data.map((exp) => {
                    return (
                        <>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>{exp.from} - {exp.to}</th>
                                    <th>{exp.title}</th>
                                    <th>{exp.company}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="3">{exp.description}</td>
                                </tr>
                            </tbody>                           
                        </table> 
                        <br />
                        </>   
                    )
                })
            } 
            </div>
        )
    }
}
