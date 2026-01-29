import React, {useEffect, useState} from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/nft"; 
import { idlFactory as tokenidlFactory } from "../../declarations/dEma_backend";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { nft } from "../../declarations/nft";
import { openlook_backend } from "../../declarations/openlook_backend";
import { set } from "react-hook-form";
import CURRENT_USER_ID from "./main";
import Priceshow from "./Priceshow";


function Item(props) {

  const [actor, setActor] = useState(null);
  const [itemid, setItemid] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [loading, setIsLoading] = useState(true);
  const [button, setButton] = useState();
  const [inputarea, setArea] = useState();
  const [blur, setBlur] = useState();
  const [itemstatus, setItemstatus] = useState("");
  const [priceseen, setSeen] = useState();
  const [isdisplayed, setIsdisplayed] = useState(true);


  useEffect(() => {
    const setupAgent = async () => {
      try {
        const canids = props.cid;
        const localhost = "http://127.0.0.1:4943"; // ✅ for local dev
        const agent = await HttpAgent.create({ host: localhost });

        if (process.env.NODE_ENV !== "production") {
            await agent.fetchRootKey();
        }

        // 🧩 Create the actor here
        const newActor = Actor.createActor(idlFactory, {
          agent,
          canisterId: canids, // your canister id from declarations
        });

        console.log("Actor created successfully:", newActor);
        setActor(newActor); // store actor in React state for later use

        const result1 = await newActor.getname();
        setItemid(result1);
        const result2 = await newActor.getowner();
        setOwner(result2.toText());
        const result3 = await newActor.getimage();
        const bytearray = new Uint8Array(result3);
        const imagecontent = URL.createObjectURL(new Blob([bytearray.buffer], { type: 'image/png' }));
        setImage(imagecontent);

       if (props.role == "collection") { 
           const checkedresult = await openlook_backend.getitemstatus(props.cid);
           console.log("Item status checked:", checkedresult);
           if (checkedresult) {
            setItemstatus(" - Listed for Sale");
            setBlur({filter: "blur(4px)"});
            setOwner("openLook");
            } else {
            setButton(<Button handleclick={handleselling} text={"Sell"} />);
          }

       } else if (props.role == "discover") { 
          setBlur({ filter: "none" });
          const ownerstatus = await openlook_backend.checkorginalowner(props.cid);
          console.log("Original owner fetched:", ownerstatus.toText());

          if (ownerstatus.toText() != CURRENT_USER_ID.toText()) {
            setButton(<Button handleclick={handlebuying} text={"Buy"}/>)
        }
          const pricenfts = await openlook_backend.pricelistednfts(props.cid);
          setSeen(<Priceshow priceshow={pricenfts.toString()} />)

       }


      } catch (err) {
        console.error("Failed to initialize actor:", err);
      }
    };

    setupAgent();
  }, [props.cid]);
  let price;
    function handleselling() {
      
      setArea(<input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(event) => {
          price = event.target.value;
        }} />);

        setButton(<Button handleclick={handlesellback} text={"Confirm"}/>);
      
    };

    async function handlesellback() {
        setBlur({filter: "blur(4px)"});
        setIsLoading(false);
        const listingresponse = await openlook_backend.sellitem(props.cid, Number(price));
        if (listingresponse == "Successful") {
          const openlookid = await openlook_backend.openlookid();
          const transferresponse = await nft.transferownership(openlookid);
          if (transferresponse == "Success") {
            setIsLoading(true);
            setArea();
            setOwner("openLook");
            setButton();
            setItemstatus(" - Listed for Sale");
        }
    }

    };

    async function handlebuying() {
      setIsLoading(false);
      const canids = props.cid;
      const localhost = "http://127.0.0.1:4943"; // ✅ for local dev
      const agent = await HttpAgent.create({ host: localhost });
      console.log("Initiating purchase for item:", props.cid);
      if (process.env.NODE_ENV !== "production") {
          await agent.fetchRootKey();
        }
      const tokenactor =  Actor.createActor(tokenidlFactory, {
        agent,
        canisterId: Principal.fromText("uxrrr-q7777-77774-qaaaq-cai"), // dEma_backend canister id
    });
      const sellerid = await openlook_backend.checkorginalowner(props.cid);
      const itemprice = await openlook_backend.pricelistednfts(props.cid);
      const soldvar = await tokenactor.transfer(sellerid, itemprice);
      console.log("Token transfer result:", soldvar);
      if ( soldvar == "success" ) {
        const purchaseresponse = await openlook_backend.finalpurchase(props.cid, sellerid, CURRENT_USER_ID);
        console.log("Final purchase response:", purchaseresponse);
        setIsLoading(true);
        setIsdisplayed(false);
      }
  }
/*  useEffect(() => {
  const fetchItems = async () => {
    if (!actor) return;
    const result1 = await actor.getname();
    setItemid(result1);
    const result2 = await actor.getowner();
  };
  fetchItems();
}, [actor]);*/



  return (
    <div style={{display: isdisplayed ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
         <div hidden={loading} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceseen}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {itemid} <span className="purple-text"> {itemstatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {inputarea}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
