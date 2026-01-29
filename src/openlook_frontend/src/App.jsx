import { useState } from 'react';
import { openlook_backend } from 'declarations/openlook_backend';
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from './Item';
import Minter from './Minter';

function App() {
  // const canid = "uxrrr-q7777-77774-qaaaq-cai";
  return (
    <div className="App">
      <Header />
    {/* <Minter />*/}
    {/*<Item cid = {canid}/>*/}
    {/*  <img className="bottom-space" src={homeImage} /> */}
      <Footer />
    </div>
  );
}



export default App;
