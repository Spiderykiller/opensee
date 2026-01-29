import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";
import nftclass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";



persistent actor openlook {

  private type Lists = {
     itemowner: Principal;
     itemprice: Nat;
  };
  

 transient var mapofnft = HashMap.HashMap<Principal, nftclass.miniter>(1, Principal.equal, Principal.hash);
 transient var mapofowner = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
 transient var mapoflistings = HashMap.HashMap<Principal, Lists>(1, Principal.equal, Principal.hash);

  public shared(msg) func createnft(image: [Nat8], name: Text): async Principal {
    let owner: Principal = msg.caller;

    Cycles.add(2_000_000_000_000);
    let newnft = await nftclass.miniter(name, owner, image);

    let canid: Principal = await newnft.getcanid();
    mapofnft.put(canid, newnft);
    addownernft(owner, canid);
    return canid;
  };

  private func addownernft(owner: Principal, canid: Principal): () {
    var ownlist: List.List<Principal> = 
    switch (mapofowner.get(owner)) {
      case (null) List.nil<Principal>();
      case (?lst) lst;
      };

    ownlist := List.push(canid, ownlist);
    mapofowner.put(owner, ownlist);
    
    };

    public query func getusersid(user: Principal): async [Principal] {
      var userslist: List.List<Principal> = switch (mapofowner.get(user)) {
        case (null) List.nil<Principal>();
        case (?lst) lst;
    };
      return List.toArray(userslist);

    };

    public query func getlistedids(): async [Principal] {
      let idslist = Iter.toArray(mapoflistings.keys());
      return idslist; 
    };

    public shared(msg) func sellitem(nftid: Principal, price: Nat): async Text {
        var itemslist: nftclass.miniter = switch(mapofnft.get(nftid)) {
          case(null) return "NFT doesn't exist";
          case(?lst) lst;
        };
    
        let owners = await itemslist.getowner();
        if (Principal.equal(owners, msg.caller)) {
          let newlisted: Lists = {
          itemowner= owners;
          itemprice= price;
        };
        mapoflistings.put(nftid, newlisted);
        return "Successful";

    } else {
      return "You don't own the NFT";
    }
    
    };

    public query func openlookid(): async Principal {
      return Principal.fromActor(openlook);
    };

    public query func getitemstatus(nftid: Principal): async Bool {
      if(mapoflistings.get(nftid) == null) {
        return false;
      } else {
        return true;
      }
    };
    public query func checkorginalowner(nftid: Principal): async Principal {
      var itemslist: Lists = switch(mapoflistings.get(nftid)) {
        case(null) return Principal.fromText("");
        case(?lst) lst;
      };
      
      return itemslist.itemowner;
};
  public query func pricelistednfts(nftid: Principal): async Nat {
      var itemslist: Lists = switch(mapoflistings.get(nftid)) {
        case(null) return 0;
        case(?lst) lst;
      };
      
      return itemslist.itemprice;
};
  public shared(msg) func finalpurchase(nftid: Principal, orginalowner: Principal, buyerowner: Principal) : async Text {
      var purchasednft: nftclass.miniter = switch(mapofnft.get(nftid)) {
        case(null) return "NFT doesn't exist";
        case(?lst) lst;
      };
      let transferstatus = await purchasednft.transferownership(buyerowner);
      if (transferstatus == "Success") {
       mapoflistings.delete(nftid);
       var ownernftlist: List.List<Principal> = switch(mapofowner.get(orginalowner)) {
        case(null)  List.nil<Principal>();
        case(?result) result;
       };
       ownernftlist := List.filter(ownernftlist, func(listid: Principal) : Bool {
        return nftid != listid;
       });
       addownernft(buyerowner, nftid);
       return "Purchase Successful";
      } else {
        return transferstatus; 
  };



};
}