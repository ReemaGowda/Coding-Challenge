import React, { Component } from 'react';
import axios from 'axios';

const URL ="https://api.blockcypher.com/v1/btc/main/addrs/1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD/balance"

export default class Checkbal extends Component{

    constructor(props){
        super(props);
            this.state = {
               getBalance : [],
            
            }
        }
    componentDidMount(){
        axios.get(URL)
        .then(response => {
            console.log(response.data)
            this.setState({
                getBalance: response.data
            });
        })
        .catch(error => {
            console.log(error);
        })
    }
    render(){
        return(
           
            <div>
              <img src="https://cdn-images-1.medium.com/max/1200/1*qhsL7p_ffEc9O6gITiJ4_A.png" className="logo" alt="logo"/>
                 <h1 className="heading"><span>Bitcoin</span> Blockcyper API address Balance Test</h1>
            <br></br>
            <label>Address: {this.state.getBalance.address}</label>
            <br></br>
            <label>Balance: {this.state.getBalance.balance}</label>
            <br></br>
            <label>Final_balance: {this.state.getBalance.final_balance}</label>
            <br></br>
            <label>n_tx: {this.state.getBalance.n_tx}</label>
            <br></br>
            <label>Total_received: {this.state.getBalance.total_received}</label>
            <br></br>
            <label>Total_sent: {this.state.getBalance.total_sent}</label>
            <br></br>
            <label>Unconfirmed_balance: {this.state.getBalance.unconfirmed_balance}</label>
            <br></br>
            <label>Unconfirmed_n_tx: {this.state.getBalance.unconfirmed_n_tx}</label>
            <br></br>

            <h1 className="pay">For payment Transaction Please run node index.js...Backend folder</h1> 
            </div>

           
        )
    }

}

