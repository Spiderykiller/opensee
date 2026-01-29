import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Routes, Route, Router } from "react-router-dom";
import { openlook_backend } from "../../declarations/openlook_backend";
import Minter from "./Minter";
import Gallery from "./Gallery";
import CURRENT_USER_ID from "./main";

function Header() {

  const [userNFTs, setUserNFTs] = useState();
  const [listedNFTs, setListedNFTs] = useState();
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingDiscover, setLoadingDiscover] = useState(true);

  async function fetchData() {
    const nftids = await openlook_backend.getusersid(CURRENT_USER_ID);
    console.log("Fetched NFT IDs for user:", nftids);
    setUserNFTs(nftids);
    setLoadingUser(false);
    const listedids = await openlook_backend.getlistedids();
    console.log("Fetched Listed NFT IDs for Discover Gallery:", listedids);
    setListedNFTs(listedids);
    setLoadingDiscover(false)
  };
  useEffect(() => {
    fetchData();
  }, [CURRENT_USER_ID]);

  return (
  <BrowserRouter >
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src="/logo.png" />
          <div className="header-vertical-9"></div>
          <Link to="/">
            <h5 className="Typography-root header-logo-text">OpenLook</h5>
          </Link>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/discover">
              Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/minter">
              Minter
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/collection">
              My NFTs
            </Link>
          </button>
        </div>
      </header>
    </div>
      <Routes>
        <Route path="/" element={<img className="bottom-space" src="/home-img.png" />} />
        <Route path="/discover" element={
          loadingDiscover ? (
          <h2>Loading Discover Gallery...</h2> 
          ) : (
            <Gallery title="Discover" nids={listedNFTs} role="discover" />
          )} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collection" element={
          loadingUser ? (
          <h2>Loading your NFTs...</h2>
          ) : (
            <Gallery title="My NFTs" nids={userNFTs} role="collection" />
          )}/>
      </Routes>
  </BrowserRouter>
  );
}

export default Header;

