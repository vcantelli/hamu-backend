import React, { Component } from 'react'
import Inventions from './Inventions'
import Details from './Details'

class Home extends Component{
    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <Inventions />
                    </div>
                    
                    <div className="col-md-8">
                        <Details />
                    </div>
                </div>
            </div>
        )
    }
}

export default Home