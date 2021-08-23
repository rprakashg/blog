import React from "react"

export default class Skills extends React.Component {
    constructor({data}) {
        super(data)
        this.data = data
    }

    render() {
        return (
            <div className="mt-3">
                <h2 className="heading">Skills</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Skill</th>
                        </tr>   
                    </thead>
                    <tbody>
                    {
                        this.data.map( (skill) => {
                            return (
                                <tr>
                                    <td>{skill.category}</td>
                                    <td>{skill.name}</td>  
                                </tr>
                            )
                        })   
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}