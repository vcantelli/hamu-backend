import React, { Component } from 'react'
import Invention from "../presentation/Invention"
import styles from './styles'

class Details extends Component {

    render(){
        const style = styles.detail;        
        const listItems = this.props.Inventionslist.map((invention, i) => {
            return (
                <li key={i}>
                    <Invention inventionDetails={invention}/>  
                </li> 
            )
        })

        return (
            <div>
                <div style={style.detailBox}>
                    <ul style={style.detailList}>
                        {listItems}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Details