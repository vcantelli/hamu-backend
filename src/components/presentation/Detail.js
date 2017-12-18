import React, { Component} from 'react'

class Detail extends Component{
    render(){
        return(
            <div>{this.props.att.name}</div>
        )
    }
}

export default Detail