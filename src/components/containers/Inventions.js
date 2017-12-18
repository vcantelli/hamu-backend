import React, { Component} from 'react'
import Invention from "../presentation/Invention"
import superagent from "superagent"

class Inventions extends Component {
    constructor()
    {
        super()
        this.state = {
            invention: {
                name: "",
                zipcode: "",
                comments:""
            },
            list: [
                {name: "Invention 1", zipcode: "3123", comments: 10},
                {name: "Invention 2", zipcode: "765", comments: 40},
                {name: "Invention 3", zipcode: "31543", comments: 10},
                {name: "Invention 4", zipcode: "1298", comments: 20}
            ]
        }
    }

    updateInvention(event){        
        let inventionUpt = Object.assign({}, this.state.invention)
        inventionUpt[event.target.id] = event.target.value

        this.setState({
            invention: inventionUpt
        })
    }

    addInvention(){
        let inventionAdd = Object.assign([], this.state.list);
        inventionAdd.push(this.state.invention);

        this.setState({
            list: inventionAdd
        })
    }

    render(){

        const listItems = this.state.list.map((invention, i) => {
            return (
                <li key={i}>
                    <Invention inventionDetails={invention}/>  
                </li> 
            )
        })

        return (
            <div> 
                <ol>
                    {listItems}
                </ol>

                <input id="name" onChange={this.updateInvention.bind(this)} className="form-control" type="text" placeholder="Name"></input>
                <br/>
                <input id ="zipcode" onChange={this.updateInvention.bind(this)} className="form-control" type="text" placeholder="Description"></input>
                <br/>
                <button onClick={this.addInvention.bind(this)} className="btn btn-danger">Add Invention</button>
            </div>
        )
    }
}

export default Inventions
