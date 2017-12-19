import React, { Component } from 'react'
import Inventions from '../containers/Inventions'
import Details from '../containers/Details'
import { APIManager } from "../../utils"
import styles from "./styles"
class Home extends Component{
    
    constructor(){
        super()
        this.state = {
            list: []
        }
    }

    componentDidMount(){
        APIManager.get("/api/invention/list", null, (err, results) => {
            if(err){
                alert("ERROR: " + err.message)
                return
            }
           
            results.map((inventions) => {
                inventions.categoryName = inventions.Categories.name
            })

            this.setState({
                list: results
            })
        })
    }
    
    callbackList(updatedData){        
        APIManager.post("/api/invention/create", updatedData, (err, results) => {
            if(err){
                alert("ERROR: " + err.message)
                return
            }
            let newInventionList = Object.assign([], this.state.list);
            newInventionList.push(results);    
            
            this.setState({
                list: newInventionList
            })
        })
    }

    render(){
        return (
            <div className="container" style={styles.home}>
                <div className="row">
                    <div className="col-md-4">
                        <Inventions callbackList={this.callbackList.bind(this)} />
                    </div>
                    
                    <div className="col-md-8">
                        <Details Inventionslist={this.state.list}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home