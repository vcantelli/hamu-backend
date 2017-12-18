import React, { Component} from 'react'
import Invention from "../presentation/Invention"
import { APIManager } from "../../utils"
import CurrencyInput from 'react-currency-masked-input'

class Inventions extends Component {
    constructor()
    {
        super()
        this.state = {
            invention: {
                name: "",
                description: "",
                quantity:"",
                price: "",
                discountPrice: "",
                categoryName: "",
                categoryId: 0
            },            
            categories: [],
            amount: 10
        }
    }

    componentDidMount(){
        APIManager.get("/api/categories/list", null, (err, results) => {
            if(err){
                alert("ERROR: " + err.message)
                return
            }
    
            let changeCategoryId = Object.assign({}, this.state.invention);
            changeCategoryId.categoryId = results[0].id;
            this.setState({
                invention: changeCategoryId
            })

            this.setState({
                categories: results,
                invention: changeCategoryId
            })
        })
    }

    updateInvention(event){     
        console.log(event.target.id + "==" + event.target.value)
        if(event.target.id == "quantity")        
            if(!(Math.floor(event.target.value) == event.target.value))            
                return      
        let inventionUpdt = Object.assign({}, this.state.invention)
        inventionUpdt[event.target.id] = event.target.value

        this.setState({
            invention: inventionUpdt
        })
    }

    addInvention(){
        if(!this.state.invention.name ||
           !this.state.invention.description ||
           !this.state.invention.price)
        {
            alert("Por favor L., preencha todas as informações")
            return
        }
        if(!this.state.invention.quantity)
        {
            alert("Por favor L., preencha todas as informações corretamente")
            return
        }

        let inventionUpdt = Object.assign({}, this.state.invention)
        inventionUpdt.price = inventionUpdt.price / 10
        inventionUpdt.discountPrice = inventionUpdt.discountPrice / 10
        inventionUpdt.quantity = Math.abs(inventionUpdt.quantity)

        this.props.callbackList(inventionUpdt);
    }

    updateCategory(event){        
        let inventionUpdt = Object.assign({}, this.state.invention);
        inventionUpdt.categoryId = event.target.value;
        this.setState({
            invention: inventionUpdt
        })
    }

    render(){
        const listCategories = this.state.categories.map((category, i) => {
            return (
                <option key={i} value={category.id}>{category.name}</option>
            )
        })

        return (
            <div> 
                
                <input id="name" onChange={this.updateInvention.bind(this)} className="form-control" type="text" placeholder="Name"></input>
                <br/>
                <input id ="description" onChange={this.updateInvention.bind(this)} className="form-control" type="text" placeholder="Description"></input>
                <br/>
                <input id ="quantity" onChange={this.updateInvention.bind(this)} className="form-control" type="number"step={1} min={0} placeholder="Quantity"></input>
                <br/>
                <CurrencyInput id ="price" onChange={this.updateInvention.bind(this)} className="form-control" placeholder="Price" />
                {/* <input id ="price" onChange={this.updateInvention.bind(this)} className="form-control" type="number" step="any" placeholder="Price" pattern="(\d{3})([\.])(\d{2})"></input> */}
                <br/>
                <CurrencyInput id ="discountPrice" onChange={this.updateInvention.bind(this)} className="form-control" type="number" placeholder="Discount"/>
                {/* <input id ="discountPrice" onChange={this.updateInvention.bind(this)} className="form-control" type="number" step="any" placeholder="Discount"></input> */}
                <br/>
                <select value={this.state.invention.categoryId} onChange={this.updateCategory.bind(this)} className="form-control">
                   {listCategories}
                </select>
                <br/>
                <button onClick={this.addInvention.bind(this)} className="btn btn-danger">Add Invention</button>
            </div>
        )
    }
}

export default Inventions
