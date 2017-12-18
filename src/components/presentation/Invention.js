import React, { Component} from 'react'
import styles from './styles'
class Invention extends Component {
    render(){
        const style = styles.invention;
        return (
            <div style={style.container}>
                <h2 style={style.header}>
                    <a style={style.title} href="#">{this.props.inventionDetails.name}</a>
                </h2>
                <span className="detail">{this.props.inventionDetails.zipcode}</span><br/>
                <span className="detail">{this.props.inventionDetails.comments} comments</span>
            </div>                       
        )
    }
}

export default Invention
