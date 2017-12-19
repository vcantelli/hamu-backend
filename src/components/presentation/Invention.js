import React, { Component} from 'react'
import styles from './styles'
class Invention extends Component {
    render(){
        const style = styles.invention;
        let imgsrc;
        if(this.props.inventionDetails.InventionImages)        
            if(this.props.inventionDetails.InventionImages.length > 0)            
                if(this.props.inventionDetails.InventionImages[0])                
                    imgsrc = this.props.inventionDetails.InventionImages[0].image;
        return (
            <div style={style.container}>
                <h2 style={style.header}>
                    <a style={style.title} href="#">{this.props.inventionDetails.name}</a>
                </h2>
                <div className="row">
                    <div className="col-md-4">
                        <span className="detail">Description</span><br/>
                        <span className="detail">Category</span><br/>
                        <span className="detail">Price</span><br/>
                        <span className="detail">Discount</span><br/>
                        <span className="detail">Quantity</span><br/>
                        <span className="detail">Imagem</span><br/>
                    </div>
                    
                    <div className="col-md-8">
                        <span className="detail">{this.props.inventionDetails.description}</span><br/>
                        <span className="detail"> {this.props.inventionDetails.categoryName}</span><br/>
                        <span className="detail"> R$ {this.props.inventionDetails.price}</span><br/>
                        <span className="detail"> R$ {this.props.inventionDetails.discountPrice}</span><br/>
                        <span className="detail"> {this.props.inventionDetails.quantity}</span><br/>
                        <span className="detail"> <img src= {imgsrc}/> </span><br/>
                    </div>
                </div>
            </div>                       
        )
    }
}

export default Invention
