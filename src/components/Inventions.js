import React, { Component} from 'react'
import Invention from "./Invention"

class Inventions extends Component {
    constructor()
    {
        super()
        this.state = {
            list: [
                {name: "Invention 1", zipcode: "3123", comments: 10},
                {name: "Invention 2", zipcode: "765", comments: 40},
                {name: "Invention 3", zipcode: "31543", comments: 10},
                {name: "Invention 4", zipcode: "1298", comments: 20}
            ]
        }
    }


    render(){

        const listItems = this.state.list.map((invention, i) => {
            return (
                <li>
                    <Invention inventionDetails={invention}/>  
                </li> 
            )
        })

        return (
            <div> 
                <ol>
                    {listItems}
                </ol>
            </div>
        )
    }
}

export default Inventions
