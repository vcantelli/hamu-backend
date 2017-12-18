import React, { Component } from 'react'
import Detail from '../presentation/Detail'
import styles from './styles'

class Details extends Component {

    constructor(){
        super()
        this.state = {
            list:[
                { body:'detail 1', name: 'invention 1'},
                { body:'detail 2', name: 'invention 2'},  
                { body:'detail 3', name: 'invention 3'},
                { body:'detail 4', name: 'invention 4'}
                
            ]
        }
    }

    render(){
        const style = styles.detail;
        const detailList = this.state.list.map((detail, i) => {
            return (
                <li key={i}><Detail att={detail}/></li>
            )
        })

        return (
            <div>
                <h2>Invention 1</h2>
                <div style={style.detailBox}>
                    <ul style={style.detailList}>
                        {detailList}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Details